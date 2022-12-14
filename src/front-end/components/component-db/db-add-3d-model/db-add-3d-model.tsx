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
      data[modelConfig[i].name] = '';
      this.setState({
        data: data
      });
    });
  }

  componentDidUpdate(prevProps: any) {}
  save3dModel = async (e: any) => {
    e.preventDefault();
    let { data } = this.state;

    const { modelUuid, modelTitle, modelDescription } = this.state;
    try {
      await axios.post(_CONFIG.url.getModel, this.state.data);

      this.setState({ isSaved: true });
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

  inputDataUpdater = (elm: any, trgVal: any) => {
    // console.log('inputDataUpdater :>> ');
    // console.log(elm);
    // console.log('inputDataUpdater info');
    this.setState({
      data: {
        ...this.state.data,
        [elm]: trgVal
      }
    });
    this.setState({ isSaved: false });
  };

  switcher = (elm: any, trgVal: any) => {
    const { data } = this.state;

    this.setState({
      data: {
        ...this.state.data,
        [elm]: trgVal
      }
    });
    console.log('elm', this.state.data['modelVisibility']);
  };

  formBuilder = (i: number, elm: any) => {
    let { data } = this.state,
      element = modelConfig[i],
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories;
    //console.log('formBuilder :>> ');
    //console.log(data);
    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} label={elm.label} onChange={(e) => this.inputDataUpdater(elm.name, this.switcher(elm.name, e.target.value))}></Form.Check>;
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
