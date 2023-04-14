//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Navigate } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/config-general';
import { recordConfig } from '../../../../_config/config-records';
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
import { ModelProps, UploadFiles, RecordState, imgDataType, DataObject, Data } from './interfaces';
declare module 'react' {
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class DbEditRecord extends React.Component<ModelProps, RecordState> {
  static imgArray: any[] = [];
  private imgD: any = [];
  constructor(props: any) {
    super(props);
    this.state = {
      recordId: Number(window.location.pathname.split('/').pop()),
      isSaved: false,
      isThankYou: false,
      isUploading: false,
      data: this.props.data,
      imgData: [],
      files: { recordModels3d: [], recordImgs: [], recordMaterialUrl: [], recordVideos: [] },
      oldFilesToDel: null,
      uploadingData: [],
      folderId: '',
      folderName: '',
      recordUuid: '',
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
      DbEditRecord.imgArray = [];
    }
  }
  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Find data by recordId
   */
  findDataById = () => {
    const { data, recordId } = this.state;
    const obj = data.find((o: { recordId: any }) => o.recordId === recordId);
    this.setState({ data: obj });
    this.setState({ oldFilesToDel: obj });
  };

  /**
   * Fetch 3D model data by recordId
   */
  fetchModelDataById = async () => {
    const { url, msg } = _CONFIG;
    try {
      const { recordId } = this.state;
      const response = await axios.get(url.recordApi + recordId);
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
  getCleanedFileName = (fileName: string, includeComma: boolean = false) => {
    const cleanedFileName = `${uuid()}-${fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9.]/g, '-')}`;
    return includeComma ? cleanedFileName + ',' : cleanedFileName;
  };

  isValidFile = (file: File, fileType: string, validation: any, msg: any) => {
    if (!validation.file.types.includes(fileType)) {
      alert(msg.error.file.notValid);
      return false;
    }
    if (file.size < validation.file.minFileSize) {
      alert(msg.error.file.tooSmall);
      return false;
    }
    if (file.size > validation.file.maxFileSize) {
      alert(msg.error.file.tooBig);
      return false;
    }
    return true;
  };

  inputFileDataUpdater = (elm: string, e: any) => {
    e.preventDefault();
    const { validation, msg, url } = _CONFIG;
    let category = 'img';

    const categories: { [key: string]: string } = {
      record: 'record',
      recordModels3d: 'model3d',
      recordVideos: 'vid',
      recordImgs: 'img',
      recordMaterialUrl: 'img'
    };

    category = categories[elm] || 'img';

    if (e.target.files.length > validation.file.maxFiles) {
      alert(msg.error.file.maxFileLimit);
      return;
    }

    this.imgD[elm] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const item = e.target.files.item(i);
      const fileType = item.name.split('.').pop().toLowerCase();

      if (!this.isValidFile(item, fileType, validation, msg)) {
        return;
      }

      const fileData = {
        [`${category}FileType`]: fileType,
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
      };

      this.imgD[elm].push(fileData);
    }

    let files = { ...this.state.files },
      filesTxt = '',
      filesTxtForImgs = '';
    files[elm] = e.target.files;

    Array.from(e.target.files).forEach((value: any, key: number) => {
      const fileName = value.name;
      const fN = `${category}FileName`;

      filesTxt += this.getCleanedFileName(fileName, true);
      filesTxtForImgs = this.getCleanedFileName(fileName);
      this.imgD[elm][key][fN] = filesTxtForImgs;
    });

    this.setState({
      files,
      data: {
        ...this.state.data,
        [elm]: filesTxt.slice(0, -1)
      },
      imgData: this.imgD,
      isSaved: false
    });
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
    if (elm === 'recordTitle')
      this.setState({ recordUuid: removeHunChars(e) }, () => {
        const { recordUuid } = this.state;
        this.setState({
          data: {
            ...this.state.data,
            recordUuid: recordUuid + '-' + folderId
          },
          folderName: recordUuid + '-' + folderId
        });
      });
    this.setState({ isSaved: false });
  };
  processData = (dataArray: DataObject[] | undefined, property: keyof DataObject) => {
    if (!dataArray) {
      return '';
    }
    let resultArr: string[] = [];

    dataArray.forEach((obj: DataObject) => {
      const value = obj[property];

      if (value) {
        if (property === 'recordImgs' || property === 'recordVideos' || property === 'recordModels3d' || property === 'recordMaterialUrl') {
          resultArr.push(...value.split(','));
        } else {
          resultArr.push(value);
        }
      }
    });
    const uniqueResultArr = [...new Set(resultArr)];
    return uniqueResultArr.join(',');
  };
  /**
   * Update 3D model
   * @param e any
   */
  update3dModel = async (e: any) => {
    e.preventDefault();
    const { data, recordId } = this.state;
    const { recordUuid } = data;
    const dataI: Data = this.imgD;
    const recordImgs = this.processData(dataI.recordImgs, 'recordImgs');
    const recordModels3d = this.processData(dataI.recordModels3d, 'recordModels3d');
    const recordMaterialUrl = this.processData(dataI.recordMaterialUrl, 'recordMaterialUrl');
    const recordVideos = this.processData(dataI.recordVideos, 'recordVideos');
    let deleteTheseFiles: string[] = recordImgs.split(',').concat(recordModels3d.split(',')).concat(recordMaterialUrl.split(',')).concat(recordVideos.split(','));
    try {
      // DELETE RECORD FROM FOLDER
      await this.deleteRecordFiles(deleteTheseFiles, recordId, recordUuid);
      // UPLOAD NEW FILES TO FOLDER
      await this.uploadFilesToFolder(data, recordUuid, this.state.files, this.setState.bind(this));
      // DELETE RECORD FROM DB
      await this.deleteFileFromDbTable(recordId, 'image');
      await this.deleteFileFromDbTable(recordId, 'video');
      await this.deleteFileFromDbTable(recordId, 'model3d');
      // UPLOAD NEW DATA TO DBS
      await this.updateRecrodsDbTable(recordId, data);
      await this.postForDb(recordId, recordUuid, this.imgD, 'image');
      await this.postForDb(recordId, recordUuid, this.imgD, 'video');
      await this.postForDb(recordId, recordUuid, this.imgD, 'model3d');

      // await this.postForImageDb(recordId, recordUuid, this.imgD);
      // await this.postForVideoDb(recordId, recordUuid, this.imgD);
      // await this.postFor3dDb(recordId, recordUuid, this.imgD);
    } catch (error: any) {
      logAxiosError(error, _CONFIG.msg.error.fetch.updating);
    }
  };

  /**
   * Delete model files
   * @param deleteTheseFiles
   * @param recordId
   * @param recordUuid
   */
  deleteRecordFiles = async (deleteTheseFiles: any, recordId: string, recordUuid: string) => {
    const { url, msg } = _CONFIG;
    // console.log('>>', recordId, recordUuid);
    const response = await axios.post(url.deleteRecordFiles, { deleteTheseFiles, recordId, recordUuid, deleteFolder: false }, {});
    if (response.data.success === false) {
      console.log(msg.error.file.deleting, response);
    }
  };
  /**
   * Delete file from the specified API
   * @param recordId
   * @param fileType
   */
  deleteFileFromDbTable = async (recordId: string, fileType: 'image' | 'video' | 'model3d') => {
    const { url, msg } = _CONFIG;
    let apiEndpoint;

    switch (fileType) {
      case 'image':
        apiEndpoint = url.imageApi;
        break;
      case 'video':
        apiEndpoint = url.videoApi;
        break;
      case 'model3d':
        apiEndpoint = url.models3dApi;
        break;
      default:
        throw new Error('Invalid file type');
    }

    for (const key in this.imgD) {
      let joinFromInput = key;
      const response = await axios.delete(apiEndpoint + recordId + '/' + joinFromInput);
      if (response.data.success === false) {
        console.log(msg.error.file.deleting, response);
      }
    }
  };
  /**
   * Udapte records db
   * @param recordId
   * @param data
   */
  updateRecrodsDbTable = async (recordId: string, data: any) => {
    const { url, msg } = _CONFIG;
    const response = await axios.patch(url.recordApi + recordId, data);
    if (response.data.success === false) {
      console.log(msg.error.fetch.updating, response);
    }
  };

  /**
   * Create images
   * @param recordId
   * @param recordUuid
   * @param imgD
   */

  postForDb = async (recordId: string, recordUuid: string, imgD: any, fileType: 'image' | 'video' | 'model3d') => {
    const { db, url, msg } = _CONFIG;
    let apiEndpoint;
    let relevantKeys: string[] = [];

    switch (fileType) {
      case 'image':
        apiEndpoint = url.createImage;
        relevantKeys = ['recordImgs', 'recordMaterialUrl'];
        break;
      case 'video':
        apiEndpoint = url.createVideo;
        relevantKeys = ['recordVideos'];
        break;
      case 'model3d':
        apiEndpoint = url.createModels3d;
        relevantKeys = ['recordModels3d'];
        break;
      default:
        throw new Error('Invalid file type');
    }

    let imgPush: any[] = [];
    Object.keys(imgD).forEach((element: any) => {
      if (relevantKeys.includes(element)) {
        imgD[element].forEach((e: any) => {
          imgPush.push(e);
          e.joinFromTable = db.tableNameRecords;
          e.joinId = recordId;
          e.joinUuid = recordUuid;
        });
      }
    });

    try {
      const response = await axios.post(apiEndpoint, imgPush);
      if (response.data.success === false) {
        console.log(msg.error.file.uploading, response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * Upload files
   * @param data
   * @param recordUuid
   * @param files
   * @param setState
   */
  uploadFilesToFolder = async (data: any, recordUuid: string, files: any, setState: any) => {
    const { db, url, msg } = _CONFIG;
    const filesData = new FormData();
    let isThereAnyValidFile: boolean = false;
    for (const file in files) {
      if (files[file].length > 0) {
        isThereAnyValidFile = true;
      }
      Object.values(files[file]).forEach((individualFile: any, index) => {
        const nameSeparatedByComma = data[file].split(',')[index];
        if (individualFile) filesData.append(recordUuid, individualFile as Blob, nameSeparatedByComma);
      });
    }

    if (isThereAnyValidFile) {
      setState({ isUploading: true });
      const response: any = await axios.post(url.uploadRecordFiles, filesData, {
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
   * Get title from recordConfig
   * @param elm string
   * @returns
   */
  getTitle = (elm: any) => {
    return Object.entries(recordConfig).map(([key, value]) => {
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
   * Print all options from recordConfig
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
  formBuilder = (i: number, elm: string, recordId: any) => {
    const { validation } = _CONFIG;
    let { data } = this.state,
      element = data[elm],
      ctr = recordConfig[i].control,
      category = recordConfig[i].categories,
      isRequired = recordConfig[i].isRequired,
      label = recordConfig[i].label;

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
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)} accept={elm === 'recordModels3d' ? validation.file.web3dTypes : elm === 'recordImgs' || elm === 'recordMaterialUrl' ? validation.file.imgTypes : validation.file.vidTypes}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control disabled={elm === 'recordTitle' || elm === 'recordUuid' ? true : false} type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)} required={isRequired}></Form.Control>;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { isSaved, isThankYou, isUploading, uploadingData, data } = this.state;
    console.log('isSaved', isSaved);
    return isThankYou ? (
      <div>köszi</div>
    ) : isSaved ? (
      <Navigate to='/' />
    ) : isUploading ? (
      <ProgressViewer uploadingData={uploadingData} />
    ) : (
      <Form onSubmit={this.update3dModel}>
        {recordConfig
          ? recordConfig.map((elm: any, i: number) => {
              const ctr: string = recordConfig[i].control,
                enableForAddEdit: boolean = recordConfig[i].enableForAddEdit;
              return enableForAddEdit ? (
                <Form.Group key={i}>
                  {<Form.Label>{elm.label}</Form.Label>}
                  {this.formBuilder(i, elm.name, data.recordId)}
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
