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
  updateIdNum: number | undefined;
  updateData: unknown;
  data: unknown;
  isDarkMode: boolean;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
/**
 * App
 * @returns JSX.Element
 */
class App extends React.Component<unknown, State> {
  //public data: any;
  public storedIsDarkMode = localStorage.getItem('storedIsDarkMode');
  constructor(props: unknown) {
    super(props);
    this.state = {
      updateIdNum: undefined,
      updateData: undefined,
      data: [],
      isDarkMode: false
    };
    this.getPreferredTheme();
  }

  getPreferredTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? '3dDark' : 'light';
  };

  componentDidMount() {
    if (this.storedIsDarkMode !== null) {
      console.log('storedIsDarkMode is >>', this.storedIsDarkMode);
      if (this.storedIsDarkMode === '3dDark') {
        this.setState({ isDarkMode: true });
      } else {
        this.setState({ isDarkMode: false });
      }
      this.changeTheme();
    } else {
      console.log('storedIsDarkMode is null');
      this.setState({ isDarkMode: false });
      localStorage.setItem('storedIsDarkMode', 'light');
    }
  }

  updateId = (id: number) => {
    this.setState({ updateIdNum: id });
  };

  updateData = (updateData: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.setState({ data: updateData });
  };

  changeTheme = () => {
    const { isDarkMode } = this.state;
    const theme: string = isDarkMode ? '3dDark' : 'light';
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', '3dDark');
      this.setState({ isDarkMode: true });
      localStorage.setItem('storedIsDarkMode', '3dDark');
      document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value');
          localStorage.setItem('theme', String(theme));
        });
      });
    } else {
      console.log('theme', theme);
      document.documentElement.setAttribute('data-bs-theme', theme);
      localStorage.setItem('storedIsDarkMode', theme);
      this.setState({ isDarkMode: !isDarkMode });
    }
  };

  render() {
    const { data, isDarkMode } = this.state;
    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={12}>
            <button onClick={this.changeTheme}>{isDarkMode ? 'sötét' : 'világos'}</button>
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
              {/*  <Route
                  path='/upload'
                  element={
                    <form action='/upload' encType='multipart/form-data' method='post'>
                      <div>
                        modelTitle: <input type='text' name='modelTitle' />
                      </div>
                      <div>
                        File: <input type='file' name='someExpressFiles' multiple={true} />
                      </div>
                      <input type='submit' value='Upload' />
                    </form>
                  }
                />*/}
              <Route path='*' element={<p>Path not resolved</p>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
