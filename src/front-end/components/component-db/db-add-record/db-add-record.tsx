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
interface RecordState {
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
  recordUrl: [];
  modelImgs: [];
  modelMaterialUrl: [];
  modelVideos: [];
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
  saveRecod: (e: any) => Promise<void>;
  formBuilder: (i: number, elm: any) => JSX.Element;
}

//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class DbAddRecord extends React.Component<any, RecordState> implements ModelMethods {
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
      files: { recordUrl: [], modelImgs: [], modelMaterialUrl: [], modelVideos: [] },
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
   * Save 3d model to database
   * @param e: onclick event
   */
  saveRecod = async (e: any) => {
    e.preventDefault();
    const { data, files, folderName } = this.state;
    const filesData = new FormData();
    let isThereAnyValidFile: boolean = false;

    // Prepare filesData and check if there is at least one valid file
    for (const file in files) {
      Object.values(files[file]).forEach((individualFile: any, index) => {
        const currentFileType = individualFile?.name?.split('.').pop()?.toLowerCase();
        if (currentFileType && _CONFIG.validation.file.types.includes(currentFileType)) {
          isThereAnyValidFile = true;
          const nameSeparatedByComma: string = data[file].split(',')[index];
          filesData.append(folderName, individualFile as Blob, nameSeparatedByComma);
        }
      });
    }

    try {
      // Create model
      const modelId = await this.postForModelDb(data);

      // Create images
      await this.postForImageDb(modelId);

      // Create images
      await this.postForVideoDb(modelId);

      // Upload files (if there is at least one valid file)
      if (isThereAnyValidFile) {
        this.setState({ isUploading: true });
        const response: any = await this.uploadFiles(filesData);
        if (response?.data.success === false) {
          throw new Error(_CONFIG.msg.error.file.uploading, response);
        }
      } else {
        this.setState({ isUploading: false, isThankYou: false, isSaved: true });
      }
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.postingData);
    }
  };

  /**
   * Create 3d model in database
   * @param data
   * @returns
   */
  postForModelDb = async (data: any) => {
    const { url, msg } = _CONFIG;
    const response: any = await axios.post(url.createModel, data, {});
    if (response.data.success === false) {
      throw new Error(msg.error.fetch.postingData, response);
    }
    const response2: any = await axios.get(url.getLastModelId);
    if (response2.data.success === false) {
      throw new Error(msg.error.fetch.postingData, response2);
    }
    return response2.data[0].modelId;
  };

  /**
   * Create images in database
   * @param modelId
   */
  postForImageDb = async (modelId: number) => {
    const { data } = this.state;
    const { db, url } = _CONFIG;
    let postArr: any[] = [];
    Object.keys(this.imgD).forEach((element: any, key: number) => {
      if (element === 'modelImgs' || element === 'modelMaterialUrl') {
        this.imgD[element].forEach((e: any, k: number) => {
          postArr.push(this.imgD[element][k]);
          this.imgD[element][k].joinFromTable = db.tableName3d;
          this.imgD[element][k].joinId = modelId;
          this.imgD[element][k].joinUuid = data.modelUuid;
        });
      }
    });
    const response = await axios.post(url.createImage, postArr);
  };
  /**
   * Create videos in database
   * @param modelId
   */
  postForVideoDb = async (modelId: number) => {
    const { data } = this.state;
    const { db, url } = _CONFIG;
    let postArr: any[] = [];
    Object.keys(this.imgD).forEach((element: any, key: number) => {
      console.log('element', element);
      if (element === 'modelVideos') {
        this.imgD[element].forEach((e: any, k: number) => {
          postArr.push(this.imgD[element][k]);
          this.imgD[element][k].joinFromTable = db.tableName3d;
          this.imgD[element][k].joinId = modelId;
          this.imgD[element][k].joinUuid = data.modelUuid;
        });
      }
    });
    const response = await axios.post(url.createVideo, postArr);
  };

  /**
   * Upload files to server
   * @param filesData
   */
  uploadFiles = async (filesData: FormData) => {
    const { db, url, msg } = _CONFIG;
    try {
      const response: any = await axios.post(url.uploadFiles, filesData, {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: (data) => {
          this.setState({ uploadingData: data });
        }
      });

      if (response.data.success === false) {
        throw new Error(msg.error.file.uploading, response);
      } else {
        setTimeout(() => {
          this.setState({ isUploading: false, isThankYou: true });
        }, 1500);

        setTimeout(() => {
          this.setState({ isThankYou: false, isSaved: true });
        }, 2250);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  /**
   * Input file data updater
   * @param elm string
   * @param e file data
   * @memberof DbAddRecord
   * @description
   * Update state with uuuid file names
   */
  // TODO:: copy this function to edit videos it's missing!!

  inputFileDataUpdater = (elm: string, e: any) => {
    e.preventDefault();
    const { validation, msg, url } = _CONFIG;
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
        for (let i = 0; i <= e.target.files.length - 1; i++) {
          let item = e.target.files.item(i);
          this.imgD[elm].push({
            ...this.state.data,
            [`${category}FileType`]: item.name.split('.').pop().toLowerCase(),
            [`${category}FileSize`]: Math.round(item.size),
            [`${category}OriginalFileName`]: item.name.toLocaleLowerCase(),
            [`${category}FolderPath`]: `${url.uploadFolder}${this.state.folderName}`,
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
        isSaved: false
      });
    } catch (error) {}
  };

  /**
   * Input data updater
   * @param elm string
   * @param e any
   * @returns void
   * @memberof DbAddRecord
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
   * @memberof DbAddRecord
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
    const { validation } = _CONFIG;
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
        return <Form.Control multiple type={ctr} name={folderId ? folderId : ''} onChange={(e) => this.inputFileDataUpdater(elm.name, e)} accept={elm.name === 'recordUrl' ? validation.file.web3dTypes : elm.name === 'modelImgs' || elm.name === 'modelMaterialUrl' ? validation.file.imgTypes : validation.file.vidTypes}></Form.Control>;
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
      <Form onSubmit={this.saveRecod} ref={this.form}>
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
