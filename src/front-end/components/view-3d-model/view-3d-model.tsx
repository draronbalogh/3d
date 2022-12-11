/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { _CONFIG } from '../../../_config/_config';
import { modelConfig } from '../../../_config/config-model';
interface CompProps {
  id: number | undefined;
}
interface CompState {
  data: any[];
  id: number | undefined;
}
export class View3dModel extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      data: [],
      id: this.props.id
    };
  }

  componentDidMount() {
    this.get3dModel();
  }

  componentDidUpdate(prevProps: CompProps) {
    if (this.props.id !== prevProps.id) {
      this.setState({ id: this.props.id });
    }
  }

  get3dModel = async () => {
    const response = await axios.get<any>(_CONFIG.url.getModel),
      resp = response.data;
    this.setState({ data: resp });
  };
  printModelTitle = (selId: any) => {
    return modelConfig.map((v: any, i: number) => {
      return <th key={i}>{v.label}</th>;
    });
  };
  printModelDesc = (selId: any) => {
    // id === model3d.id ? (
    const { data } = this.state;
    return data?.map((elm, i) =>
      selId === elm.id ? (
        <tr key={i}>
          {Object.keys(elm).map((vv: string, ii: any) => {
            return <td key={ii}>{elm[vv]}</td>;
          })}
        </tr>
      ) : null
    );
  };
  render() {
    const { id, data } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <th>3d component ({id})</th>
          </tr>
          <tr>{this.printModelTitle(id)}</tr>
        </thead>

        <tbody>{this.printModelDesc(id)}</tbody>
      </table>
    );
  }
}
