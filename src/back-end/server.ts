import express from 'express';
import db from '../_config/config-database';
import routes3d from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';
import formidable, { errors as formidableErrors } from 'formidable';
import { createNecessaryDirectoriesSync } from '../assets/fileActions';
import os from 'node:os';
import path from 'path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
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
createNecessaryDirectoriesSync(_CONFIG.url.uploadFolder);

const upload = async (req: any, res: any, next: any) => {
  console.log('uploaduploaduploaduploadupload');
  console.log(req.params.id);
  console.log(res.params);
  //const { modelLastId } = req.params;
  //const { modelLastId } = req.body;
  let folderId = '';
  const form = new formidable.IncomingForm({
    //  uploadDir: _CONFIG.url.uploadFolder,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 100, //bytes
    maxFiles: 20, // or Infinity
    maxFileSize: 200 * 1024 * 1024, // 200mb
    // multiples: true,
    filename: (name: string, ext: string, part: any, form: any) => {
      const { originalFilename, mimetype } = part;
      return name + ext;
    }
    /*filter: ({ name, originalFilename, mimetype }) => {
      return true;
      // custom file filters
      // ex.: return mimetype && mimetype.includes("image"); // keep only images
    }*/
  });
  form.on('file', () => {
    console.log('filefilefilefile');
    // same as fileBegin, except
    // it is too late to change file.filepath
    // file.hash is available if options.hash was used
  });

  form.on('progress', function (bytesReceived: any, bytesExpected: any) {
    console.log((100 * bytesReceived) / bytesExpected + '%');
  });
  form.on('field', (name, value) => {
    folderId = value;
    //Emitted whenever a field / value pair has been received.
  });
  form.on('fileBegin', (formname, file) => {
    // accessible here
    // formName the name in the form (<input name="thisname" type="file">) or http filename for octetstream
    // file.originalFilename http filename or null if there was a parsing error
    // file.newFilename generated hexoid or what options.filename returned
    // file.filepath default pathname as per options.uploadDir and options.filename
    // file.filepath = CUSTOM_PATH // to change the final path
    createNecessaryDirectoriesSync(_CONFIG.url.uploadFolder + formname);
    const cim = path.join(_CONFIG.url.uploadFolder + formname + '/' + file.originalFilename);

    file.filepath = cim;
    folderId = formname;
  });
  form.on('aborted', () => {
    //Emitted when the request was aborted by the user. Right now this can be due to a 'timeout' or 'close' event on the socket. After this event is emitted, an error event will follow.
  });
  form.on('end', () => {
    console.log('endendendendendendend');
    //This is a great place for you to send your response.
  });
  form.on('error', (err) => {});

  form.parse(req, async (err, fields, files) => {
    //@ts-ignore

    console.log('parseparseparseparseparseparse');
    if (err) {
      next(err);
      return;
    } else {
    }
    res.json({ fields, files });
  });

  /* 
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
  let id = req.body.id;
  let deleteFolder = req.body.deleteFolder;
  const folder = path.join(_CONFIG.url.uploadFolder + id + '/');
  console.log('aaaaaaaaaaaaaaaaaaa');

  console.log(folder);
  console.log(arr.length);
  console.log(arr);
  console.log('bbbbbbbbbbb');
  console.log(deleteFolder);
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
    if (deleteFolder) {
      try {
        fs.rmdirSync(folder, { recursive: true });

        console.log(`${folder} is now deleted!`);
      } catch (err) {
        console.error(`Error while deleting ${folder}.`);
      }
    }
  });
  //res.redirect([200], 'back');
  let newTask = Object.assign({ id: id }, req.body);
  res.json({ status: 200, message: 'POST recieved', newTask: newTask });
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
