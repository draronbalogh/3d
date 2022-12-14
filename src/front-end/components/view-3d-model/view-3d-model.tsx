import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { _CONFIG } from '../../../_config/_config';
import { modelConfig } from '../../../_config/config-model';
interface CompProps {
  data: any;
}
interface CompState {
  data: any;
  id: number | any;
}
export class View3dModel extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      data: this.props.data
    };
  }

  componentDidMount() {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) this.fetchModelDataById();
  }
  findDataById = () => {
    const { data, id } = this.state;
    let obj = data.find((o: { id: any }) => o.id === id);
    this.setState({ data: obj });
  };
  fetchModelDataById = async () => {
    try {
      const { id } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + id);
      this.setState({ data: response.data });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
    }
  };

  printModelDesc = () => {
    const { data } = this.state;
    return data
      ? Object.keys(data)?.map((elm: any, i: number) => {
          return <td key={i}>{typeof data[elm] !== 'object' ? data[elm] : ''}</td>;
        })
      : null;
  };
  getTitle = () => {
    return Object.entries(modelConfig).map(([key, value]) => {
      return <td key={key}>{value.label}</td>;
    });
  };

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
