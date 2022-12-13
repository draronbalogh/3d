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
  updateData: any;
  data: unknown;
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
      updateIdNum: undefined,
      updateData: undefined,
      data: []
    };
  }

  updateId = (id: number) => {
    this.setState({ updateIdNum: id });
  };

  updateData = (updateData: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.setState({ data: updateData });
  };

  render() {
    const { data, updateIdNum } = this.state;
    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={12}>
            <Routes>
              <Route path='/view/:id' element={<View3dModel data={data} />} />
            </Routes>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Routes>
              <Route path='/' element={<DbList3dModel updateId={this.updateId} updateData={this.updateData} />} />
              <Route path='/add' element={<DbAdd3dModel />} />
              <Route path='/edit/:id' element={<DbEdit3dModel data={data} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
