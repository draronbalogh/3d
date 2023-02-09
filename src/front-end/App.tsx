//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Routes, Route } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../_config/_config';
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
  public storedBgStyle = localStorage.getItem(_CONFIG.theme.storedBg);
  constructor(props: unknown) {
    super(props);
    this.state = {
      updateIdNum: undefined,
      updateData: undefined,
      data: [],
      isDarkMode: false
    };
  }

  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {
    this.changeBgStyle();
  }

  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Update id
   * @param id
   */
  private readonly updateId = (id: number) => {
    this.setState({ updateIdNum: id });
  };

  /**
   * Update data
   * @param updateData
   */
  updateData = (updateData: unknown) => {
    this.setState({ data: updateData });
  };

  /**
   * Change bg style
   */
  private readonly changeBgStyle = () => {
    if (this.storedBgStyle !== null) {
      if (this.storedBgStyle === _CONFIG.theme.dark) {
        document.documentElement.setAttribute(_CONFIG.theme.domTrg, _CONFIG.theme.dark);
        this.setState({ isDarkMode: false });
      } else {
        document.documentElement.setAttribute(_CONFIG.theme.domTrg, _CONFIG.theme.light);
        this.setState({ isDarkMode: true });
      }
    }
  };

  /**
   * Change theme
   */
  changeTheme = () => {
    const { isDarkMode } = this.state;
    this.setState({ isDarkMode: !isDarkMode }, () => {
      const theme: string = isDarkMode ? _CONFIG.theme.dark : _CONFIG.theme.light;
      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute(_CONFIG.theme.domTrg, _CONFIG.theme.dark);
        this.setState({ isDarkMode: true });
        localStorage.setItem(_CONFIG.theme.storedBg, _CONFIG.theme.dark);
        document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value');
            localStorage.setItem(_CONFIG.theme.storedBg, String(theme));
          });
        });
      } else {
        document.documentElement.setAttribute(_CONFIG.theme.domTrg, theme);
        localStorage.setItem(_CONFIG.theme.storedBg, theme);
      }
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { data, isDarkMode } = this.state;
    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={12}>
            <button onClick={this.changeTheme}>{isDarkMode ? 'sötét' : 'világos'}</button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Routes>
              <Route path='/' element={<DbList3dModel updateId={this.updateId} updateData={this.updateData} />} />
              <Route path='/add' element={<DbAdd3dModel />} />
              <Route path='/edit/:id' element={<DbEdit3dModel data={data} />} />
              <Route path='/view/:id' element={<View3dModel data={data} />} />
              <Route path='*' element={<code>{_CONFIG.routes.error}</code>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
