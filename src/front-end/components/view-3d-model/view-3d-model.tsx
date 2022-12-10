/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { _CONFIG } from '../../../../src/_config/_config';
interface CompProps {
  id: number | null;
}
interface CompState {
  data: any[];
  id: number | null;
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

  render() {
    const { id, data } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <td>3d component ({id})</td>
          </tr>
        </thead>
        <tbody>
          {data.map((model3d: any, index: number) =>
            id === model3d.id ? (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{model3d.modelUuid}</td>
                <td>{model3d.modelTitle}</td>
                <td>{model3d.modelDescription}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    );
  }
}
