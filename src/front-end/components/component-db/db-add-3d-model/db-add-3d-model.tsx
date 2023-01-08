import React, { useRef } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration } from 'typescript';
import { NULL } from 'node-sass';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';

interface Model3dState {
  id: number | undefined;
  data: any;
  files: any;
  isSaved: boolean;
}
export class DbAdd3dModel extends React.Component<any, any> {
  form: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.state = {
      isSaved: false,
      data: {},
      files: { modelUrlFiles: [], modelImgsFiles: [], modelMaterialUrlFiles: [] }
    };
    this.form = React.createRef();
  }

  componentDidMount(): void {
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

  componentDidUpdate(prevProps: any) {}
  save3dModel = async (e: any) => {
    e.preventDefault();
    const { data, files } = this.state;
    try {
      const filesData = new FormData();
      for (const file in files) {
        for (let x = 0; x < files[file].length; x++) {
          filesData.append('file', files[file][x]);
        }
      }
      const response = await axios.post(_CONFIG.url.getModel, data, {});
      const responseFiles = await axios.post(_CONFIG.url.uploadFiles, filesData, {});
      this.setState({ isSaved: true });
      // console.log('response :>> ', response);
      //   console.log('responseFiles :>> ', responseFiles);
    } catch (e: any) {
      let errorStatus = '';
      if (!e.response) {
        // network error
        errorStatus = 'Error: Network Error';
      } else {
        errorStatus = e.response.data.message;
      }
      console.log('Axios Reports Error: ', errorStatus);
      console.log('Axios Error: ', e);
    }
  };

  inputFileDataUpdater = (elm: string, e: any) => {
    let keyName: string = '';
    switch (elm) {
      case 'modelUrl':
        keyName = 'modelUrlFiles';
        break;
      case 'modelImgs':
        keyName = 'modelImgsFiles';
        break;
      case 'modelMaterialUrl':
        keyName = 'modelMaterialUrlFiles';
        break;
      default:
        keyName = '';
        break;
    }
    let files = { ...this.state.files };
    files[keyName] = e.target.files;
    this.setState({ files });
    let filesTxt = '';
    for (const i of e.target.files) filesTxt += `${i.name},`;
    this.setState(
      {
        data: {
          ...this.state.data,
          [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
        }
      },
      () => {
        //   console.log('this.state.data', this.state.data);
        console.log('this.state', this.state);
      }
    );

    this.setState({ isSaved: false });
  };

  inputDataUpdater = (elm: string, e: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: e
      }
    });
    /*if (elm === 'modelUrl' || elm === 'modelImgs' || elm === 'modelSourceUrl' || elm === 'modelMaterialUrl') {
      let files = '';
      for (const i of fileList) files += `${i.name},`;
      this.setState({
        data: {
          ...this.state.data,
          //   [elm]: files.slice(0, -1), // comma separated list of files as mysql record
          [elm]: fileList
        }
      });
    }*/
    this.setState({ isSaved: false });
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

  formBuilder = (i: number, elm: any) => {
    // console.log('elm :>> ', elm);
    let { data } = this.state,
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories;
    // console.log('elm :>> ', elm.name);
    // console.log('ctr', ctr);
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
        // webkitdirectory={'false'}
        //@ts-ignore
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm.name, e)}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>;
      default:
        return <Form.Control type={ctr} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)} required={elm.isRequired}></Form.Control>;
    }
  };
  render() {
    const { isSaved } = this.state;

    return (
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
          {!isSaved ? (
            <Button variant='primary' type='submit'>
              Mentés
            </Button>
          ) : (
            <Navigate to='/' />
          )}
        </div>
      </Form>
    );
  }
}
