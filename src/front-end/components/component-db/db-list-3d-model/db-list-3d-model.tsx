import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';

interface Model3dProps {
  data: any[];
  updateId: number;
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

  componentDidUpdate(prevProps: Model3dProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  get3dModel = async () => {
    const response = await axios.get<any>('http://localhost:5000/api/3dmodels/'),
      resp = response.data;
    this.setState({ data: resp });
  };

  delete3dModel = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/3dmodels/${id}`);
    this.get3dModel();
  };

  updateIdNum = (id: number) => {
    this.props.updateId(id);
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <Link to='/add' className='button is-primary mt-2'>
          Hozzáadás
        </Link>
        <table className='table is-striped is-fullwidth'>
          <thead>
            <tr>
              <th>#</th>
              <th>Uuid</th>
              <th>Cím</th>
              <th>Leírás</th>
              <th>Vezérlők</th>
            </tr>
          </thead>
          <tbody>
            {data.map((model3d: any, index: number) => (
              <tr key={model3d.id}>
                <td>{index + 1}</td>
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
                  <a onClick={() => this.updateIdNum(model3d.id)} className='button is-small is-danger'>
                    Megjelenítés
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
