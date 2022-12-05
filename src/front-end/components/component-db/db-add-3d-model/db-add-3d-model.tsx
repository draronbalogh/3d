import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration } from 'typescript';
import { NULL } from 'node-sass';

interface Model3dProps {
  modelUuid: string;
  modelTitle: string;
  modelDescription: string;
}
interface Model3dState {
  modelUuid: string;
  modelTitle: string;
  modelDescription: string;
}

export class DbAdd3dModel extends React.Component<Model3dProps, Model3dState> {
  constructor(props: Model3dProps) {
    super(props);
    this.state = {
      modelUuid: '',
      modelTitle: '',
      modelDescription: ''
    };
  }

  componentDidMount() {
    this.getProducts();
  }
  getProducts() {
    throw new Error('Method not implemented.');
  }

  componentDidUpdate(prevProps: Model3dProps) {
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
  saveProduct = async (e: any) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/3dmodels/', {
      data: e
    });
    const navigate = useNavigate();
    navigate('/');
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
    const { modelUuid, modelTitle, modelDescription } = this.state;
    return (
      <div>
        <form onSubmit={this.saveProduct}>
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
            <button className='button is-primary'>Ment</button>
          </div>
        </form>
      </div>
    );
  }
}
