//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   EXPRESS
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path, { parse } from 'path';
import fs from 'node:fs';
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG, PORT3D } from '../_config/config-general';
///////////////////////////////////////////////////////////   LIBS
import formidable, { errors as formidableErrors } from 'formidable';
///////////////////////////////////////////////////////////   COMPS
import routesRecord from './routes/routes-records';
import routesImages from './routes/routes-images';
import routesVideos from './routes/routes-videos';
import routesModels3d from './routes/routes-models3d';
import dbC from '../_config/config-database';
import { createNecessaryDirectoriesSync } from '../assets/file-methods';
import { logAxiosError } from '../assets/gen-methods';
const { validation, url, msg, routes } = _CONFIG;
///////////////////////////////////////////////////////////   FUNCTIONS
/**
 * Connect to database and start server
 * @description Start server and connect to database
 */
const connectToDb = async () => {
  try {
    await dbC.authenticate();
    console.log(msg.txt.db.success);
  } catch (error) {
    logAxiosError(error, msg.error.db.connection);
  }
};

/**
 * Upload file
 * @param req
 * @param res
 * @param next
 */
const uploadRecord = async (req: any, res: any, next: any) => {
  let folderId = '',
    isValid = false;
  ////////////////////////////////////////////   FORM CONFIG
  const form = new formidable.IncomingForm({
    uploadDir: url.uploadFolder,
    keepExtensions: validation.file.keepExtensions,
    allowEmptyFiles: validation.file.allowEmptyFiles,
    maxFiles: validation.file.maxFiles,
    minFileSize: validation.file.minFileSize,
    maxFileSize: validation.file.maxFileSize,
    maxTotalFileSize: validation.file.maxTotalFileSize,
    maxFields: validation.file.maxFields,
    maxFieldsSize: validation.file.maxFieldsSize,
    enabledPlugins: ['octetstream', 'querystring', 'multipart', 'json'],
    encoding: 'utf-8', // encoding for incoming form fields
    multiples: true,
    hashAlgorithm: false,
    filename: (name: string, ext: string, part: any, form: any) => {
      return name + ext;
    },
    filter: ({ name, originalFilename, mimetype }) => {
      if (originalFilename) {
        const currentFileType = originalFilename.split('.').pop();
        if (currentFileType && validation.file.types.includes(currentFileType)) isValid = true;
      }
      return isValid;
    }
  });
  ////////////////////////////////////////////   EVENT LISTENERS

  /**
   * Progress event listener
   * Emitted after each incoming chunk of data that has been parsed.
   * Reports the progress of the incoming form.
   */
  form.on('progress', (bytesReceived: any, bytesExpected: any) => {
    const perc = Math.round((100 * bytesReceived) / bytesExpected) + '%';
    // console.log('uploadRecord', perc);
    return perc;
  });

  /**
   * Form field event listener
   * Emitted whenever a field / value pair has been received.
   * @param name - field name
   * @param value - field value
   * @returns {void}
   */
  form.on('field', (name, value) => {
    folderId = value;
  });

  /**
   * File begin event listener
   * Emitted whenever a new file is detected!
   */
  form.on('fileBegin', (formname, file) => {
    createNecessaryDirectoriesSync(url.uploadFolder + formname);
    const cim = path.join(url.uploadFolder + formname + '/' + file.originalFilename);
    file.filepath = cim;
    folderId = formname;
  });

  /**
   * File event listener
   * Emitted whenever a field / file pair has been received. file is an instance of File.
   */
  form.on('file', () => {});

  /**
   * Error event listener
   * Emitted when an error occurs.
   */
  form.on('error', (err) => {
    console.log(msg.error.form.general, err);
  });

  /**
   * Aborted event listener
   * Emitted when the incoming form has been aborted by the user.
   */
  form.on('aborted', () => {
    console.log(msg.error.form.aborted);
  });

  /**
   * End event listener
   * Emitted when the entire request has been received, and all contained files have finished flushing to disk.
   * @todo: send your response here
   */
  form.on('end', () => {});

  ////////////////////////////////////////////   FORM PARSE

  /**
   * Parse form
   * @description Parse form and return fields and files
   */
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
    }
    try {
      if (!isValid) {
        return res.status(400).json({
          status: 'Failed',
          message: msg.error.form.parse
        });
      }
      return res.status(200).json({ stauts: 'success', fields, files });
    } catch (error) {
      console.log(msg.error.form.parse, error);
    }
  });
};

/**
 * Delete files
 * @param req
 * @param res
 * @param next
 */
const deleteRecordFiles = async (req: any, res: any, next: any) => {
  const arr: string[] = req.body.deleteTheseFiles || [],
    id = req.body.id,
    recordUuid = req.body.recordUuid,
    deleteFolder = req.body.deleteFolder,
    folder = path.join(url.uploadFolder + recordUuid + '/');
  arr.forEach((filePath) => {
    if (fs.existsSync(folder + filePath)) {
      fs.unlink(folder + filePath, (err) => {
        if (err) {
          console.log(msg.error.file.unlink, filePath);
        } else {
          console.log(msg.txt.file.removed, filePath);
        }
      });
    }
    if (deleteFolder) {
      try {
        fs.rmdirSync(folder, { recursive: true });
      } catch (err) {
        console.error(`${msg.error.file.folder} ${folder}.`);
      }
    }
  });
  const newTask = Object.assign({ id: id }, req.body);
  res.json({ status: 200, message: msg.txt.file.deleteOk, newTask: newTask });
};

///////////////////////////////////////////////////////////   APP (pre)CONFIG
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.post(routes.uploadRecord, uploadRecord);
app.post(routes.deleteRecordFiles, deleteRecordFiles);
app.use(routes.routesRecord, routesRecord);
app.use(routes.routesImages, routesImages);
app.use(routes.routesVideos, routesVideos);
app.use(routes.routesModels3d, routesModels3d);
app.listen(PORT3D, () => console.log(msg.txt.server.started));

///////////////////////////////////////////////////////////   RUN APP
try {
  console.clear();
  console.log(msg.txt.db.startDb);
  //connectToDb();
  // createNecessaryDirectoriesSync(url.uploadFolder);
} catch (error) {
  console.error(msg.error.db.connection, error);
}
