//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/config-general';
import { recordConfig } from '../../../../_config/config-records';
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
  recordUuid: string;
  files: UploadFiles | any;
  folderId: string;
}
interface UploadFiles {
  recordModels3d: [];
  recordImgs: [];
  recordMaterialUrl: [];
  recordVideos: [];
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
      files: { recordModels3d: [], recordImgs: [], recordMaterialUrl: [], recordVideos: [] },
      folderName: '',
      recordUuid: '',
      folderId: nanoid(10).toLocaleLowerCase()
    };
    this.form = React.createRef();
  }
  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {}
  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Save record to database
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
      const recordId = await this.postForRecordlDb(data);

      // Create images
      await this.postForModels3dDb(recordId);

      // Create images
      await this.postForImageDb(recordId);

      // Create images
      await this.postForVideoDb(recordId);

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
  postForRecordlDb = async (data: any) => {
    try {
      const { url, msg } = _CONFIG;
      const response: any = await axios.post(url.createRecord, data, {});
      if (response.data.success === false) throw new Error(msg.error.fetch.postingData, response);
      const response2: any = await axios.get(url.getLastRecordId);
      if (response2.data.success === false) throw new Error(msg.error.fetch.postingData2, response2);
      const recordId = response2.data[response2.data.length - 1]?.recordId;
      if (!recordId) throw new Error('Unable to retrieve record ID');
      return recordId;
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * Create videos in database
   * @param recordId
   */
  postForModels3dDb = async (recordId: number) => {
    const { data } = this.state;
    const { db, url } = _CONFIG;
    try {
      let postArr: any[] = [];
      console.log(this.imgD);
      Object.keys(this.imgD).forEach((element: any, key: number) => {
        console.log('element: ', element);
        if (element === 'recordModels3d') {
          this.imgD[element].forEach((e: any, k: number) => {
            postArr.push(this.imgD[element][k]);
            this.imgD[element][k].joinFromTable = db.tableNameRecords;
            this.imgD[element][k].joinId = recordId;
            this.imgD[element][k].joinUuid = data.recordUuid;
          });
        }
      });
      const response = await axios.post(url.createModels3d, postArr);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Create images in database
   * @param recordId
   */
  postForImageDb = async (recordId: number) => {
    const { data } = this.state;
    const { db, url } = _CONFIG;
    try {
      let postArr: any[] = [];
      Object.keys(this.imgD).forEach((element: any, key: number) => {
        if (element === 'recordImgs' || element === 'recordMaterialUrl') {
          this.imgD[element].forEach((e: any, k: number) => {
            postArr.push(this.imgD[element][k]);
            this.imgD[element][k].joinFromTable = db.tableNameRecords;
            this.imgD[element][k].joinId = recordId;
            this.imgD[element][k].joinUuid = data.recordUuid;
          });
        }
      });
      const response = await axios.post(url.createImage, postArr);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * Create videos in database
   * @param recordId
   */
  postForVideoDb = async (recordId: number) => {
    const { data } = this.state;
    const { db, url } = _CONFIG;
    try {
      let postArr: any[] = [];
      console.log(this.imgD);
      Object.keys(this.imgD).forEach((element: any, key: number) => {
        if (element === 'recordVideos') {
          this.imgD[element].forEach((e: any, k: number) => {
            console.log('element: ', element);
            postArr.push(this.imgD[element][k]);
            this.imgD[element][k].joinFromTable = db.tableNameRecords;
            this.imgD[element][k].joinId = recordId;
            this.imgD[element][k].joinUuid = data.recordUuid;
          });
        }
      });
      const response = await axios.post(url.createVideo, postArr);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Upload files to server
   * @param filesData
   */
  uploadFiles = async (filesData: FormData) => {
    const { db, url, msg } = _CONFIG;
    try {
      const response: any = await axios.post(url.uploadRecordFiles, filesData, {
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
    let category = 'img';
    try {
      this.imgD[elm] = [];
      // const category = elm === 'recordVideos' ? 'vid' : 'img';
      switch (elm) {
        case 'record':
          category = 'record';
          break;
        case 'recordModels3d':
          category = 'model3d';
          break;
        case 'recordVideos':
          category = 'vid';
          break;
        case 'recordImgs':
          category = 'img';
          break;
        case 'recordMaterialUrl':
          category = 'img';
          break;
        default:
          return 'img';
      }
      const fT = category + 'FileType',
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
   * @description Build form from recordConfig
   */
  formBuilder = (i: number, elm: any) => {
    const { validation } = _CONFIG;
    let { data, folderId } = this.state,
      ctr: string = recordConfig[i].control,
      category: string[] | undefined = recordConfig[i].categories;
    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} id={`ctr${i}`} label={elm.label} defaultChecked={elm.name === 'recordVisibility' ? true : false} onChange={(e) => this.switcher(elm.name, e.target.checked)} />;
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
        return <Form.Control multiple type={ctr} name={folderId ? folderId : ''} onChange={(e) => this.inputFileDataUpdater(elm.name, e)} accept={elm.name === 'recordModels3d' ? validation.file.web3dTypes : elm.name === 'recordImgs' || elm.name === 'recordMaterialUrl' ? validation.file.imgTypes : validation.file.vidTypes}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>;
      default:
        return <Form.Control maxLength={elm.maxLength} disabled={elm.name === 'recordUuid' ? true : false} type={ctr} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)} required={elm.isRequired}></Form.Control>;
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
        {recordConfig
          ? recordConfig.map((elm: any, i: number) => {
              const enableForAddEdit: boolean = recordConfig[i].enableForAddEdit;
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
