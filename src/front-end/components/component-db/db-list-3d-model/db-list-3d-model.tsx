import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
import { Navigate } from 'react-router-dom';
interface Model3dProps {
  updateId: any;
  updateData: any;
}
interface Model3dState {
  data: any[];
  isDeleted: boolean;
}
export class DbList3dModel extends React.Component<Model3dProps, Model3dState> {
  constructor(props: Model3dProps) {
    super(props);
    this.state = {
      data: [],
      isDeleted: false
    };
  }

  componentDidMount() {
    this.get3dModel();
  }

  componentDidUpdate(prevProps: Model3dProps) {}

  get3dModel = async () => {
    const response = await axios.get<any>(_CONFIG.url.getModel);
    const resp = response.data;
    this.setState({ data: resp, isDeleted: false });
    this.props.updateData(resp);
  };

  delete3dModel = async (id: number, ob: any) => {
    console.log('obobobobobobobobobobobobob :>> ', ob);
    let modelImgs = ob['modelImgs'] ? ob['modelImgs']?.split(',') : [];
    let modelMaterialUrl = ob['modelMaterialUrl'] ? ob['modelMaterialUrl']?.split(',') : [];
    let modelUrl = ob['modelUrl'] ? ob['modelUrl']?.split(',') : [];
    let deleteTheseFiles = [...modelImgs, ...modelMaterialUrl, ...modelUrl];
    console.log('imgArray', deleteTheseFiles);
    await axios.post(_CONFIG.url.deleteFiles, { deleteTheseFiles, id: ob['id'], deleteFolder: true }, {}).then((response) => {
      if (response.data.success === false) {
        console.log('Error uploading to safe.moe: ', response);
      }
    });
    await axios.delete(_CONFIG.url.getModel + id).then((response) => {
      if (response.data.success === false) {
        console.log('Error uploading to safe.moe: ', response);
      } else {
        // https://stackoverflow.com/questions/51588360/how-to-redirect-in-axios
        // <Navigate to='/' />;
        // window.location.href = '/';
        this.get3dModel();
      }
    });
    // this.get3dModel();
  };

  updateId = (id: number) => {
    this.props.updateId(id);
  };
  updateData = (updateData: unknown) => {
    this.props.updateId(updateData);
  };
  printModelTitle = () => {
    return modelConfig.map((v: any, i: number) => {
      return <th key={i}>{v.label}</th>;
    });
  };
  printModelDesc = () => {
    // TODO::: error javítás, ha nem az utolsót törlöm, hanem egyel korábbit, akkor nem törlni a foldert.
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
    const { data } = this.state;
    let obj = data.find((o) => o.id === id);

    return (
      <td>
        <Link to={`/edit/${id}`} className='button is-small is-info'>
          Szerkesztés
        </Link>
        <a onClick={() => this.delete3dModel(id, obj)} className='button is-small is-danger'>
          Törlés
        </a>
        <Link to={`/view/${id}`} className='button is-small is-info'>
          Megjelenítés
        </Link>
      </td>
    );
  };
  render() {
    const { isDeleted } = this.state;
    return (
      <div>
        <Link to='/add' className='button is-primary mt-2'>
          Hozzáadás
        </Link>
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
