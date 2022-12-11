import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
// import { printModelTitle, printModelData } from '../db-common/db-common';

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
    await axios.delete(_CONFIG.url.getModel + id);
    this.get3dModel();
  };

  updateId = (id: number) => {
    this.props.updateId(id);
  };
  printModelTitle = () => {
    return modelConfig.map((v: any, i: number) => {
      return <th key={i}>{v.label}</th>;
    });
  };
  printModelDesc = () => {
    const { data } = this.state;
    let id: any = null;
    return data?.map((elm, i) => (
      <tr key={i}>
        {Object.keys(elm).map((vv: string, ii: any) => {
          if (vv === 'id') id = elm[vv];
          return <td key={ii}>{elm[vv]}</td>;
        })}
        {this.printEditorBtns(id)}
      </tr>
    ));
  };

  printEditorBtns = (id: number) => {
    return (
      <td>
        <Link to={`/edit/${id}`} className='button is-small is-info'>
          Szerkesztés
        </Link>

        <a onClick={() => this.delete3dModel(id)} className='button is-small is-danger'>
          Törlés
        </a>
        <Link to={`/view/${id}`} className='button is-small is-info'>
          Megjelenítés
        </Link>
      </td>
    );
  };
  render() {
    return (
      <div>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>{this.printModelTitle()}</tr>
          </thead>
          <tbody>{this.printModelDesc()}</tbody>
        </Table>
      </div>
    );
  }
}
