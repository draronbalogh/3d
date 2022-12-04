/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';
import { fetchData } from '../../common/fetch';
interface CompProps {
  data: string | unknown | null | [];
}
interface CompState {
  data: string | unknown | null | [];
}
export class Component3d extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    this.setState({
      data: fetchData('/some/async/data')
    });
  }

  componentDidUpdate(prevProps: CompProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    const { data } = this.state;
    console.log('data :>> ', data);
    return (
      <div>
        <tr>
          asd
          {/*  data?.map((x: any, i: number) => (
            <td key={i}>{x}</td>
          ))
          */}
        </tr>
      </div>
    );
  }
}
