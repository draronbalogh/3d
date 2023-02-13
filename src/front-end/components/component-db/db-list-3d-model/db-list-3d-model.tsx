//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Link } from 'react-router-dom';
////////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/_config-general';
import { modelConfig } from '../../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios, { AxiosResponse } from 'axios';
import { logAxiosError } from '../../../../assets/gen-methods';
///////////////////////////////////////////////////////////   DOM
import Table from 'react-bootstrap/Table';
///////////////////////////////////////////////////////////   INTERFACE
interface Model3dProps {
  updateId: any;
  updateData: any;
}
interface Model3dState {
  data: any[];
  isDeleted: boolean;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class DbList3dModel extends React.Component<Model3dProps, Model3dState> {
  constructor(props: Model3dProps) {
    super(props);
    this.state = {
      data: [],
      isDeleted: false
    };
  }
  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {
    this.get3dModel();
  }

  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Get 3d model data from database
   */
  get3dModel = async () => {
    try {
      const response = await axios.get<any>(_CONFIG.url.getModel);
      const resp = response.data;
      this.setState({ data: resp, isDeleted: false });
      this.props.updateData(resp);
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.fetchById);
    }
  };

  /**
   * Delete 3d model data from database and also delete files from server
   * @param id number
   * @param modelUuid string
   * @param ob object
   */
  delete3dModel = async (id: number, modelUuid: string, ob: any) => {
    try {
      let modelImgs: string[] = ob['modelImgs'] ? ob['modelImgs']?.split(',') : [],
        modelMaterialUrl: string[] = ob['modelMaterialUrl'] ? ob['modelMaterialUrl']?.split(',') : [],
        modelUrl: string[] = ob['modelUrl'] ? ob['modelUrl']?.split(',') : [],
        deleteTheseFiles: string[] = [...modelImgs, ...modelMaterialUrl, ...modelUrl];
      await axios.post(_CONFIG.url.deleteFiles, { deleteTheseFiles, id: ob['id'], modelUuid: ob['modelUuid'], deleteFolder: true }, {}).then((response) => {
        if (response.data.success === false) console.log(_CONFIG.msg.error.file.deleting, response);
      });
      await axios.delete(_CONFIG.url.getModel + id).then((response) => {
        if (response.data.success === false) {
          console.log(_CONFIG.msg.error.file.deleting, response);
        } else {
          this.get3dModel();
        }
      });
    } catch (e: any) {
      const statusCode = e.response.status; // 400
      const statusText = e.response.statusText; // Bad Request
      const message = e.response.data.message[0]; // id should not be empty
      console.log(`${statusCode} - ${statusText} - ${message}`);
    }
  };

  /**
   * Update id in parent component
   * @param id number
   */
  updateId = (id: number) => {
    this.props.updateId(id);
  };

  /**
   * Update data
   * @param updateData
   */
  updateData = (updateData: unknown) => {
    this.props.updateId(updateData);
  };

  ///////////////////////////////////////////////////////////   RENDER METHODS

  /**
   * Print model title
   * @returns th elements
   */
  printModelTitle = () => {
    return modelConfig.map((v: any, i: number) => {
      return <th key={i}>{v.label}</th>;
    });
  };

  /**
   * Print model description
   * @returns
   */
  printModelDesc = () => {
    const { data } = this.state;
    return data?.map((elm, i) => (
      <tr key={i}>
        {modelConfig.map((elm: any, ii: number) => {
          return elm.name === 'editBtns' ? <td key={ii}>{this.printEditorBtns(data[i])}</td> : <td key={ii}>{data[i][elm.name]}</td>;
        })}
      </tr>
    ));
  };

  /**
   * Priont editor buttons
   * @param elm object
   * @returns
   */
  printEditorBtns = (elm: any) => {
    return (
      <span>
        <Link to={`/edit/${elm.id}`} className='button is-small is-info'>
          Szerkesztés
        </Link>{' '}
        <a onClick={() => this.delete3dModel(elm.id, elm.modelUuid, elm)} className='button is-small is-danger'>
          Törlés
        </a>{' '}
        <Link to={`/view/${elm.id}`} className='button is-small is-info'>
          Megjelenítés
        </Link>
      </span>
    );
  };

  //////////////////////////////////////////////////////////////////////////////////////    RENDER
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
          <tbody key={Math.random()}>{this.printModelDesc()}</tbody>
        </Table>
      </div>
    );
  }
}
