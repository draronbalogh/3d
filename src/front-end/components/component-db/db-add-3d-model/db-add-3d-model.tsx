//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { removeHunChars } from '../../../../assets/es6-methods';
///////////////////////////////////////////////////////////   DOM
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ProgressViewer } from '../db-shared/progress-viewer/progress-viewer-component';
///////////////////////////////////////////////////////////   SCSS
import 'react-circular-progressbar/dist/styles.css';
///////////////////////////////////////////////////////////   INTERFACE
interface Model3dState {
  id: number | undefined;
  data: any;
  files: any;
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  uploadingData: any;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class DbAdd3dModel extends React.Component<any, any> {
  form: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.state = {
      isSaved: false,
      isThankYou: false,
      isUploading: false,
      uploadingData: null,
      data: {},
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [] },
      folderName: null,
      folderId: nanoid(10).toLocaleLowerCase()
    };
    this.form = React.createRef();
  }
  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  async componentDidMount() {
    let { data } = this.state;
    modelConfig?.forEach((elm: any, i: number) => {
      let d = data[modelConfig[i].name];
      elm.name !== 'id' && elm.control !== 'switch' ? (d = '') : null;
      if (elm.name === 'modelViewCount' || elm.name === 'modelViewCount') d = 1;
      this.setState({
        data: data
      });
    });
  }

  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Save 3d model
   * @param e
   * @returns
   * @private
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
    const { data, files } = this.state;
    let { folderName } = this.state;
    try {
      let isThereAnyValidFile = false;
      const filesData = new FormData();
      for (const file in files) {
        Object.values(files[file]).forEach((individualFile: any, index) => {
          let currentFileType = null;
          if (individualFile.name) currentFileType = individualFile.name.split('.').pop();
          if (currentFileType && _CONFIG.validation.file.types.includes(currentFileType)) {
            isThereAnyValidFile = true;
            const nameSeparatedByComma = data[file].split(',')[index];
            if (individualFile) filesData.append(folderName, individualFile as Blob, nameSeparatedByComma);
          }
        });
      }
      await axios.post(_CONFIG.url.createModel, data, {}).then((response: any) => {
        if (response.data.success === false) {
          throw new Error('Error uploading to safe', response);
        }
      });
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
          .then((response) => {
            if (response.data.success === false) {
              console.log('Error uploading to safe.moe: ', response);
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
      let errorStatus = '';
      console.error(e.response.data);
      if (!e.response) {
        errorStatus = 'Error: Network Error';
      } else {
        errorStatus = e.response.data.message;
      }
      console.log('Axios Reports Error: ', errorStatus);
      console.log('Axios Error: ', e);
    }
  };

  /**
   * Input file data updater
   * @param elm string
   * @param e any
   * @returns void
   * @memberof DbAdd3dModel
   * @description
   * Update state with uuuid file names
   */
  inputFileDataUpdater = (elm: string, e: any) => {
    try {
      // TODO:: copy to edit model
      if (e.target.files.length > 0) {
        for (let i = 0; i <= e.target.files.length - 1; i++) {
          const fsize = e.target.files.item(i).size;
          const file = Math.round(fsize);
          // The size of the file.
          if (file >= _CONFIG.validation.file.maxFileSize) {
            alert('File too Big, please select a file less than...');
            return;
          } else if (file < _CONFIG.validation.file.minFileSize) {
            alert('File too small, please select a file greater than...');
            return;
          } else {
          }
        }
      }
      let files = { ...this.state.files };
      files[elm] = e.target.files;
      this.setState({ files });
      let filesTxt = '';
      for (const i of e.target.files) {
        const fileName = i.name;
        filesTxt += `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-zA-Z0-9.]/g, '-')},`;
      }
      this.setState(
        {
          data: {
            ...this.state.data,
            [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
          }
        },
        () => {}
      );

      this.setState({ isSaved: false });
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
  formBuilder = (i: number, elm: any) => {
    let { data, folderId } = this.state,
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories;
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
        return <Form.Control disabled={elm.name === 'modelUuid' ? true : false} type={ctr} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)} required={elm.isRequired}></Form.Control>;
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
              let ctr = modelConfig[i].control,
                enableForAddEdit = modelConfig[i].enableForAddEdit;
              return enableForAddEdit ? (
                <Form.Group className={ctr !== 'hidden' ? 'm-1' : 'd-nonennnn'} key={i}>
                  {ctr !== 'switch' ? <Form.Label>{elm.label}</Form.Label> : null}
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
