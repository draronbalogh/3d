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
  id: number | any;
}
interface CompState {
  data: any;
  id: number | any;
}
export class View3dModel extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      data: [],
      id: Number(window.location.pathname.split('/').pop())
    };
  }

  componentDidMount() {
    this.get3dModelById();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.id !== prevProps.id) {
      this.setState({ id: this.props.id }, () => {
        this.get3dModelById();
      });
    }
  }

  get3dModelById = async () => {
    const { id } = this.state;
    const response = await axios.get(_CONFIG.url.getModel + id);
    console.log('response.data :>> ', response.data);
    this.setState({ data: response.data });
  };
  printModelTitle = () => {
    return modelConfig.map((v: any, i: number) => {
      return <th key={i}>{v.label}</th>;
    });
  };

  printModelDesc = () => {
    const { data } = this.state;
    console.log('data :>> ', Object.keys(data));
    return Object.keys(data).map((elm: any, i: number) => {
      return <td key={elm}>{data[elm]}</td>;
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
          <tr>{this.printModelTitle()}</tr>
        </thead>

        <tbody>{this.printModelDesc()}</tbody>
      </table>
    );
  }
}
