//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Link } from 'react-router-dom';
////////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios, { AxiosResponse } from 'axios';
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
    const response = await axios.get<any>(_CONFIG.url.getModel);
    const resp = response.data;
    this.setState({ data: resp, isDeleted: false });
    this.props.updateData(resp);
  };

  /**
   * Delete 3d model data from database and also delete files from server
   * @param id number
   * @param modelUuid string
   * @param ob object
   */
  delete3dModel = async (id: number, modelUuid: string, ob: any) => {
    let modelImgs: string[] = ob['modelImgs'] ? ob['modelImgs']?.split(',') : [],
      modelMaterialUrl: string[] = ob['modelMaterialUrl'] ? ob['modelMaterialUrl']?.split(',') : [],
      modelUrl: string[] = ob['modelUrl'] ? ob['modelUrl']?.split(',') : [],
      deleteTheseFiles: string[] = [...modelImgs, ...modelMaterialUrl, ...modelUrl];
    await axios.post(_CONFIG.url.deleteFiles, { deleteTheseFiles, id: ob['id'], modelUuid: ob['modelUuid'], deleteFolder: true }, {}).then((response) => {
      if (response.data.success === false) console.log('Error uploading to safe.moe: ', response);
    });
    await axios.delete(_CONFIG.url.getModel + id).then((response) => {
      if (response.data.success === false) {
        console.log(_CONFIG.msg.error.file.deleting, response);
      } else {
        this.get3dModel();
      }
    });
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
    // TODO::: error javítás, ha nem az utolsót törlöm, hanem egyel korábbit, akkor nem törlni a foldert.
    const { data } = this.state;
    let id: any = null;
    return data?.map((elm, i) => (
      <tbody key={Math.random()}>
        <tr key={i}>
          {Object.keys(elm).map((vv: string, ii: any) => {
            if (vv === 'id') id = elm[vv];
            return <td key={ii}>{elm[vv]}</td>;
          })}
        </tr>
        <tr key={i + 1}>{this.printEditorBtns(elm)}</tr>
      </tbody>
    ));
  };

  /**
   * Priont editor buttons
   * @param elm object
   * @returns
   */
  printEditorBtns = (elm: any) => {
    return (
      <td>
        <Link to={`/edit/${elm.id}`} className='button is-small is-info'>
          Szerkesztés
        </Link>{' '}
        <a onClick={() => this.delete3dModel(elm.id, elm.modelUuid, elm)} className='button is-small is-danger'>
          Törlés
        </a>{' '}
        <Link to={`/view/${elm.id}`} className='button is-small is-info'>
          Megjelenítés
        </Link>
      </td>
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
          {this.printModelDesc()}
        </Table>
      </div>
    );
  }
}
