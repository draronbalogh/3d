/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import db from '../_config/config-database';
import routes3d from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';
import formidable from 'formidable';
import os from 'node:os';
import path from 'path';
import fs from 'node:fs';
import util from 'node:util';
import axios, { AxiosResponse } from 'axios';
import { fileURLToPath } from 'node:url';
import { _CONFIG } from '../_config/_config';
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const etst = async () => {
  await db.authenticate();
  console.log('Database connected...');
};

try {
  console.log('start db...');
  etst();
} catch (error) {
  console.error('Connection error:', error);
}
const folder = path.join('c:/node/3d/public/uploads/');
if (!fs.existsSync(folder)) fs.mkdirSync(folder, '0777');

const upload = (req: any, res: any, next: any) => {
  console.log('req :>> ', req);
  console.log('res :>> ', res);
  console.log('next :>> ', next);
  const form = new formidable.IncomingForm({
    uploadDir: folder,
    keepExtensions: true,
    allowEmptyFiles: false,
    maxFileSize: 5 * 1024 * 1024 * 1024,
    multiples: true
  });
  const files: any[] = [];
  const fields: any[] = [];

  form.parse(req, (err, fields, files) => {
    console.log('sadas');
    if (err) {
      return res.status(400).json({ error: err.message });
      next(err);
      console.log('hiba');
      /* files.myfiles.forEach((file: any) => {
        const newFilepath = `${folder}/${files.originalFilename}`;
        fs.rename(files.filepath, newFilepath, (err) => err);
      });
      if (!files.myfiles) return res.status(400).json({ message: 'No file Selected' });*/
    } else {
      console.log('-- fields fields -- ', fields);
      // res.json({ fields, files });
      res.redirect('/upload');
    }
  });
};
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api/3dmodels', routes3d);
app.post('/upload', upload);
app.listen(5000, () => console.log('Server running at port 5000'));
