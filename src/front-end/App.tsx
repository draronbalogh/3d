import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import { View3dModel, DbForm, DbList3dModel, DbAdd3dModel, DbEdit3dModel } from './components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * App
 * @returns JSX.Element
 */
function App(): JSX.Element {
  return (
    <Container fluid className={'3dRegform'}>
      <Row>
        <Col xs={6}>
          {/*  <DbForm data={'form'} />

          <hr /> */}
          <Routes>
            <Route path='/' element={<DbList3dModel data={[]} />}></Route>
            <Route path='/add' element={<DbAdd3dModel />}></Route>
            {/* <Route path='/edit/:id'>
                <EditProduct />
              </Route> */}
          </Routes>
        </Col>
        <Col xs={6}>
          <View3dModel data={'3d'} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
