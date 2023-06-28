//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import { Routes, Route } from 'react-router-dom';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../_config/config-general';
///////////////////////////////////////////////////////////   LIBS
import { ViewRecord, DbListRecord, DbAddRecord, DbEditRecord } from './components';

///////////////////////////////////////////////////////////   DOM
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
///////////////////////////////////////////////////////////   SCSS
import './App.scss';
///////////////////////////////////////////////////////////   INTERFACE

interface State {
  updateIdNum: number | undefined;
  updateData: unknown;
  data: unknown;
  isDarkMode: boolean;
}
interface UserData {
  displayName: string;
  mail: string;
  telephoneNumber: string;
  department: string;
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
      data: [],
      isDarkMode: false,
      updateIdNum: undefined,
      updateData: undefined
    };
  }

  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {
    this.changeBgStyle();
    // TODO:: if its on mtv intra?
    // this.ldapLogin();
  }

  ldapLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth');
      if (response.ok) {
        const data: UserData = (await response.json()) as UserData;
        console.log(data);
        // itt kezeld a választ
      } else {
        throw new Error('Error');
      }
    } catch (error) {
      console.log(error);
      // itt kezeld a hibát
    }
  };

  ///////////////////////////////////////////////////////////   CLASS METHODS

  /**
   * Update recordId
   * @param recordId
   */
  private readonly updateId = (recordId: number) => {
    this.setState({ updateIdNum: recordId });
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
    const { data, isDarkMode, updateIdNum } = this.state;

    // console.log('this.updateIdNum', data);
    // TODO:: refresh list on edit change
    return (
      <Container fluid className={'3dRegform'}>
        <Row>
          <Col xs={12}>
            <Button onClick={this.changeTheme}>{isDarkMode ? 'sötét' : 'világos'}</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Routes>
              <Route path='/' element={<DbListRecord updateId={this.updateId} updateData={this.updateData} />} />
              <Route path='/auth' element={'Ad'} />
              <Route path='/add' element={<DbAddRecord />} />
              <Route path='/edit/:recordId' element={<DbEditRecord data={data} />} />
              <Route path='/view/:recordId' element={<ViewRecord data={data} />} />
              {
                //  <Route path='/getLastModelId' element={<>asdsad {console.log(data)}</>} />
              }
              <Route path='*' element={<code>{_CONFIG.routes.error}</code>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
