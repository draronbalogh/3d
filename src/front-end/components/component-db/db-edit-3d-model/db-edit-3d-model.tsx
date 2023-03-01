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
import { nanoid } from 'nanoid';
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
  modelVideos: [];
}
interface Model3dState {
  data: any;
  imgData: imgDataType[];
  uploadingData: any;
  files: UploadFiles | any;
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  oldFilesToDel: any;
  modelUuid: string;
  folderId: string;
  folderName: string;
  joinFromInput: string[];
  deleteTheseFiles: string[];
  modelId: any;
}
interface imgDataType {
  imgFileType: string;
  imgFileSize: number;
  imgOriginalFileName: string;
  imgFileNameWithoutExtension: string;
  imgFileExtension: any;
  imgFileUuid: string;
  imgFileMimeType: string;
  imgFileLastModified: string;
  imgFileLastModifiedDate: string;
  modelTitle: string;
  modelUuid: string;
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
      imgData: [],
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [], modelVideos: [] },
      oldFilesToDel: null,
      deleteTheseFiles: [],
      uploadingData: [],
      folderId: '',
      folderName: '',
      modelUuid: '',
      joinFromInput: []
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
    const { url, msg } = _CONFIG;
    try {
      const { modelId } = this.state;
      const response = await axios.get(url.modelApi + modelId);
      this.setState({ data: response.data });
      this.setState({ oldFilesToDel: response.data });
    } catch (e: any) {
      logAxiosError(e, msg.error.fetch.fetchById);
    }
  };

  /**
   * Input file data updater
   * Collect input data from multiple selected files
   * @param elm string
   * @param e any
   */
  // TODO:: refactor this function
  inputFileDataUpdater = async (elm: string, e: any) => {
    e.preventDefault();
    const { db, url, msg, validation } = _CONFIG;
    try {
      this.imgD[elm] = [];
      const category = elm === 'modelVideos' ? 'vid' : 'img',
        fT = category + 'FileType',
        fS = category + 'FileSize',
        fN = category + 'FileName';
      if (e.target.files.length > validation.file.maxFiles) {
        alert(msg.error.file.maxFileLimit);
        return;
      }

      if (e.target.files.length > 0) {
        const { oldFilesToDel } = this.state;
        let modelUrl = oldFilesToDel['modelUrl'] ? oldFilesToDel['modelUrl'] : '',
          modelImgs = oldFilesToDel['modelImgs'] ? oldFilesToDel['modelImgs'] : '',
          modelMaterialUrl = oldFilesToDel['modelMaterialUrl'] ? oldFilesToDel['modelMaterialUrl'] : '',
          modelVideos = oldFilesToDel['modelVideos'] ? oldFilesToDel['modelVideos'] : '',
          modelUrlA = modelUrl.split(','),
          modelImgsA = modelImgs.split(','),
          modelMaterialUrlA = modelMaterialUrl.split(','),
          modelVideosA = modelVideos.split(',');
        if (elm === 'modelUrl') DbEdit3dModel.imgArray.push(modelUrlA);
        if (elm === 'modelImgs') DbEdit3dModel.imgArray.push(modelImgsA);
        if (elm === 'modelMaterialUrl') DbEdit3dModel.imgArray.push(modelMaterialUrlA);
        if (elm === 'modelVideos') DbEdit3dModel.imgArray.push(modelVideosA);
        console.log('DbEdit3dModel.imgArray.flat(1) ', DbEdit3dModel.imgArray.flat(1));
        this.setState({ deleteTheseFiles: DbEdit3dModel.imgArray.flat(1) });

        for (let i = 0; i <= e.target.files.length - 1; i++) {
          let item = e.target.files.item(i);
          this.imgD[elm].push({
            ...this.state.data,
            [`${category}FileType`]: item.name.split('.').pop().toLowerCase(),
            [`${category}FileSize`]: Math.round(item.size),
            [`${category}OriginalFileName`]: item.name.toLocaleLowerCase(),
            [`${category}FolderPath`]: `${url.uploadFolder}${this.state.data.modelUuid}`,
            [`${category}FileNameWithoutExtension`]: item.name.split('.').slice(0, -1).join('.').toLocaleLowerCase(),
            [`${category}FileExtension`]: item.name.split('.').pop(),
            [`${category}Visibility`]: 1,
            [`${category}Uuid`]: nanoid(10).toLocaleLowerCase(),
            [`${category}FileMimeType`]: item.type,
            [`${category}FileLastModified`]: item.lastModified,
            [`${category}FileLastModifiedDate`]: item.lastModifiedDate,
            joinFromInput: elm
          });

          if (!validation.file.types.includes(this.imgD[elm][i][fT])) {
            alert(msg.error.file.notValid);
            return;
          }
          if (this.imgD[elm][i][fS] < validation.file.minFileSize) {
            alert(msg.error.file.tooSmall);
            return;
          }
          if (this.imgD[elm][i][fS] > validation.file.maxFileSize) {
            alert(msg.error.file.tooBig);
            return;
          }
        }
      }
      let files = { ...this.state.files },
        filesTxt: string = '',
        filesTxtForImgs: string = '';
      files[elm] = e.target.files;
      this.setState({ files });
      Array.from(e.target.files).forEach((value: any, key: number) => {
        // loop through files with key and value
        const fileName: string = value.name;
        filesTxt += `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-zA-Z0-9.]/g, '-')},`;

        filesTxtForImgs = `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-zA-Z0-9.]/g, '-')}`;
        this.imgD[elm][key][fN] = filesTxtForImgs;
      });
      this.setState({
        data: {
          ...this.state.data,
          [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
        },
        imgData: this.imgD,
        joinFromInput: [elm], // Originally it was an
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
    const { folderId } = this.state;
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
            modelUuid: modelUuid + '-' + folderId
          },
          folderName: modelUuid + '-' + folderId
        });
      });
    this.setState({ isSaved: false });
  };

  /**
   * Update 3D model
   * @param e any
   */
  update3dModel = async (e: any) => {
    e.preventDefault();
    const { data, deleteTheseFiles, modelId } = this.state;
    const { modelUuid } = data;

    try {
      await this.deleteModelFiles(deleteTheseFiles, modelId, modelUuid);
      await this.deleteModelImages(modelId);
      await this.deleteModelVideos(modelId);
      await this.patchModel(modelId, data);
      await this.postForImageDb(modelId, modelUuid, this.imgD);
      await this.postForVideoDb(modelId, modelUuid, this.imgD);
      await this.uploadFiles(data, modelUuid, this.state.files, this.setState.bind(this));
    } catch (error: any) {
      logAxiosError(error, _CONFIG.msg.error.fetch.updating);
    }
  };

  /**
   * Delete model files
   * @param deleteTheseFiles
   * @param modelId
   * @param modelUuid
   */
  deleteModelFiles = async (deleteTheseFiles: any, modelId: string, modelUuid: string) => {
    const { url, msg } = _CONFIG;
    console.log('>>', modelId, modelUuid);
    const response = await axios.post(url.deleteModelFiles, { deleteTheseFiles, modelId, modelUuid, deleteFolder: false }, {});
    if (response.data.success === false) {
      console.log(msg.error.file.deleting, response);
    }
  };

  /**
   * Delete model images
   * @param modelId
   */
  deleteModelImages = async (modelId: string) => {
    const { url, msg } = _CONFIG;
    for (const key in this.imgD) {
      let joinFromInput = key;
      const response = await axios.delete(url.imageApi + modelId + '/' + joinFromInput);
      if (response.data.success === false) {
        console.log(msg.error.file.deleting, response);
      }
    }
  };

  /**
   * Delete model videos
   * @param modelId
   */
  deleteModelVideos = async (modelId: string) => {
    const { url, msg } = _CONFIG;
    for (const key in this.imgD) {
      let joinFromInput = key;
      const response = await axios.delete(url.videoApi + modelId + '/' + joinFromInput);
      if (response.data.success === false) {
        console.log(msg.error.file.deleting, response);
      }
    }
  };
  /**
   * Patch model
   * @param modelId
   * @param data
   */
  patchModel = async (modelId: string, data: any) => {
    const { url, msg } = _CONFIG;
    const response = await axios.patch(url.modelApi + modelId, data);
    if (response.data.success === false) {
      console.log(msg.error.fetch.updating, response);
    }
  };

  /**
   * Create images
   * @param modelId
   * @param modelUuid
   * @param imgD
   */
  postForImageDb = async (modelId: string, modelUuid: string, imgD: any) => {
    const { db, url, msg } = _CONFIG;
    let imgPush: any[] = [];
    Object.keys(imgD).forEach((element: any, key: number) => {
      if (element === 'modelImgs' || element === 'modelMaterialUrl') {
        imgD[element].forEach((e: any, k: number) => {
          imgPush.push(imgD[element][k]);
          imgD[element][k].joinFromTable = db.tableName3d;
          imgD[element][k].joinId = modelId;
          imgD[element][k].joinUuid = modelUuid;
        });
      }
    });
    const response = await axios.post(url.createImage, imgPush);
    if (response.data.success === false) {
      console.log(msg.error.file.uploading, response);
    }
  };

  /**
   * Create images
   * @param modelId
   * @param modelUuid
   * @param imgD
   */
  postForVideoDb = async (modelId: string, modelUuid: string, imgD: any) => {
    const { db, url, msg } = _CONFIG;
    let imgPush: any[] = [];
    Object.keys(imgD).forEach((element: any, key: number) => {
      if (element === 'modelVideos') {
        imgD[element].forEach((e: any, k: number) => {
          imgPush.push(imgD[element][k]);
          imgD[element][k].joinFromTable = db.tableName3d;
          imgD[element][k].joinId = modelId;
          imgD[element][k].joinUuid = modelUuid;
        });
      }
    });
    const response = await axios.post(url.createVideo, imgPush);
    if (response.data.success === false) {
      console.log(msg.error.file.uploading, response);
    }
  };

  /**
   * Upload files
   * @param data
   * @param modelUuid
   * @param files
   * @param setState
   */
  uploadFiles = async (data: any, modelUuid: string, files: any, setState: any) => {
    const { db, url, msg } = _CONFIG;
    const filesData = new FormData();
    let isThereAnyValidFile: boolean = false;
    for (const file in files) {
      if (files[file].length > 0) {
        isThereAnyValidFile = true;
      }
      Object.values(files[file]).forEach((individualFile: any, index) => {
        const nameSeparatedByComma = data[file].split(',')[index];
        if (individualFile) filesData.append(modelUuid, individualFile as Blob, nameSeparatedByComma);
      });
    }

    if (isThereAnyValidFile) {
      setState({ isUploading: true });
      const response: any = await axios.post(url.uploadFiles, filesData, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        onUploadProgress: (data: any) => {
          setState({ uploadingData: data });
        }
      });

      if (response.data.success === false) {
        console.log(msg.error.file.uploading, response);
      } else {
        setTimeout(() => {
          setState({ isUploading: false, isThankYou: true });
        }, 1500);
        setTimeout(() => {
          setState({ isThankYou: false, isSaved: true });
        }, 2250);
      }
    } else {
      setState({ isUploading: false, isThankYou: false, isSaved: true });
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
    const { validation } = _CONFIG;
    let { data } = this.state,
      element = data[elm],
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories,
      isRequired = modelConfig[i].isRequired,
      label = modelConfig[i].label;

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
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)} accept={elm === 'modelUrl' ? validation.file.web3dTypes : elm === 'modelImgs' || elm.name === 'modelMaterialUrl' ? validation.file.imgTypes : validation.file.vidTypes}></Form.Control>;
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
