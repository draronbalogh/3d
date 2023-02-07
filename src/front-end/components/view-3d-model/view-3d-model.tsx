//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../../_config/_config';
import { modelConfig } from '../../../_config/config-model';
///////////////////////////////////////////////////////////   LIBS
import axios from 'axios';
///////////////////////////////////////////////////////////   INTERFACE
interface CompProps {
  data: any;
}
interface CompState {
  data: any;
  id: number | any;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class View3dModel extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
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
   * Find data by id
   */
  findDataById = () => {
    const { data, id } = this.state;
    let obj = data.find((o: { id: any }) => o.id === id);
    this.setState({ data: obj });
  };

  /**
   * Fetch data by id
   */
  fetchModelDataById = async () => {
    try {
      const { id } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + id);
      this.setState({ data: response.data });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
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
    const { id, data } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <th>3d component ({id})</th>
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
