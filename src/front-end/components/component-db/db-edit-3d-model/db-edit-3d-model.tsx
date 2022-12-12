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
    this.get3dModelById();
  }

  inputDataUpdater = (elm: string, info: any) => {
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

  get3dModelById = async () => {
    const { id } = this.state;
    const response = await axios.get(_CONFIG.url.getModel + id);
    this.setState({ data: response.data });
  };
  getTitle = (elm: any) => {
    return Object.entries(modelConfig).map(([key, value]) => {
      if (value.name === elm) return value.label;
    });
  };

  formBuilder = (i: number, elm: string) => {
    switch (modelConfig[i].control) {
      case 'switch':
        return <Form.Check type={'switch'} label='' value={this.state.data[elm] ? this.state.data[elm] : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Check>;
      case 'select':
        return (
          <Form.Select onChange={(e) => this.inputDataUpdater(elm, e.target.value)}>
            {Array.isArray(modelConfig[i].categories)
              ? // @ts-ignore
                modelConfig[i].categories.map((element: any) => <option value={element}>{element}</option>)
              : null}
          </Form.Select>
        );
      default:
        return <Form.Control type={modelConfig[i].control} value={this.state.data[elm] ? this.state.data[elm] : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
    }
  };

  render() {
    const { data, isSaved } = this.state;
    return (
      <Form onSubmit={this.update3dModel}>
        {data
          ? Object.keys(data)?.map((elm: any, i: number) => {
              console.log('modelConfig :>> ', modelConfig[i].label, modelConfig[i].control);
              return (
                <div key={i}>
                  <Form.Group className='m-1'>
                    <Form.Label>{this.getTitle(elm)}</Form.Label>
                    {this.formBuilder(i, elm)}
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
