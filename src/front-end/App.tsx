/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable spaced-comment */
//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Routes, Route } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFiG
//import {_CONF} from './config/config';
///////////////////////////////////////////////////////////   LIBS
import { View3dModel, DbForm, DbList3dModel, DbAdd3dModel, DbEdit3dModel } from './components';
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

  updateId = (id: number) => {
    this.setState({ updateIdNum: id });
  };

  render() {
    const { updateIdNum } = this.state;
    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={6}>
            {/*  <DbForm data={'form'} />

          <hr /> */}
            <Routes>
              <Route path='/' element={<DbList3dModel updateId={updateIdNum} data={[]} />} />
              <Route path='/add' element={<DbAdd3dModel />} />
              <Route path='/edit/:id' element={<DbEdit3dModel />} />
            </Routes>
          </Col>
          <Col xs={6}>
            <Routes>
              <Route path='/' element={<View3dModel id={null} data={'3d'} />} />
              <Route path='/3d/:id' element={<View3dModel updateId={() => this.updateId(id)} data={''} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
