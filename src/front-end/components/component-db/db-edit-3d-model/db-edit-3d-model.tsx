import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration, NumericLiteral } from 'typescript';
import { NULL } from 'node-sass';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
interface Model3dState {
  id: number | undefined;
  isSaved: boolean;
}

export class DbEdit3dModel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      isSaved: false
    };
  }

  componentDidMount(): void {
    this.get3dModeltById();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.id !== prevProps.id) {
      this.setState({ id: this.props.id });
    }
  }
  inputDataUpdater = (elm: string, info: any) => {
    console.log('elm?', elm);
    this.setState(
      {
        data: {
          ...this.state.data,
          [elm]: info
        }
      },
      () => {
        // console.log(this.state.data);
      }
    );
    this.setState({ isSaved: false });
  };
  update3dModel = async (e: any) => {
    e.preventDefault();
    const { id } = this.state;
    await axios.patch(_CONFIG.url.getModel + id, this.state.data);
    this.setState({ isSaved: true });
  };

  get3dModeltById = async () => {
    const { id } = this.state;
    const response = await axios.get(_CONFIG.url.getModel + id);
    this.setState({ data: response.data });
    // this.setModelUuid(response.data.modelUuid);
    //  this.setModelTitle(response.data.modelTitle);
    // this.setModelDescription(response.data.modelDescription);
  };
  getTitle = (elm: any) => {
    return Object.entries(modelConfig).map(([key, value]) => {
      // console.log(value.name, elm); // "a 5", "b 7", "c 9"
      if (value.name === elm) return value.label;
    });
    return '';
  };
  render() {
    const { data, id, modelUuid, modelTitle, modelDescription, isSaved } = this.state;
    return (
      <Form onSubmit={this.update3dModel}>
        {data
          ? Object.keys(data)?.map((elm: any, i: number) => {
              return (
                <div key={i}>
                  <Form.Group className='m-1'>
                    <Form.Label>{this.getTitle(elm)}</Form.Label>
                    <Form.Control type='text' value={this.state.data[elm] ? this.state.data[elm] : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>
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
