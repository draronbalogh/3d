import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration, NumericLiteral } from 'typescript';
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
declare module 'react' {
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}
export class DbEdit3dModel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      isSaved: false,
      data: this.props.data,
      files: { modelUrlFiles: [], modelImgsFiles: [], modelMaterialUrlFiles: [] }
    };
    // console.log(' this.props.data', this.props.data);
  }

  componentDidMount(): void {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) this.fetchModelDataById();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.setState({ data: this.props.data });
    }
    if (JSON.stringify(this.props.files) !== JSON.stringify(prevProps.files)) {
      this.setState({ files: this.props.files });
    }
  }
  findDataById = () => {
    const { data, id } = this.state;
    let obj = data.find((o: { id: any }) => o.id === id);
    this.setState({ data: obj });
  };
  fetchModelDataById = async () => {
    console.log('fetichng');
    try {
      const { id } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + id);
      this.setState({ data: response.data });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
    }
  };
  inputFileDataUpdater = (elm: string, e: any) => {
    console.log('elm', elm);
    console.log('e', e);
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

  inputDataUpdater = (elm: string, info: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: info
      }
    });

    this.setState({ isSaved: false });
  };
  update3dModel = async (e: any) => {
    e.preventDefault();
    try {
      const { id, data, files } = this.state;
      const filesData = new FormData();
      for (const file in files) {
        for (let x = 0; x < files[file].length; x++) {
          filesData.append('file', files[file][x]);
        }
      }
      await axios.patch(_CONFIG.url.getModel + id, data);
      await axios.post(_CONFIG.url.uploadFiles, filesData, {});
      this.setState({ isSaved: true });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
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
    //console.log('category', category);
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
            <>
              {
                // TODO:: itt kéne valami setTimeout
              }
              {this.newFunction(category)}
            </>
          </Form.Select>
        );
      case 'file':
        //@ts-ignore
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)} required={isRequired}></Form.Control>;
    }
  };

  render() {
    const { data, isSaved } = this.state;
    // console.log('data :>> ', typeof data);
    return (
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
