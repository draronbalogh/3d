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
  recordUrl: [];
  recordImgs: [];
  recordMaterialUrl: [];
  recordVideos: [];
}
interface RecordState {
  data: any;
  imgData: imgDataType[];
  uploadingData: any;
  files: UploadFiles | any;
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  oldFilesToDel: any;
  recordUuid: string;
  folderId: string;
  folderName: string;
  joinFromInput: string[];
  deleteTheseFiles: string[];
  recordId: any;
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
  recordTitle: string;
  recordUuid: string;
}
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
      files: { recordUrl: [], recordImgs: [], recordMaterialUrl: [], recordVideos: [] },
      oldFilesToDel: null,
      deleteTheseFiles: [],
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
      const response = await axios.get(url.modelApi + recordId);
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
      const category = elm === 'recordVideos' ? 'vid' : 'img',
        fT = category + 'FileType',
        fS = category + 'FileSize',
        fN = category + 'FileName';
      if (e.target.files.length > validation.file.maxFiles) {
        alert(msg.error.file.maxFileLimit);
        return;
      }

      if (e.target.files.length > 0) {
        const { oldFilesToDel } = this.state;
        let recordUrl = oldFilesToDel['recordUrl'] ? oldFilesToDel['recordUrl'] : '',
          recordImgs = oldFilesToDel['recordImgs'] ? oldFilesToDel['recordImgs'] : '',
          recordMaterialUrl = oldFilesToDel['recordMaterialUrl'] ? oldFilesToDel['recordMaterialUrl'] : '',
          recordVideos = oldFilesToDel['recordVideos'] ? oldFilesToDel['recordVideos'] : '',
          modelUrlA = recordUrl.split(','),
          modelImgsA = recordImgs.split(','),
          modelMaterialUrlA = recordMaterialUrl.split(','),
          modelVideosA = recordVideos.split(',');
        if (elm === 'recordUrl') DbEditRecord.imgArray.push(modelUrlA);
        if (elm === 'recordImgs') DbEditRecord.imgArray.push(modelImgsA);
        if (elm === 'recordMaterialUrl') DbEditRecord.imgArray.push(modelMaterialUrlA);
        if (elm === 'recordVideos') DbEditRecord.imgArray.push(modelVideosA);
        console.log('DbEditRecord.imgArray.flat(1) ', DbEditRecord.imgArray.flat(1));
        this.setState({ deleteTheseFiles: DbEditRecord.imgArray.flat(1) });

        for (let i = 0; i <= e.target.files.length - 1; i++) {
          let item = e.target.files.item(i);
          this.imgD[elm].push({
            ...this.state.data,
            [`${category}FileType`]: item.name.split('.').pop().toLowerCase(),
            [`${category}FileSize`]: Math.round(item.size),
            [`${category}OriginalFileName`]: item.name.toLocaleLowerCase(),
            [`${category}FolderPath`]: `${url.uploadFolder}${this.state.data.recordUuid}`,
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

  /**
   * Update 3D model
   * @param e any
   */
  update3dModel = async (e: any) => {
    e.preventDefault();
    const { data, deleteTheseFiles, recordId } = this.state;
    const { recordUuid } = data;

    try {
      await this.deleteRecordFiles(deleteTheseFiles, recordId, recordUuid);
      await this.deleteModelImages(recordId);
      await this.deleteModelVideos(recordId);
      await this.patchModel(recordId, data);
      await this.postForImageDb(recordId, recordUuid, this.imgD);
      await this.postForVideoDb(recordId, recordUuid, this.imgD);
      await this.uploadFiles(data, recordUuid, this.state.files, this.setState.bind(this));
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
    console.log('>>', recordId, recordUuid);
    const response = await axios.post(url.deleteRecordFiles, { deleteTheseFiles, recordId, recordUuid, deleteFolder: false }, {});
    if (response.data.success === false) {
      console.log(msg.error.file.deleting, response);
    }
  };

  /**
   * Delete model images
   * @param recordId
   */
  deleteModelImages = async (recordId: string) => {
    const { url, msg } = _CONFIG;
    for (const key in this.imgD) {
      let joinFromInput = key;
      const response = await axios.delete(url.imageApi + recordId + '/' + joinFromInput);
      if (response.data.success === false) {
        console.log(msg.error.file.deleting, response);
      }
    }
  };

  /**
   * Delete model videos
   * @param recordId
   */
  deleteModelVideos = async (recordId: string) => {
    const { url, msg } = _CONFIG;
    for (const key in this.imgD) {
      let joinFromInput = key;
      const response = await axios.delete(url.videoApi + recordId + '/' + joinFromInput);
      if (response.data.success === false) {
        console.log(msg.error.file.deleting, response);
      }
    }
  };
  /**
   * Patch model
   * @param recordId
   * @param data
   */
  patchModel = async (recordId: string, data: any) => {
    const { url, msg } = _CONFIG;
    const response = await axios.patch(url.modelApi + recordId, data);
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
  postForImageDb = async (recordId: string, recordUuid: string, imgD: any) => {
    const { db, url, msg } = _CONFIG;
    let imgPush: any[] = [];
    Object.keys(imgD).forEach((element: any, key: number) => {
      if (element === 'recordImgs' || element === 'recordMaterialUrl') {
        imgD[element].forEach((e: any, k: number) => {
          imgPush.push(imgD[element][k]);
          imgD[element][k].joinFromTable = db.tableNameRecords;
          imgD[element][k].joinId = recordId;
          imgD[element][k].joinUuid = recordUuid;
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
   * @param recordId
   * @param recordUuid
   * @param imgD
   */
  postForVideoDb = async (recordId: string, recordUuid: string, imgD: any) => {
    const { db, url, msg } = _CONFIG;
    let imgPush: any[] = [];
    Object.keys(imgD).forEach((element: any, key: number) => {
      if (element === 'recordVideos') {
        imgD[element].forEach((e: any, k: number) => {
          imgPush.push(imgD[element][k]);
          imgD[element][k].joinFromTable = db.tableNameRecords;
          imgD[element][k].joinId = recordId;
          imgD[element][k].joinUuid = recordUuid;
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
   * @param recordUuid
   * @param files
   * @param setState
   */
  uploadFiles = async (data: any, recordUuid: string, files: any, setState: any) => {
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
  formBuilder = (i: number, elm: string, recordId: any) => {
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
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)} accept={elm === 'recordUrl' ? validation.file.web3dTypes : elm === 'recordImgs' || elm === 'recordMaterialUrl' ? validation.file.imgTypes : validation.file.vidTypes}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control disabled={elm === 'recordTitle' || elm === 'recordUuid' ? true : false} type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)} required={isRequired}></Form.Control>;
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
