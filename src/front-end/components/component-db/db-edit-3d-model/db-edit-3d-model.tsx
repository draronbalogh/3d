//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Navigate } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/config-general';
import { modelConfig } from '../../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios, { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { removeHunChars, logAxiosError } from '../../../../assets/gen-methods';
///////////////////////////////////////////////////////////   DOM
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ProgressViewer } from '../db-shared/progress-viewer/progress-viewer-component';
///////////////////////////////////////////////////////////   SCSS
import 'react-circular-progressbar/dist/styles.css';
///////////////////////////////////////////////////////////   INTERFACE
interface ModelProps {
  data: any;
}
interface UploadFiles {
  modelUrl: [];
  modelImgs: [];
  modelMaterialUrl: [];
}
interface Model3dState {
  modelId: number | undefined;
  data: any;
  uploadingData: any;
  files: UploadFiles | any;
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  oldFilesToDel: any;
  modelUuid: string;
  folderId: string;
  folderName: string;
  deleteTheseFiles: string[];
}
declare module 'react' {
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class DbEdit3dModel extends React.Component<ModelProps, Model3dState> {
  static imgArray: any[] = [];
  private imgD: any = [];
  constructor(props: any) {
    super(props);
    this.state = {
      modelId: Number(window.location.pathname.split('/').pop()),
      isSaved: false,
      isThankYou: false,
      isUploading: false,
      data: this.props.data,
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [] },
      oldFilesToDel: null,
      deleteTheseFiles: [],
      uploadingData: [],
      folderId: '',
      folderName: '',
      modelUuid: ''
    };
  }
  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount(): void {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) this.fetchModelDataById();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.setState({ data: this.props.data });
      DbEdit3dModel.imgArray = [];
    }
  }
  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Find data by modelId
   */
  findDataById = () => {
    const { data, modelId } = this.state;
    const obj = data.find((o: { modelId: any }) => o.modelId === modelId);
    this.setState({ data: obj });
    this.setState({ oldFilesToDel: obj });
  };

  /**
   * Fetch 3D model data by modelId
   */
  fetchModelDataById = async () => {
    try {
      const { modelId } = this.state;
      const response = await axios.get(_CONFIG.url.modelApi + modelId);
      this.setState({ data: response.data });
      this.setState({ oldFilesToDel: response.data });
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.fetchById);
    }
  };

  /**
   * Input file data updater
   * Collect input data from multiple selected files
   * @param elm string
   * @param e any
   */
  inputFileDataUpdater = async (elm: string, e: any) => {
    e.preventDefault();
    try {
      this.imgD[elm] = [];
      if (e.target.files.length > _CONFIG.validation.file.maxFiles) {
        alert(_CONFIG.msg.error.file.maxFileLimit);
        return;
      }
      if (e.target.files.length > 0) {
        const { oldFilesToDel } = this.state;
        let modelUrl = oldFilesToDel['modelUrl'] ? oldFilesToDel['modelUrl'] : '',
          modelImgs = oldFilesToDel['modelImgs'] ? oldFilesToDel['modelImgs'] : '',
          modelMaterialUrl = oldFilesToDel['modelMaterialUrl'] ? oldFilesToDel['modelMaterialUrl'] : '',
          modelUrlA = modelUrl.split(','),
          modelImgsA = modelImgs.split(','),
          modelMaterialUrlA = modelMaterialUrl.split(',');
        if (elm === 'modelUrl') DbEdit3dModel.imgArray.push(modelUrlA);
        if (elm === 'modelImgs') DbEdit3dModel.imgArray.push(modelImgsA);
        if (elm === 'modelMaterialUrl') DbEdit3dModel.imgArray.push(modelMaterialUrlA);
        this.setState({ deleteTheseFiles: DbEdit3dModel.imgArray.flat(1) });
      }
      let files = { ...this.state.files },
        filesTxt = '';
      files[elm] = e.target.files;
      this.setState({ files });
      for (const i of e.target.files) {
        const fileName: string = i.name;
        filesTxt += `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-zA-Z0-9.]/g, '-')},`;
      }
      this.setState({
        data: {
          ...this.state.data,
          [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
        },
        isSaved: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Input data updater
   * @param elm string
   * @param e any
   */
  inputDataUpdater = (elm: string, e: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: e
      },
      isSaved: false
    });
    if (elm === 'modelTitle')
      this.setState({ modelUuid: removeHunChars(e) }, () => {
        const { modelUuid } = this.state;
        this.setState({
          data: {
            ...this.state.data,
            modelUuid: modelUuid + '-' + this.state.data.folderId
          },
          folderName: modelUuid + '-' + this.state.data.folderId
        });
      });
    this.setState({ isSaved: false });
  };

  /**
   * Update 3D model
   * @param e any
   */
  update3dModel = async (e: any) => {
    const { data, deleteTheseFiles, modelId } = this.state;
    const { modelUuid } = data;
    console.log('data', data);
    console.log('modelUuid', modelUuid);
    try {
      e.preventDefault();
      let isThereAnyValidFile = false;
      DbEdit3dModel.imgArray = [];
      await axios.post(_CONFIG.url.deleteModelFiles, { deleteTheseFiles, modelId, modelUuid, deleteFolder: false }, {});
      await axios.patch(_CONFIG.url.modelApi + modelId, data);
      // await axios.patch(_CONFIG.url.imageApi + modelId, data);
      const { files } = this.state;
      const filesData = new FormData();
      for (const file in files) {
        if (files[file].length > 0) {
          isThereAnyValidFile = true;
        }
        Object.values(files[file]).forEach((individualFile, index) => {
          const nameSeparatedByComma = data[file].split(',')[index];
          if (individualFile) filesData.append(modelUuid, individualFile as Blob, nameSeparatedByComma);
        });
      }
      if (isThereAnyValidFile) {
        this.setState({ isUploading: true });
        await axios
          .post(_CONFIG.url.uploadFiles, filesData, {
            headers: {
              'content-type': 'multipart/form-data'
            },
            onUploadProgress: (data) => {
              this.setState({ uploadingData: data });
            }
          })
          .then((response: any) => {
            if (response.data.success === false) {
              throw new Error(_CONFIG.msg.error.file.uploading, response);
            } else {
              setTimeout(() => {
                this.setState({ isUploading: false, isThankYou: true });
              }, 1500);
              setTimeout(() => {
                this.setState({ isThankYou: false, isSaved: true });
              }, 2250);
            }
          });
        isThereAnyValidFile = false;
      } else {
        this.setState({ isUploading: false, isThankYou: false, isSaved: true });
      }
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.updating);
    }
  };

  /**
   * Get title from modelConfig
   * @param elm string
   * @returns
   */
  getTitle = (elm: any) => {
    return Object.entries(modelConfig).map(([key, value]) => {
      if (value.name === elm) return value.label;
    });
  };

  /**
   * Switcher
   * @param elm any
   * @param trgVal any
   * @returns
   */
  switcher = (elm: any, trgVal: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: trgVal
      }
    });
    return trgVal;
  };

  ///////////////////////////////////////////////////////////   RENDER METHODS

  /**
   * Print all options from modelConfig
   * @param category any
   * @returns
   */
  printAllOptions = (category: any) => {
    return Array.isArray(category)
      ? category.map((element: any, x: number) => (
          <option key={x} value={element}>
            {element}
          </option>
        ))
      : null;
  };

  /**
   * Form builder
   * @param i number
   * @param elm string
   * @returns
   * @description This function is used to build the form
   */
  formBuilder = (i: number, elm: string, modelId: any) => {
    let { data } = this.state,
      element = data[elm],
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories,
      isRequired = modelConfig[i].isRequired,
      label = modelConfig[i].label;
    // console.log('element', element);
    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} id={`ctr${i}`} label={label} defaultChecked={element} onChange={(e) => this.switcher(elm, e.target.checked)} />;
      case 'select':
        return (
          <Form.Select onChange={(e) => this.inputDataUpdater(elm, e.target.value)} value={element ? element : ''}>
            <>{this.printAllOptions(category)}</>
          </Form.Select>
        );
      case 'file':
        //@ts-ignore
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)} accept={_CONFIG.validation.file.forntendTypes}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control disabled={elm === 'modelTitle' || elm === 'modelUuid' ? true : false} type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)} required={isRequired}></Form.Control>;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { isSaved, isThankYou, isUploading, uploadingData, data } = this.state;
    return isThankYou ? (
      <div>köszi</div>
    ) : isSaved ? (
      <Navigate to='/' />
    ) : isUploading ? (
      <ProgressViewer uploadingData={uploadingData} />
    ) : (
      <Form onSubmit={this.update3dModel}>
        {modelConfig
          ? modelConfig.map((elm: any, i: number) => {
              const ctr: string = modelConfig[i].control,
                enableForAddEdit: boolean = modelConfig[i].enableForAddEdit;
              return enableForAddEdit ? (
                <Form.Group key={i}>
                  {<Form.Label>{elm.label}</Form.Label>}
                  {this.formBuilder(i, elm.name, data.modelId)}
                </Form.Group>
              ) : null;
            })
          : null}
        <div className='field'>
          <Button variant='primary' type='submit'>
            Mentés
          </Button>
        </div>
      </Form>
    );
  }
}
