/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable spaced-comment */
//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
  updateIdNum: number;
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
      updateIdNum: 0
    };
  }

  updateId = (id: number | any) => {
    this.setState({ updateIdNum: id });
  };

  render() {
    const { updateIdNum } = this.state;
    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={4}>
            <Routes>
              <Route path='/' element={<DbList3dModel updateId={this.updateId} />} />
              <Route path='/add' element={<DbAdd3dModel />} />
              <Route path='/edit/:id' element={<DbEdit3dModel />} />
            </Routes>
          </Col>
          <Col xs={8}>
            <Routes>
              <Route path='/' element={<View3dModel id={updateIdNum} />} />
              <Route path='/3d/:id' element={<View3dModel id={updateIdNum} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
