//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   EXPRESS
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path, { parse } from 'path';
import fs from 'node:fs';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../_config/_config';
///////////////////////////////////////////////////////////   LIBS
import formidable, { errors as formidableErrors } from 'formidable';
///////////////////////////////////////////////////////////   COMPS
import routes3d from './routes/index';
import db from '../_config/config-database';
import { createNecessaryDirectoriesSync } from '../assets/file-methods';

///////////////////////////////////////////////////////////   FUNCTIONS
/**
 * Start server
 * @description Start server and connect to database
 */
const connectToDb = async () => {
  await db.authenticate();
  console.log('Database connected...');
};
/**
 * Upload file
 * @param req
 * @param res
 * @param next
 */
const upload = async (req: any, res: any, next: any) => {
  let folderId = '',
    isValid = false;
  ////////////////////////////////////////////   FORM CONFIG
  const form = new formidable.IncomingForm({
    //  uploadDir: _CONFIG.url.uploadFolder,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1,
    maxFiles: 100,
    maxFields: 0,
    maxFileSize: 10000 * 1024 * 1024,
    maxFieldsSize: 10000 * 1024 * 1024,
    multiples: true,
    enabledPlugins: ['octetstream', 'querystring', 'multipart', 'json'],
    encoding: 'utf-8',
    hashAlgorithm: false,
    filename: (name: string, ext: string, part: any, form: any) => {
      return name + ext;
    },
    filter: ({ name, originalFilename, mimetype }) => {
      if (originalFilename) {
        const currentFileType = originalFilename.split('.').pop();
        if (currentFileType && _CONFIG.fileValidation.types.includes(currentFileType)) isValid = true;
      }
      return isValid;
    }
  });
  ////////////////////////////////////////////   EVENT LISTENERS
  form.on('file', () => {});
  form.on('progress', function (bytesReceived: any, bytesExpected: any) {
    let perc = Math.round((100 * bytesReceived) / bytesExpected) + '%';
    // console.log('upload', perc);
    return perc;
  });
  form.on('field', (name, value) => {
    folderId = value;
  });
  form.on('fileBegin', (formname, file) => {
    createNecessaryDirectoriesSync(_CONFIG.url.uploadFolder + formname);
    const cim = path.join(_CONFIG.url.uploadFolder + formname + '/' + file.originalFilename);
    file.filepath = cim;
    folderId = formname;
  });
  form.on('aborted', () => {
    console.log('e1 pl. timeout miatt lehetséges');
  });
  form.on('end', () => {});
  form.on('error', (err) => {
    console.log(err);
  });
  ////////////////////////////////////////////   FORM PARSE
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
    }
    // await res.json({ status: 200, fields, files });
    try {
      if (!isValid) {
        return res.status(400).json({
          status: 'Failed',
          message: 'Wrong format type!'
        });
      }
      return res.status(200).json({ stauts: 'success', fields, files });
    } catch (error) {
      console.log('error multiple ', error);
    }
  });
};

/**
 * Delete files
 * @param req
 * @param res
 * @param next
 */
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

///////////////////////////////////////////////////////////   APP CONFIG
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb', parameterLimit: 100000 }));
app.use(bodyParser.raw({ limit: '1000mb' }));
app.post('/upload', upload);
app.post('/deleteFiles', deleteFiles);
app.use('/api/3dmodels', routes3d);
app.listen(5000, () => console.log('Server running at port 5000'));

///////////////////////////////////////////////////////////   RUN APP
try {
  console.log('Start database connection...');
  connectToDb();
  createNecessaryDirectoriesSync(_CONFIG.url.uploadFolder);
} catch (error) {
  console.error('Connection error:', error);
}
