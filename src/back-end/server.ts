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
let isMultipart = false;
createNecessaryDirectoriesSync(_CONFIG.url.uploadFolder);

const upload = async (req: any, res: any, next: any) => {
  console.log('//////////////////////////////////////////////// new upload /////////////////////////////');
  let folderId = '';
  const form = new formidable.IncomingForm({
    //  uploadDir: _CONFIG.url.uploadFolder,
    keepExtensions: true,
    allowEmptyFiles: true,
    minFileSize: 1, //bytes
    maxFiles: 100, // or Infinity
    maxFields: 0,
    maxFileSize: 50000 * 1024 * 1024, // 200 mb
    maxFieldsSize: 50000 * 1024 * 1024,
    multiples: true,
    enabledPlugins: ['octetstream', 'querystring', 'multipart', 'json'],
    encoding: 'utf-8',
    hashAlgorithm: false,

    filename: (name: string, ext: string, part: any, form: any) => {
      return name + ext;
    },
    filter: () => {
      return true;
    }
  });

  form.on('file', () => {
    // same as fileBegin, except
    // it is too late to change file.filepath
    // file.hash is available if options.hash was used
  });

  form.on('progress', function (bytesReceived: any, bytesExpected: any) {
    let x = Math.round((100 * bytesReceived) / bytesExpected) + '%';
    console.log('upload', x);
    //return parse(x);
  });
  form.on('field', (name, value) => {
    folderId = value;
    //Emitted whenever a field / value pair has been received.
  });
  form.on('fileBegin', (formname, file) => {
    console.log(formname + '/' + file.originalFilename);

    // isMultipart = true;
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
    console.log('e1 pl. timeout miatt lehetséges');

    //Emitted when the request was aborted by the user. Right now this can be due to a 'timeout' or 'close' event on the socket. After this event is emitted, an error event will follow.
  });
  form.on('end', () => {
    //This is a great place for you to send your response.
  });
  form.on('error', (err) => {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2');
    // console.log(err);
    if (err.code === formidableErrors.maxFieldsExceeded) {
      console.log('e3');
      return res.status(400).json({
        status: 'Failed',
        message: 'Too many fields',
        error: err
      });
    }

    if (err.code === formidableErrors.aborted) {
      console.log('aborted');
      return res.status(400).json({
        status: 'Failed',
        message: 'File upload aborted',
        error: err
      });
    }
    if (err.code === formidableErrors.missingContentType) {
      console.log('missingContentType');
      return res.status(400).json({
        status: 'Failed',
        message: 'Missing content type',
        error: err
      });
    }
    if (err.code === formidableErrors.malformedMultipart) {
      console.log('malformedMultipart');
      return res.status(400).json({
        status: 'Failed',
        message: 'Malformed multipart',
        error: err
      });
    }
    if (err.code === formidableErrors.missingMultipartBoundary) {
      console.log('missingMultipartBoundary');
      return res.status(400).json({
        status: 'Failed',
        message: 'Missing multipart boundary',
        error: err
      });
    }
    if (err.code === formidableErrors.unknownTransferEncoding) {
      console.log('unknownTransferEncoding');
      return res.status(400).json({
        status: 'Failed',
        message: 'Unknown transfer encoding',
        error: err
      });
    }
    if (err.code === formidableErrors.missingPlugin) {
      console.log('missingPlugin');
      return res.status(400).json({
        status: 'Failed',
        message: 'Missing plugin',
        error: err
      });
    }
    if (err.code === formidableErrors.pluginFunction) {
      console.log('pluginFunction');
      return res.status(400).json({
        status: 'Failed',
        message: 'Plugin function',
        error: err
      });
    }
    if (err.code === formidableErrors.noParser) {
      console.log('noParser');
      return res.status(400).json({
        status: 'Failed',
        message: 'No parser',
        error: err
      });
    }

    if (err.code === formidableErrors.uninitializedParser) {
      console.log('uninitializedParser');
      return res.status(400).json({
        status: 'Failed',
        message: 'Uninitialized parser',
        error: err
      });
    }

    if (err.code === formidableErrors.filenameNotString) {
      console.log('filenameNotString');
      return res.status(400).json({
        status: 'Failed',
        message: 'Filename not string',
        error: err
      });
    }
    if (err.code === formidableErrors.maxFieldsSizeExceeded) {
      console.log('maxFieldsSizeExceeded');
      return res.status(400).json({
        status: 'Failed',
        message: 'Max fields size exceeded',
        error: err
      });
    }
    if (err.code === formidableErrors.maxFieldsExceeded) {
      console.log('maxFieldsExceeded');
      return res.status(400).json({
        status: 'Failed',
        message: 'Max fields exceeded',
        error: err
      });
    }
    if (err.code === formidableErrors.smallerThanMinFileSize) {
      console.log('smallerThanMinFileSize');
      return res.status(400).json({
        status: 'Failed',
        message: 'Smaller than min file size',
        error: err
      });
    }
    if (err.code === formidableErrors.biggerThanMaxFileSize) {
      console.log('biggerThanMaxFileSize');
      return res.status(400).json({
        status: 'Failed',
        message: 'Bigger than max file size',
        error: err
      });
    }
    if (err.code === formidableErrors.noEmptyFiles) {
      console.log('noEmptyFiles');
      return res.status(400).json({
        status: 'Failed',
        message: 'No empty files',
        error: err
      });
    }
    if (err.code === formidableErrors.missingContentType) {
      console.log('missingContentType');
      return res.status(400).json({
        status: 'Failed',
        message: 'Missing content type',
        error: err
      });
    }

    if (err.code === formidableErrors.malformedMultipart) {
      console.log('malformedMultipart');
      return res.status(400).json({
        status: 'Failed',
        message: 'Malformed multipart',
        error: err
      });
    }

    if (err.code === formidableErrors.missingMultipartBoundary) {
      console.log('missingMultipartBoundary');
      return res.status(400).json({
        status: 'Failed',
        message: 'Missing multipart boundary',
        error: err
      });
    }
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      // res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      // res.end(String(err));
      /*   return res.status(400).json({
        status: 'Failed',
        message: 'File upload failed',
        error: err
      });*/
    }
    //vagy
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({ fields, files }, null, 2));
    // TODO::
    //vagy
    /*Your return res.status(200).send({ "message": "Successfully uploadded the files" }) is too soon, it should be in the callback.*/
    // vagy
    // await res.json({ status: 200, fields, files });
    try {
      console.log('res.json a formformformform');
      return res.status(200).json({ stauts: 'success', fields, files });
    } catch (error) {
      console.log('error multiple ', error);
    }
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
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb', parameterLimit: 100000 }));
app.use(bodyParser.raw({ limit: '1000mb' }));
app.post('/upload', upload);
/*app.use(function (err: any, req: any, res: any, next: any) {
  console.error('aaaaaaaaa', err);
  res.status(500).send('Something broke!');
});*/
app.post('/deleteFiles', deleteFiles);
app.use('/api/3dmodels', routes3d);
app.listen(5000, () => console.log('Server running at port 5000'));
