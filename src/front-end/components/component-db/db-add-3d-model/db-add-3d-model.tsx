//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/config-general';
import { modelConfig } from '../../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { removeHunChars, logAxiosError } from '../../../../assets/gen-methods';
///////////////////////////////////////////////////////////   DOM
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ProgressViewer } from '../db-shared/progress-viewer/progress-viewer-component';
///////////////////////////////////////////////////////////   SCSS
import 'react-circular-progressbar/dist/styles.css';
import { forEachChild } from 'typescript';
///////////////////////////////////////////////////////////   INTERFACE
interface Model3dState {
  data: any;
  imgData: imgDataType[];
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  uploadingData: any;
  folderName: string;
  modelUuid: string;
  files: UploadFiles | any;
  folderId: string;
}
interface UploadFiles {
  modelUrl: [];
  modelImgs: [];
  modelMaterialUrl: [];
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

interface ModelMethods {
  save3dModel: (e: any) => Promise<void>;
  formBuilder: (i: number, elm: any) => JSX.Element;
}

//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class DbAdd3dModel extends React.Component<any, Model3dState> implements ModelMethods {
  form: React.RefObject<any>;
  private imgD: any = [];
  constructor(props: any) {
    super(props);
    this.state = {
      isSaved: false,
      isThankYou: false,
      isUploading: false,
      uploadingData: null,
      data: {},
      imgData: [],
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [] },
      folderName: '',
      modelUuid: '',
      folderId: nanoid(10).toLocaleLowerCase()
    };
    this.form = React.createRef();
  }
  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {}
  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Save 3d model
   * @param e
   * @memberof DbAdd3dModel
   * @description
   * 1. Check if there is any valid file
   * 2. Create folder
   * 3. Upload files
   * 4. Save data
   * 5. Redirect to thank you page
   * 6. Reset state
   * 7. Reset form
   */

  save3dModel = async (e: any) => {
    e.preventDefault();
    const { data, files, folderName } = this.state;
    let isThereAnyValidFile: boolean = false;
    try {
      const filesData = new FormData();
      for (const file in files) {
        Object.values(files[file]).forEach((individualFile: any, index) => {
          let currentFileType = null;
          if (individualFile.name) currentFileType = individualFile.name.split('.').pop().toLowerCase();
          if (currentFileType && _CONFIG.validation.file.types.includes(currentFileType)) {
            isThereAnyValidFile = true;
            const nameSeparatedByComma: string = data[file].split(',')[index];
            if (individualFile) filesData.append(folderName, individualFile as Blob, nameSeparatedByComma);
          }
        });
      }
      await axios.post(_CONFIG.url.createModel, data, {}).then((response: any) => {
        if (response.data.success === false) {
          throw new Error(_CONFIG.msg.error.fetch.postingData, response);
        }
      });
      let modelId: null = null;
      await axios.get(_CONFIG.url.getLastModelId).then((response: any) => {
        if (response.data.success === false) throw new Error(_CONFIG.msg.error.fetch.postingData, response);
        modelId = response.data[0].modelId;
      });
      let imgPush: any[] = [];
      Object.keys(this.imgD).forEach((element: any, key: number) => {
        this.imgD[element].forEach((e: any, k: number) => {
          imgPush.push(this.imgD[element][k]);
          this.imgD[element][k].joinFromTable = _CONFIG.db.tableName3d;

          this.imgD[element][k].joinId = modelId;
          this.imgD[element][k].joinUuid = data.modelUuid;
        });
      });

      await axios
        .post(_CONFIG.url.createImage, imgPush)
        .then((response: any) => {
          console.log('imgPush', imgPush);
          console.log('imgPush response', response);
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });

      if (isThereAnyValidFile) {
        this.setState({ isUploading: true });
        await axios
          .post(_CONFIG.url.uploadFiles, filesData, {
            headers: { 'content-type': 'multipart/form-data' },
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
      } else {
        this.setState({ isUploading: false, isThankYou: false, isSaved: true });
      }
      isThereAnyValidFile = false;
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.postingData);
    }
  };

  /**
   * Input file data updater
   * @param elm string
   * @param e file data
   * @memberof DbAdd3dModel
   * @description
   * Update state with uuuid file names
   */
  inputFileDataUpdater = (elm: string, e: any) => {
    e.preventDefault();
    try {
      this.imgD[elm] = [];

      if (e.target.files.length > _CONFIG.validation.file.maxFiles) {
        alert(_CONFIG.msg.error.file.maxFileLimit);
        return;
      }

      if (e.target.files.length > 0) {
        //_CONFIG.validation.file.types.includes(currentFileType)
        for (let i = 0; i <= e.target.files.length - 1; i++) {
          let item = e.target.files.item(i);
          console.log('this.state.data', this.state.data.modelUuid);
          console.log('this.state.folderName', this.state.folderName);
          this.imgD[elm].push({
            ...this.state.data,
            imgFileType: item.name.split('.').pop().toLowerCase(),
            imgFileSize: Math.round(item.size),
            imgOriginalFileName: item.name.toLocaleLowerCase(),
            imgFolderPath: `${_CONFIG.url.uploadFolder}${this.state.folderName}`,
            imgFileNameWithoutExtension: item.name.split('.').slice(0, -1).join('.').toLocaleLowerCase(),
            imgFileExtension: item.name.split('.').pop(),
            imgVisibility: 1,
            imgUuid: nanoid(10).toLocaleLowerCase(),
            imgFileMimeType: item.type,
            imgFileLastModified: item.lastModified,
            imgFileLastModifiedDate: item.lastModifiedDate,
            joinFromInput: elm
          });

          if (!_CONFIG.validation.file.types.includes(this.imgD[elm][i].imgFileType)) {
            alert(_CONFIG.msg.error.file.notValid);
            return;
          }
          if (this.imgD[elm][i].imgFileSize < _CONFIG.validation.file.minFileSize) {
            alert(_CONFIG.msg.error.file.tooSmall);
            return;
          }
          if (this.imgD[elm][i].imgFileSize > _CONFIG.validation.file.maxFileSize) {
            alert(_CONFIG.msg.error.file.tooBig);
            return;
          }
        }
      }
      let files = { ...this.state.files };
      files[elm] = e.target.files;
      this.setState({ files });
      let filesTxt: string = '';
      let filesTxtForImgs: string = '';
      Array.from(e.target.files).forEach((value: any, key: number) => {
        console.log(`Index: ${key}, Value: ${value.name}`);
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
        this.imgD[elm][key]['imgFileName'] = filesTxtForImgs;
      });
      console.log('filesTxt>>>', filesTxt);
      console.log('this.state.data22>>>', this.state.data);
      this.setState({
        data: {
          ...this.state.data,
          [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
        },
        imgData: this.imgD,
        isSaved: false
      });
    } catch (error) {}
  };

  /**
   * Input data updater
   * @param elm string
   * @param e any
   * @returns void
   * @memberof DbAdd3dModel
   */
  inputDataUpdater = (elm: string, e: any) => {
    const { folderId } = this.state;
    this.setState({
      data: {
        ...this.state.data,
        [elm]: e
      }
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
   * Switcher
   * @param elm any
   * @param trgVal any
   * @returns
   * @memberof DbAdd3dModel
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
   * Form builder
   * @param i number
   * @param elm any
   * @returns
   * @description Build form from modelConfig
   */
  formBuilder = (i: number, elm: any) => {
    let { data, folderId } = this.state,
      ctr: string = modelConfig[i].control,
      category: string[] | undefined = modelConfig[i].categories;
    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} id={`ctr${i}`} label={elm.label} defaultChecked={elm.name === 'modelVisibility' ? true : false} onChange={(e) => this.switcher(elm.name, e.target.checked)} />;
      case 'select':
        return (
          <Form.Select onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}>
            {Array.isArray(category)
              ? category.map((element: any, x: number) => (
                  <option key={x} value={element}>
                    {element}
                  </option>
                ))
              : null}
          </Form.Select>
        );
      case 'file':
        return <Form.Control multiple type={ctr} name={folderId ? folderId : ''} onChange={(e) => this.inputFileDataUpdater(elm.name, e)} accept={_CONFIG.validation.file.forntendTypes}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>;
      default:
        return <Form.Control maxLength={elm.maxLength} disabled={elm.name === 'modelUuid' ? true : false} type={ctr} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)} required={elm.isRequired}></Form.Control>;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { isSaved, isThankYou, isUploading, uploadingData } = this.state;
    return isThankYou ? (
      <div>köszi</div>
    ) : isSaved ? (
      <Navigate to='/' />
    ) : isUploading ? (
      <ProgressViewer uploadingData={uploadingData} />
    ) : (
      <Form onSubmit={this.save3dModel} ref={this.form}>
        {modelConfig
          ? modelConfig.map((elm: any, i: number) => {
              const enableForAddEdit: boolean = modelConfig[i].enableForAddEdit;
              return enableForAddEdit ? (
                <Form.Group key={i}>
                  {<Form.Label>{elm.label}</Form.Label>}
                  {this.formBuilder(i, elm)}
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
