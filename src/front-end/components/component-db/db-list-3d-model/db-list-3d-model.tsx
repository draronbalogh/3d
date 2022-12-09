import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
interface Model3dProps {
  updateId: any;
}
interface Model3dState {
  data: any[];
}
export class DbList3dModel extends React.Component<Model3dProps, Model3dState> {
  constructor(props: Model3dProps) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.get3dModel();
  }

  componentDidUpdate(prevProps: Model3dProps) {}

  get3dModel = async () => {
    const response = await axios.get<any>(_CONFIG.url.getModel),
      resp = response.data;
    this.setState({ data: resp });
  };

  delete3dModel = async (id: number) => {
    await axios.delete(`${(_CONFIG.url.getModel, id)}`);
    this.get3dModel();
  };

  updateId = (id: number) => {
    this.props.updateId(id);
  };
  printModelTitle = () => {
    return modelConfig.map((v: any, i: number) => {
      if (v.visible) return <th key={i}>{v.label}</th>;
    });
  };
  printModelData = () => {
    const { data } = this.state;
    return data.map((model3d: any, i: number) => {
      return (
        <tr key={i}>
          {
            // TODO:: innen folytatni
          }
          <td>{i + 1}</td>
          <td>{model3d.modelUuid}</td>
          <td>{model3d.modelTitle}</td>
          <td>{model3d.modelDescription}</td>
          <td>
            <Link to={`/edit/${model3d.id}`} className='button is-small is-info'>
              Szerk.
            </Link>

            <a onClick={() => this.delete3dModel(model3d.id)} className='button is-small is-danger'>
              Törlés
            </a>

            <a onClick={() => this.updateId(model3d.id)} className='button is-small is-danger'>
              Megjelenítés
            </a>
          </td>
        </tr>
      );
    });

    /* {
       data.map((model3d: any, index: number) => (
         
       ));
     }*/
  };
  render() {
    return (
      <div>
        <Link to='/add' className='button is-primary mt-2'>
          Hozzáadás
        </Link>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>{this.printModelTitle()}</tr>
          </thead>
          <tbody>{this.printModelData()}</tbody>
        </Table>
      </div>
    );
  }
}
