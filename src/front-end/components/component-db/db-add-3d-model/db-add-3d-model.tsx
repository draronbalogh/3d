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
      isSaved: false
    };
  }

  componentDidMount(): void {
    const { isSaved } = this.state;
    this.setState({ isSaved: false });
  }

  componentDidUpdate(prevProps: any) {}
  save3dModel = async (e: any) => {
    e.preventDefault();
    const { modelUuid, modelTitle, modelDescription } = this.state;
    await axios.post(_CONFIG.url.getModel, this.state.data);

    this.setState({ isSaved: true });
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
    this.setState(
      {
        data: {
          ...this.state.data,
          [elm]: info
        }
      },
      () => {
        console.log(this.state);
      }
    );
    this.setState({ isSaved: false });
  };
  render() {
    const { data, id, modelUuid, modelTitle, modelDescription, isSaved } = this.state;
    return (
      <Form onSubmit={this.save3dModel}>
        {modelConfig
          ? modelConfig.map((elm: any, i: number) => {
              return (
                <div key={i}>
                  <Form.Group className='m-1'>
                    <Form.Label>{elm.label}</Form.Label>
                    <Form.Control type='text' onChange={(e) => this.inputDataUpdater(elm.name, e.target.value)}></Form.Control>
                  </Form.Group>
                </div>
              );
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
