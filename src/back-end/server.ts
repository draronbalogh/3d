import express from 'express';
import db from '../_config/config-database';
import routes3d from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';
import formidable, { errors as formidableErrors } from 'formidable';
import { createNecessaryDirectoriesSync } from '../assets/file-methods';
import path, { parse } from 'path';
import fs from 'node:fs';
import { _CONFIG } from '../_config/_config';
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
  let folderId = '';
  const form = new formidable.IncomingForm({
    //  uploadDir: _CONFIG.url.uploadFolder,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 100, //bytes
    maxFiles: 20, // or Infinity
    maxFileSize: 1000 * 1024 * 1024, // 200mb*/
    multiples: true,
    filename: (name: string, ext: string, part: any, form: any) => {
      return name + ext;
    },
    filter: function ({ name, originalFilename, mimetype }) {
      if (mimetype) {
        if (mimetype.includes('octet-stream') || mimetype.includes('application') || mimetype.includes('application/octet-stream') || mimetype.includes('image')) {
          console.log('octet-stream');
          return true;
        }
      }
      return false;
    }
  });
  form.on('file', () => {
    // same as fileBegin, except
    // it is too late to change file.filepath
    // file.hash is available if options.hash was used
  });

  form.on('progress', function (bytesReceived: any, bytesExpected: any) {
    let x = Math.round((100 * bytesReceived) / bytesExpected) + '%';
    // console.log('x');
    // console.log(x);
    //return parse(x);
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
    //This is a great place for you to send your response.
  });
  form.on('error', (err) => {});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    } else {
    }
    // TODO::
    /*Your return res.status(200).send({ "message": "Successfully uploadded the files" }) is too soon, it should be in the callback.*/
    res.json({ status: 200, fields, files });
  });
};
const deleteFiles = async (req: any, res: any, next: any) => {
  console.clear();
  let arr: string[] = req.body.deleteTheseFiles || [];
  let id = req.body.id;
  let modelUuid = req.body.modelUuid;
  let deleteFolder = req.body.deleteFolder;
  const folder = path.join(_CONFIG.url.uploadFolder + modelUuid + '/');
  arr.forEach((filePath) => {
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
  let newTask = Object.assign({ id: id }, req.body);
  res.json({ status: 200, message: 'POST recieved', newTask: newTask });
};
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/deleteFiles', deleteFiles);
app.post('/upload', upload);
app.use('/api/3dmodels', routes3d);
app.listen(5000, () => console.log('Server running at port 5000'));
