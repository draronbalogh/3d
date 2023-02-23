//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../_config/config-general';
import { modelConfig } from '../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios from 'axios';
import { logAxiosError } from '../../../assets/gen-methods';
///////////////////////////////////////////////////////////   INTERFACE
interface CompProps {
  data: any;
}
interface CompState {
  data: any;
  modelId: number | any;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class View3dModel extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      modelId: Number(window.location.pathname.split('/').pop()),
      data: this.props.data
    };
  }

  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) this.fetchModelDataById();
  }

  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Find data by modelId
   */
  findDataById = () => {
    const { data, modelId } = this.state;
    const obj = data.find((o: { modelId: any }) => o.modelId === modelId);
    this.setState({ data: obj });
  };

  /**
   * Fetch data by modelId
   */
  fetchModelDataById = async () => {
    try {
      const { modelId } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + modelId);
      this.setState({ data: response.data });
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.getData);
    }
  };

  ///////////////////////////////////////////////////////////   RENDER METHODS
  /**
   * Print model description
   * @returns data or null
   */
  printModelDesc = () => {
    const { data } = this.state;
    return data
      ? Object.keys(data)?.map((elm: any, i: number) => {
          return <td key={i}>{typeof data[elm] !== 'object' ? data[elm] : ''}</td>;
        })
      : null;
  };

  /**
   * Get title
   * @returns label list of table cells
   */
  getTitle = () => {
    return Object.entries(modelConfig).map(([key, value]) => {
      return <td key={key}>{value.label}</td>;
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { modelId } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <th>3d component ({modelId})</th>
          </tr>
          <tr>{this.getTitle()}</tr>
        </thead>
        <tbody>
          <tr>{this.printModelDesc()}</tr>
        </tbody>
      </table>
    );
  }
}
