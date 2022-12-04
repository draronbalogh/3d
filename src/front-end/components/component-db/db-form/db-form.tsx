/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
interface CompProps {
  data: string | unknown | null | []; // string | unknown | null | [];
}
interface CompState {
  data: string | unknown | null | [];
}
export class DbForm extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    /* this.setState({
      data: fetchData('http://localhost:3001/api/3dmodels')
    }); */
  }

  componentDidUpdate(prevProps: CompProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    return (
      <Form>
        <Form.Group controlId='modelsasdUuid'>
          <Form.Control type='hidden' />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelUuid'>
          <Form.Control type='hidden' value={100} />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelTitle'>
          <Form.Control type='text' placeholder='A model címe' />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelDescription'>
          <Form.Control type='text' placeholder='A model részletes leírása' />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelTags'>
          <Form.Control type='text' placeholder='Tag-ek, keresőszavak' />
        </Form.Group>
        <Form.Group className='m-1' controlId='modelUrl'>
          <Form.Control type='file' placeholder='Tag-ek vesszővel elválasztva' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Feltöltés
        </Button>
        {/*  data?.map((x: any, i: number) => (
            <td key={i}>{x}</td>
          ))
          */}
      </Form>
    );
  }
}
