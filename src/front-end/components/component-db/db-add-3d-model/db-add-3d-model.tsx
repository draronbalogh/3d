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
interface Model3dState {
  modelUuid: string;
  modelTitle: string;
  modelDescription: string;
  isSaved: boolean;
}

export class DbAdd3dModel extends React.Component<any, Model3dState> {
  constructor(props: any) {
    super(props);
    this.state = {
      modelUuid: '',
      modelTitle: '',
      modelDescription: '',
      isSaved: false
    };
  }

  componentDidMount(): void {
    const { isSaved } = this.state;
    this.setState({ isSaved: false });
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.modelUuid !== prevProps.modelUuid) {
      this.setState({ modelUuid: this.props.modelUuid });
    }
    if (this.props.modelTitle !== prevProps.modelTitle) {
      this.setState({ modelTitle: this.props.modelTitle });
    }
    if (this.props.modelDescription !== prevProps.modelDescription) {
      this.setState({ modelDescription: this.props.modelDescription });
    }
  }
  save3dModel = async (e: any) => {
    e.preventDefault();
    const { modelUuid, modelTitle, modelDescription } = this.state;
    await axios.post(_CONFIG.url.getModel, {
      modelUuid,
      modelTitle,
      modelDescription
    });
    this.setState({ isSaved: true });
  };

  setModelUuid = (modelUuid: string): void => {
    this.setState({ modelUuid });
  };
  setModelTitle = (modelTitle: string): void => {
    this.setState({ modelTitle });
  };

  setModelDescription = (modelDescription: string): void => {
    this.setState({ modelDescription });
  };

  render() {
    const { modelUuid, modelTitle, modelDescription, isSaved } = this.state;
    return (
      <Form onSubmit={this.save3dModel}>
        <Form.Group controlId='modelsasdUuid'>
          <Form.Control type='hidden' />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelTitle'>
          <Form.Control type='text' placeholder='A model címe' value={modelUuid} onChange={(e) => this.setModelUuid(e.target.value)} />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelTitle'>
          <Form.Control type='text' placeholder='A model címe' value={modelTitle} onChange={(e) => this.setModelTitle(e.target.value)} />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelDescription'>
          <Form.Control as='textarea' placeholder='A model részletes leírása' value={modelDescription} onChange={(e) => this.setModelDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelTags'>
          <Form.Control type='text' placeholder='Tag-ek, keresőszavak' />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelUrl'>
          <Form.Control type='file' placeholder='Tag-ek vesszővel elválasztva' />
        </Form.Group>
        <div className='field'>
          {!isSaved ? (
            <Button variant='primary' type='submit'>
              Mentés
            </Button>
          ) : (
            <Navigate to='/' />
          )}
        </div>
        {/*  data?.map((x: any, i: number) => (
            <td key={i}>{x}</td>
          ))
          */}
      </Form>
    );
  }
}
