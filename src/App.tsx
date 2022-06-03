import React from 'react';
import './App.css';
// import ldapjs from 'ldapjs';
const ldap = require('ldapjs');

function App() {
  setTimeout(() => {
    console.log('ldap :>> ', ldap);
  }, 3000);

  return <div className='3Dapp'>3D fejlesztés</div>;
}

export default App;
