import React from 'react';
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
  isSaved: boolean;
}
export class DbAdd3dModel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSaved: false,
      data: {}
    };
  }

  componentDidMount(): void {
    let { data } = this.state;
    modelConfig?.forEach((elm: any, i: number) => {
      elm.name !== 'id' && elm.control !== 'switch' ? (data[modelConfig[i].name] = '') : null;
      this.setState({
        data: data
      });
    });
  }

  componentDidUpdate(prevProps: any) {}
  save3dModel = async (e: any) => {
    e.preventDefault();
    const { data } = this.state;
    try {
      const response = await axios.post(_CONFIG.url.getModel, data);
      this.setState({ isSaved: true });
      // console.log('response :>> ', response.data);
    } catch (e: any) {
      console.log('Axios Error: ', e);
    }
  };

  setModelUuid = (modelUuid: number): void => {
    this.setState({ modelUuid });
  };
  setModelTitle = (modelTitle: string): void => {
    this.setState({ modelTitle });
  };

  setModelDescription = (modelDescription: string): void => {
    this.setState({ modelDescription });
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
    let { data } = this.state,
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories;
    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} id={`ctr${i}`} label={elm.label} defaultChecked={elm.name === 'visibility' ? true : false} onChange={(e) => this.switcher(elm.name, e.target.checked)} />;
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
        // directory='' webkitdirectory=''
        return <Form.Control type={ctr} name='imageName' onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>;
      default:
        return <Form.Control type={ctr} value={data?.hasOwnProperty(elm.name) ? data[elm.name] : ''} onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>;
    }
  };
  render() {
    const { data, id, modelUuid, modelTitle, modelDescription, isSaved } = this.state;
    return (
      <Form onSubmit={this.save3dModel}>
        {modelConfig
          ? modelConfig.map((elm: any, i: number) => {
              let ctr = modelConfig[i].control,
                active = modelConfig[i].active;
              return active ? (
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
