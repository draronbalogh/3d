/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';
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
    /*   this.setState({
      data: fetchData('http://localhost:3001/api/3dmodels')
    }); */
  }

  componentDidUpdate(prevProps: CompProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        3d component
        {/*  data?.map((x: any, i: number) => (
            <td key={i}>{x}</td>
          ))
          */}
      </div>
    );
  }
}
