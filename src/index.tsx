//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
///////////////////////////////////////////////////////////   SCSS
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
///////////////////////////////////////////////////////////   COMPONENTS
import App from './front-end/App';
// import reportWebVitals from './reportWebVitals';
///////////////////////////////////////////////////////////   RENDER
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
// log performance: reportWebVitals();
