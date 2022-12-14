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
  data: any;
  isSaved: boolean;
}

export class DbEdit3dModel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      isSaved: false,
      data: this.props.data
    };
  }

  componentDidMount(): void {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) this.fetchModelDataById();
  }
  findDataById = () => {
    const { data, id } = this.state;
    let obj = data.find((o: { id: any }) => o.id === id);
    this.setState({ data: obj });
  };
  fetchModelDataById = async () => {
    try {
      const { id } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + id);
      this.setState({ data: response.data });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
    }
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
        // console.log(this.state.data);
      }
    );
    this.setState({ isSaved: false });
  };
  update3dModel = async (e: any) => {
    e.preventDefault();
    try {
      const { id } = this.state;
      await axios.patch(_CONFIG.url.getModel + id, this.state.data);
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
  getFiles = (element: any) => {
    let elm = '';
    setTimeout(() => {
      elm = element ? element : '';
    }, 500);
    return elm;
  };
  formBuilder = (i: number, elm: string) => {
    let { data } = this.state,
      element = data[elm],
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories;

    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} label='' value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Check>;
      case 'select':
        let selectedCat = data['category'];
        return (
          <Form.Select onChange={(e) => this.inputDataUpdater(elm, e.target.value)} defaultValue={element ? element : ''}>
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
        return <Form.Control type={ctr} value={this.getFiles(element)} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
    }
  };

  render() {
    const { data, isSaved } = this.state;

    return (
      <Form onSubmit={this.update3dModel}>
        {data
          ? Object.keys(data)?.map((elm: any, i: number) => {
              let ctr = modelConfig[i].control,
                active = modelConfig[i].active;
              //  console.log('elm :>> ', elm);
              return active && ctr !== 'file' ? (
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
