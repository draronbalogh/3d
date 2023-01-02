import express from 'express';
import db from '../_config/config-database';
import routes3d from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';
import formidable from 'formidable';
import os from 'node:os';
import util from 'node:util';
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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/upload', (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const form = formidable({ uploadDir: os.tmpdir() });
  const files: any[] = [];
  const fields: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call

  form
    .on('field', (fieldName, value) => {
      console.log(fieldName, value);
      fields.push({ fieldName, value });
    })
    .on('file', (fieldName, file) => {
      console.log(fieldName, file);
      files.push({ fieldName, file });
    })
    .on('end', () => {
      console.log('-> upload done');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(`received fields:\n\n${util.inspect(fields)}`);
      res.write('\n\n');
      res.end(`received files:\n\n${util.inspect(files)}`);
    });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      console.log('hiba');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.json({ fields, files });
  });
});
/*app.use(express.json());
app.use(express.urlencoded({ extended: true }));*/
app.use('/api/3dmodels', routes3d);

app.listen(5000, () => console.log('Server running at port 5000'));
