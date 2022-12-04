const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001;
const table = 'models';
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '3d'
});

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});

app.get('/api/3dmodels', (req, res) => {
  pool.query(`select * from ${table}`, (err, rows) => {
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

/*import bodyParser from 'body-parser';
import express from 'express';
import { postMessages, putMessage } from './routes/messages';
import { getUser } from './routes/users';

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
