import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';

interface Model3dProps {
  data: any[];
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
    this.getProducts();
  }

  componentDidUpdate(prevProps: Model3dProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  getProducts = async () => {
    const response = await axios.get<any>('http://localhost:5000/api/3dmodels/');
    console.log(response);
    const resp = response.data;
    this.setState({ data: resp });
  };

  deleteProduct = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/3dmodels/${id}`);
    this.getProducts();
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <Link to='/add' className='button is-primary mt-2'>
          Add New
        </Link>
        <table className='table is-striped is-fullwidth'>
          <thead>
            <tr>
              <th>No</th>
              <th>modelUuid</th>
              <th>modelTitle</th>
              <th>modelDescription</th>
              <th>Actions</th>
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
                    Edit
                  </Link>
                  <button onClick={() => this.deleteProduct(model3d.id)} className='button is-small is-danger'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
