import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration } from 'typescript';
import { NULL } from 'node-sass';

interface Model3dState {
  id: number;
  modelUuid: string;
  modelTitle: string;
  modelDescription: string;
  isSaved: boolean;
}

export class DbEdit3dModel extends React.Component<any, Model3dState> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      modelUuid: '',
      modelTitle: '',
      modelDescription: '',
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
  /* save3dModel = async (e: any) => {
    e.preventDefault();
    const { id, modelUuid, modelTitle, modelDescription } = this.state;
    await axios.post('http://localhost:5000/api/3dmodels/', {
      id,
      modelUuid,
      modelTitle,
      modelDescription
    });
    this.setState({ isSaved: true });
  };*/

  setModelUuid = (modelUuid: string): void => {
    this.setState({ modelUuid });
  };
  setModelTitle = (modelTitle: string): void => {
    this.setState({ modelTitle });
  };
  setModelDescription = (modelDescription: string): void => {
    this.setState({ modelDescription });
  };

  update3dModel = async (e: any) => {
    e.preventDefault();
    const { id, modelUuid, modelTitle, modelDescription } = this.state;
    await axios.patch(`http://localhost:5000/api/3dmodels/${id}`, {
      modelUuid,
      modelTitle,
      modelDescription
    });
    this.setState({ isSaved: true });
  };

  get3dModeltById = async () => {
    const { id } = this.state;
    const response = await axios.get(`http://localhost:5000/api/3dmodels/${id}`);
    console.log('restaaaaaaaaaStt', response.data);
    this.setModelUuid(response.data.modelUuid);
    this.setModelTitle(response.data.modelTitle);
    this.setModelDescription(response.data.modelDescription);
  };

  render() {
    const { id, modelUuid, modelTitle, modelDescription, isSaved } = this.state;
    return (
      <div>
        <form onSubmit={this.update3dModel}>
          <div className='field'>
            <label className='label'>modelUuid</label>
            <input className='input' type='text' placeholder='modelUuid' value={modelUuid} onChange={(e) => this.setModelUuid(e.target.value)} />
          </div>
          <div className='field'>
            <label className='label'>modelTitle</label>
            <input className='input' type='text' placeholder='Title' value={modelTitle} onChange={(e) => this.setModelTitle(e.target.value)} />
          </div>
          <div className='field'>
            <label className='label'>modelDescription</label>
            <input className='input' type='text' placeholder='Price' value={modelDescription} onChange={(e) => this.setModelDescription(e.target.value)} />
          </div>
          <div className='field'>
            {!isSaved ? (
              <button className='button is-primary' type={'submit'}>
                Ment
              </button>
            ) : (
              <Navigate to='/' />
            )}
          </div>
        </form>
      </div>
    );
  }
}
