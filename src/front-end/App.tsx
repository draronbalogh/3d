import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import { View3dModel, DbForm, DbModelList } from './components';
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
        <Col xs={3}>
          <DbForm data={'form'} />

          <hr />
          <Routes>
            <Route path='/'>
              <DbModelList data={[]} />
            </Route>
            <Route path='/add'>
              <AddProduct />
            </Route>
            {/* <Route path='/edit/:id'>
                <EditProduct />
              </Route> */}
          </Routes>
        </Col>
        <Col>
          <Component3d data={'3d'} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
