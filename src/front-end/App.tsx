/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable spaced-comment */
//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFiG
//import {_CONF} from './config/config';
///////////////////////////////////////////////////////////   LIBS
import { View3dModel, DbList3dModel, DbAdd3dModel, DbEdit3dModel } from './components';
///////////////////////////////////////////////////////////   DOM
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
///////////////////////////////////////////////////////////   SCSS
import './App.scss';
///////////////////////////////////////////////////////////   INTERFACE

interface State {
  updateIdNum: number | undefined;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
/**
 * App
 * @returns JSX.Element
 */
class App extends React.Component<any, State> {
  //public data: any;
  constructor(props: any) {
    super(props);
    this.state = {
      updateIdNum: undefined
    };
  }

  updateId = (id: number) => {
    this.setState({ updateIdNum: id });
  };

  render() {
    const { updateIdNum } = this.state;

    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={12}>
            <Link to='/add' className='button is-primary mt-2'>
              Hozzáadás
            </Link>
            <Routes>
              <Route path='/view/:id' element={<View3dModel id={this.updateId} />} />
            </Routes>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Routes>
              <Route path='/' element={<DbList3dModel updateId={this.updateId} />} />
              <Route path='/add' element={<DbAdd3dModel />} />
              <Route path='/edit/:id' element={<DbEdit3dModel />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
