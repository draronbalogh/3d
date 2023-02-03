import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration, NumericLiteral } from 'typescript';
import { v4 as uuid } from 'uuid';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
import db from '../../../../_config/config-database';
import { removeHunChars } from '../../../../assets/es6-methods';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'react-circular-progressbar/dist/styles.css';
import { ProgressViewer } from '../db-shared/progress-viewer/progress-viewer-component';
interface Model3dState {
  id: number | undefined;
  data: any;
  files: any;
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  oldFilesToDel: any;
}
declare module 'react' {
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}
export class DbEdit3dModel extends React.Component<any, any> {
  static imgArray: any[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      isSaved: false,
      isThankYou: false,
      isUploading: false,
      data: this.props.data,
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [] },
      oldFilesToDel: null,
      folderId: null
    };
  }

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
    if (JSON.stringify(this.props.files) !== JSON.stringify(prevProps.files)) {
      this.setState({ files: this.props.files });
    }
  }
  findDataById = () => {
    const { data, id } = this.state;
    let obj = data.find((o: { id: any }) => o.id === id);
    this.setState({ data: obj });
    this.setState({ oldFilesToDel: obj });
  };
  fetchModelDataById = async () => {
    try {
      const { id } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + id);
      this.setState({ data: response.data });
      this.setState({ oldFilesToDel: response.data });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
    }
  };
  inputFileDataUpdater = async (elm: string, e: any) => {
    // DbEdit3dModel.imgArray = [];
    try {
      const { oldFilesToDel } = this.state;
      let modelUrl = oldFilesToDel['modelUrl'] ? oldFilesToDel['modelUrl'] : '';
      let modelImgs = oldFilesToDel['modelImgs'] ? oldFilesToDel['modelImgs'] : '';
      let modelMaterialUrl = oldFilesToDel['modelMaterialUrl'] ? oldFilesToDel['modelMaterialUrl'] : '';

      let modelUrlA = modelUrl.split(',');
      let modelImgsA = modelImgs.split(',');
      let modelMaterialUrlA = modelMaterialUrl.split(',');

      let t: any[] = [];
      if (elm === 'modelUrl') DbEdit3dModel.imgArray.push(modelUrlA);
      if (elm === 'modelImgs') DbEdit3dModel.imgArray.push(modelImgsA);
      if (elm === 'modelMaterialUrl') DbEdit3dModel.imgArray.push(modelMaterialUrlA);
      this.setState({
        deleteTheseFiles: DbEdit3dModel.imgArray.flat(1)
      });

      let files = { ...this.state.files };

      files[elm] = e.target.files;

      this.setState({ files });
      let filesTxt = '';
      let x = 0;
      for (const i of e.target.files) {
        const fileName = i.name;

        filesTxt += `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // TODO:: remove hungarian characters  -->removeHunChars()
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
  inputDataUpdater = (elm: string, e: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: e
      }
    });

    this.setState({ isSaved: false });
  };
  update3dModel = async (e: any) => {
    const { data, deleteTheseFiles, id } = this.state;
    const { modelUuid } = data;
    try {
      e.preventDefault();

      let isThereAnyFile = false;

      DbEdit3dModel.imgArray = [];
      await axios.post(_CONFIG.url.deleteFiles, { deleteTheseFiles, id, modelUuid, deleteFolder: false }, {}); /*.then((resp: any) => {
          this.setState({
            deleteTheseFiles: []
          });
        });*/
      //   let removable = elm === 'modelImgs' ? modelImgs : elm === 'modelMaterialUrl' ? modelMaterialUrl : modelUrl;
      //     let imgArray = [...removable];
      await axios.patch(_CONFIG.url.getModel + id, data);

      const { files } = this.state;
      const filesData = new FormData();
      for (const file in files) {
        if (files[file].length > 0) {
          isThereAnyFile = true;
        }
        Object.values(files[file]).forEach((individualFile, index) => {
          const nameSeparatedByComma = data[file].split(',')[index];
          if (individualFile) filesData.append(modelUuid, individualFile as Blob, nameSeparatedByComma);
        });
      }
      if (isThereAnyFile) {
        this.setState({ isUploading: true });
        await axios
          .post(_CONFIG.url.uploadFiles, filesData, {
            headers: {
              // 'application/json' is the modern content-type for JSON, but some
              // older servers may use 'text/json'.
              // See: http://bit.ly/text-json
              'content-type': 'multipart/form-data'
            },
            onUploadProgress: (data) => {
              //Set the progress value to show the progress bar
              //Set the progress value to show the progress bar
              this.setState({ uploadingData: data });
              console.log('data', data);
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
        isThereAnyFile = false;
      } else {
        this.setState({ isUploading: false, isThankYou: false, isSaved: true });
      }
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
      const statusCode = e.response.status; // 400
      const statusText = e.response.statusText; // Bad Request
      const message = e.response.data.message[0]; // id should not be empty
    }
  };

  getTitle = (elm: any) => {
    return Object.entries(modelConfig).map(([key, value]) => {
      if (value.name === elm) return value.label;
    });
  };

  switcher = (elm: any, trgVal: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: trgVal
      }
    });
    return trgVal;
  };
  newFunction = (category: any) => {
    return Array.isArray(category)
      ? category.map((element: any, x: number) => (
          <option key={x} value={element}>
            {element}
          </option>
        ))
      : null;
  };
  formBuilder = (i: number, elm: string) => {
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
            <>{this.newFunction(category)}</>
          </Form.Select>
        );
      case 'file':
        //@ts-ignore
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control disabled={elm === 'modelTitle' || elm === 'modelUuid' ? true : false} type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)} required={isRequired}></Form.Control>;
    }
  };

  render() {
    const { isSaved, isThankYou, isUploading, uploadingData, folderId, data } = this.state;
    return isThankYou ? (
      <div>köszi</div>
    ) : isSaved ? (
      <Navigate to='/' />
    ) : isUploading ? (
      <ProgressViewer uploadingData={uploadingData} />
    ) : (
      <Form onSubmit={this.update3dModel}>
        {data
          ? Object.keys(data)?.map((elm: any, i: number) => {
              let ctr = modelConfig[i]?.control,
                enableForAddEdit = modelConfig[i]?.enableForAddEdit;
              return enableForAddEdit ? (
                <Form.Group className={ctr !== 'hidden' ? 'm-1' : 'd-none'} key={i}>
                  {ctr !== 'switch' ? <Form.Label>{this.getTitle(elm)}</Form.Label> : null}
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
