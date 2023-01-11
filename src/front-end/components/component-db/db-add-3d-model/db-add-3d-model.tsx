import React, { useRef } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration } from 'typescript';
import { NULL } from 'node-sass';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { v4 as uuid } from 'uuid';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
import { getAllModels3ds } from '../../../../back-end/controllers/controllers-3dmodels';
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
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [] },
      folderId: null
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
    const res2 = axios.get(_CONFIG.url.getModelId).then((response: any) => {
      if (response.data.success === false) {
        throw new Error('Error getting last id', response);
      }
      /* const id = response.data.sort(function (a: any, b: any) {
            return a.id - b.id;
          });
          */
      let currId = response.data.length ? Number(response.data[0].id) + 1 : '_must_set_id_';
      this.setState({ folderId: currId });
    });
  }

  componentDidUpdate(prevProps: any) {}
  save3dModel = async (e: any) => {
    e.preventDefault();
    const { data, files, folderId } = this.state;
    // console.log('data :>> ', data);
    // console.log('files :>> ', files);
    try {
      const filesData = new FormData();

      for (const file in files) {
        Object.values(files[file]).forEach((individualFile, index) => {
          //          console.log('index :>> ', index);
          //   console.log('file-->', file);
          //    console.log(' data.file', data[file]);
          const nameSeparatedByComma = data[file].split(',')[index];
          if (individualFile) filesData.append(folderId, individualFile as Blob, nameSeparatedByComma);
        });
      }
      try {
        let folderId = null;
        const res1 = await axios.post(_CONFIG.url.getModel, data, {}).then((response: any) => {
          if (response.data.success === false) {
            throw new Error('Error uploading to safe', response);
          }
          console.log('create model response', response); // returned rows
        });

        const res3 = await axios.post(_CONFIG.url.uploadFiles, filesData, {}).then((response) => {
          if (response.data.success === false) {
            console.log('Error uploading to safe.moe: ', response);
          }
        });
      } catch (e: any) {
        console.log(e);
      } finally {
        this.setState({ isSaved: true });
      }

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
    try {
      let files = { ...this.state.files };
      files[elm] = e.target.files;
      this.setState({ files });
      let filesTxt = '';
      let x = 0;
      for (const i of e.target.files) {
        const fileName = i.name;
        // filesTxt += `${uuid()}-${fileName},`;
        filesTxt += `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-zA-Z0-9.]/g, '-')},`;
      }
      // console.log('this.sate.files :>> ', this.state);

      this.setState(
        {
          data: {
            ...this.state.data,
            [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
          }
        },
        () => {
          //   console.log('this.state.data', this.state.data);
          // console.log('this.state', this.state);
        }
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
    let { data, folderId } = this.state,
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
        // console.log('folderId', folderId);
        // webkitdirectory={'false'}
        //@ts-ignore
        return <Form.Control multiple type={ctr} name={folderId} onChange={(e) => this.inputFileDataUpdater(elm.name, e)}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>;
      default:
        return <Form.Control type={ctr} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)} required={elm.isRequired}></Form.Control>;
    }
  };
  render() {
    const { isSaved, folderId } = this.state;

    return isSaved ? (
      <Navigate to='/' />
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
