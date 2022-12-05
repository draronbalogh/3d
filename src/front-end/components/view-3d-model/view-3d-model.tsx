/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';
interface CompProps {
  data: string | unknown | null | [];
  id: number | null;
}
interface CompState {
  data: string | unknown | null | [];
  id: number | null;
}
export class View3dModel extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      data: null,
      id: this.props.id
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
    if (this.props.id !== prevProps.id) {
      this.setState({ id: this.props.id });
    }
  }

  render() {
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
