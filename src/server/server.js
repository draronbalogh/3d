const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const table = 'models';
const pool = mysql.createConnection({
  // mysql.createPool
  host: 'localhost',
  user: 'root',
  password: '',
  database: '3d'
});

const corsOptions = { credentials: true, origin: true };
app.use(cors(corsOptions)); // TODO:: update and import
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});

app.get('/api/3dmodels', (req, res) => {
  pool.query(`SELECT * FROM ${table}`, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});
//add new user
app.post('/store-data', (req, res) => {
  let data = { name: req.body.name };
  let sql = 'INSERT INTO users SET ?';
  let query = pool.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
//import { getUser } from './routes/users';
//app.get('/api/users/:id', getUser);
/*import bodyParser from 'body-parser';
import express from 'express';
import { postMessages, putMessage } from './routes/messages';


const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// user
app.get('/api/users/:id', getUser);

// messages
app.post('/api/messages', postMessages);
app.put('/api/messages/:id', putMessage);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
*/
