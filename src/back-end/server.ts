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
const folder = path.join(_CONFIG.url.uploadFolder);
if (!fs.existsSync(folder)) fs.mkdirSync(folder, '0777');

const upload = async (req: any, res: any, next: any) => {
  let folderId = '';
  let subFolderPath = 'xxx';
  const preForm = await new formidable.IncomingForm({
    uploadDir: _CONFIG.url.uploadFolder,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1, //byte
    maxFileSize: 200 * 1024 * 1024, // 200mb
    multiples: true,
    filename: (name: string, ext: string, part: any, form: any) => {
      return name + ext;
    } /*
     filter: ({ name, originalFilename, mimetype }) => {
      return mimetype && mimetype.includes('image');
    }*/
  });
  console.log('preFormpreFormpreFormpreForm');
  console.log(preForm);
  preForm.on('progress', function (bytesReceived, bytesExpected) {
    console.log((100 * bytesReceived) / bytesExpected + '%');
  });
  preForm.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    } else {
      folderId = String(fields.modelLastId);
      // preForm.uploadDir = uploadDir;
      subFolderPath = path.join(_CONFIG.url.uploadFolder + folderId);
      if (!fs.existsSync(subFolderPath)) fs.mkdirSync(subFolderPath, '0777');
      console.log('xxxxxxxxxxxxxxxxx');
      console.log(folderId);
    }
  });
  console.log('yyyyyyyyyyyyyyyyy');
  console.log(_CONFIG.url.uploadFolder + folderId);

  /*
  const form = await new formidable.IncomingForm({
    uploadDir: _CONFIG.url.uploadFolder + folderId,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1, //byte
    maxFileSize: 200 * 1024 * 1024, // 200mb
    multiples: true,
    filename: (name: string, ext: string, part: any, form: any) => {
      return name + ext;
    }
  });
  console.log('formformformformformformformformformformformformform :>> ');
  console.log(form);
  // const files: any[] = [];
  // const fields: any[] = [];

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    } else {
      res.status(200).json({ fields, files });
      // res.redirect('/uploadSuccess');
    }
  });*/
};
const deleteFiles = async (req: any, res: any, next: any) => {
  console.clear();
  console.log('sss');
  let arr: string[] = req.body.deleteTheseFiles || [];
  const folder = path.join(_CONFIG.url.uploadFolder);
  console.log('aaaaaaaaaaaaaaaaaaa');
  console.log(arr.length);
  console.log(arr);

  arr.forEach((filePath) => {
    console.log('filePathfilePathfilePathfilePathfilePath');
    console.log(filePath);
    console.log(fs.existsSync(folder + filePath));
    console.log(folder + filePath);
    if (fs.existsSync(folder + filePath)) {
      fs.unlink(folder + filePath, (err) => {
        if (err) {
          console.log('File error:', filePath);
          //console.error(err);
        } else {
          console.log('File removed:', filePath);
        }
      });
    }
  });

  res.json({ status: 200 });
};
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/deleteFiles', deleteFiles);
app.post('/upload', upload);
app.use('/api/3dmodels', routes3d);

/*

app.use(express.static('public'))
app.use(express.static('files'))
app.use('/static', express.static(path.join(__dirname, 'public')));

*/
app.listen(5000, () => console.log('Server running at port 5000'));
