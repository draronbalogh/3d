import https from 'https';
import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import ldap, { Client } from 'ldapjs';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { _CONFIG, PORT3D } from '../_config/config-general';
import routesRecord from './routes/routes-records';
import routesImages from './routes/routes-images';
import routesVideos from './routes/routes-videos';
import routesModels3d from './routes/routes-models3d';
import dbC from '../_config/config-database';
import winca from 'win-ca';
import crypto from 'crypto';
import { createHash } from 'crypto';

import * as forge from 'node-forge';
import * as tls from 'tls';

import { createNecessaryDirectoriesSync } from '../assets/file-methods';
import { logAxiosError } from '../assets/gen-methods';

const { validation, url, msg, routes } = _CONFIG;

interface Entry {
  entry: any;
  name: string;
  phone: string;
  manager: string;
  //roles: string;
}
interface Leader {
  email: string | undefined;
}

const connectToDb = async () => {
  try {
    await dbC.authenticate();
    console.log(msg.txt.db.success);
  } catch (error) {
    logAxiosError(error, msg.error.db.connection);
  }
};

const uploadRecord = async (req: Request, res: Response, next: express.NextFunction) => {
  let folderId = '';
  let isValid = false;

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
    encoding: 'utf-8',
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

  form.on('progress', (bytesReceived: any, bytesExpected: any) => {
    const perc = Math.round((100 * bytesReceived) / bytesExpected) + '%';
    return perc;
  });

  form.on('field', (name, value) => {
    folderId = value;
  });

  form.on('fileBegin', (formname, file) => {
    createNecessaryDirectoriesSync(url.uploadFolder + formname);
    const cim = path.join(url.uploadFolder + formname + '/' + file.originalFilename);
    file.filepath = cim;
    folderId = formname;
  });

  form.on('file', () => {});

  form.on('error', (err) => {
    console.log(msg.error.form.general, err);
  });

  form.on('aborted', () => {
    console.log(msg.error.form.aborted);
  });

  form.on('end', () => {});

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

const deleteRecordFiles = async (req: Request, res: Response, next: express.NextFunction) => {
  const arr: string[] = req.body.deleteTheseFiles || [];
  const id = req.body.id;
  const recordUuid = req.body.recordUuid;
  const deleteFolder = req.body.deleteFolder;
  const folder = path.join(url.uploadFolder + recordUuid + '/');

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

const getRoleValues = (entry: any, type: string): string[] => {
  const attribute: any = entry.pojo.attributes.find((attributeCheck: { type: string; value: any }) => attributeCheck.type === type);
  return attribute.values.filter((str: any) => str.includes('CN=beleptetes')).map((str: any) => str.split(',')[0].substring(3).replace(/"/g, '')) ?? [];
};

const getManagerName = (entry: any, type: string): string => {
  const parts = getAttributeValue(entry, type).split(',');
  const cnPart = parts.find((part) => part.startsWith('CN='));
  return cnPart?.substring(3).replace(/"/g, '') ?? 'Nincs megadva';
};

const getAttributeValue = (entry: any, type: string): string => {
  const attribute = entry.pojo.attributes.find((attributeCheck: { type: string; value: any }) => attributeCheck.type === type);
  return JSON.stringify(attribute?.values[0]).replace(/"/g, '');
};

const ldapsLogin = async (req: Request, res: Response): Promise<void> => {
  const client: Client = ldap.createClient({
    url: 'ldaps://DC05BUD.intra.mtv.hu:636',
    tlsOptions: {
      rejectUnauthorized: false
    },
    reconnect: false,
    connectTimeout: 5000,
    idleTimeout: 1500
  });

  let responseSent: boolean = false;
  client.on('error', (err: Error) => {
    console.error('LDAP error:', err);
    if (!responseSent) {
      responseSent = true;
      res.status(500).json({ error: 'LDAP error' });
    }
  });

  try {
    await new Promise<void>((resolve, reject) => {
      client.bind(_CONFIG.ldap.u, _CONFIG.ldap.p, (err?: Error | null) => {
        if (err) {
          reject('A felhasználónév vagy jelszó helytelen!');
          return;
        }

        const opts: ldap.SearchOptions = {
          filter: '(&(objectcategory=person)(objectclass=user)(samaccountname=aron.balogh)(!(pager=TECHNIKAI*))(!(pager=fax))(pager=*)(mail=*)(!(samaccountname=*teszt*))(!(samaccountname=*test*))(!(samaccountname=_*))(!(userAccountControl:1.2.840.113556.1.4.803:=2)))',
          scope: 'sub',
          attributes: ['*']
        };

        const entries: Entry[] = [];

        const searchCallback = (err: Error | null, searchRes: any) => {
          if (err) {
            reject(`Keresési hiba: ${err}`);
            return;
          }
          searchRes.on('searchEntry', (entry: any) => {
            if (entry?.pojo) {
              const name = getAttributeValue(entry, 'displayName');
              if (name === 'Nincs megadva') return;
              const phone = getAttributeValue(entry, 'mobile')?.replace(/["() ]/g, '');
              if (phone === 'Nincs megadva') return;
              const manager = getManagerName(entry, 'manager');
              // const roles = getRoleValues(entry, 'roles');

              entries.push({ entry: entry.pojo.attributes, name, phone, manager });
            }
          });
          searchRes.on('error', (err: Error) => {
            reject({ err });
          });
          searchRes.on('end', (result: any) => {
            console.log('LDAP search finished');
            client.unbind((err) => {
              if (err) console.error('LDAP unbind error: ', err);
            });
            if (!responseSent) {
              responseSent = true;
              res.status(200).json(entries);
            }
            resolve();
          });
        };

        client.search(_CONFIG.ldap.baseDN, opts, searchCallback);
      });
    });
  } catch (err) {
    console.error('LDAP connection error: ', err);
    if (!responseSent) {
      responseSent = true;
      res.status(500).json({ error: 'LDAP connection error' });
    }
  }
};
dotenv.config();

const httpRedirectMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log('redirecting to https');
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
};
const removeWwwMiddlewareWWW = (req: Request, res: Response, next: NextFunction) => {
  if (req.hostname.startsWith('www.')) {
    const noWwwUrl = `https://${req.hostname.slice(4)}${req.url}`;
    res.redirect(301, noWwwUrl);
  } else {
    next();
  }
};
const app = express();

const fetchCertificates = (): Promise<any[]> =>
  new Promise((resolve) => {
    let certificates: any[] = [];
    winca({
      format: winca.der2.pem,
      store: ['trustedpublisher'],
      ondata: (crt: any) => {
        certificates.push(crt);
      },
      onend: () => {
        resolve(certificates);
      }
    });
  });

const getThumbprint = (cert: forge.pki.Certificate): string => {
  const md = forge.md.sha1.create();
  md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes());
  return md.digest().toHex();
};

const startApp = async () => {
  try {
    const certificates = await fetchCertificates();

    const thumbprint = 'b0ba25f574aef5a37a40ccf6a9cb896ec59a3300';
    const foundCertificate = certificates.find((cert: any) => {
      const parsedCert = forge.pki.certificateFromPem(cert);
      const certThumbprint = getThumbprint(parsedCert);
      return certThumbprint === thumbprint;
    });

    if (!foundCertificate) {
      throw new Error('Certificate not found');
    }

    console.log('Certificate found:', foundCertificate);

    if (process.env.NODE_ENV === 'production') {
      const privateKey = fs.readFileSync('d:/cert/key.pem', 'utf8');

      const options = {
        key: privateKey,
        cert: foundCertificate,
        passphrase: 'Fapapucs.1234'
      };

      const httpsServer = https.createServer(options, app);
      httpsServer.listen(443, () => {
        console.log('HTTPS server running on port 443');
      });

      // HTTP redirect logic
    }
  } catch (err) {
    console.error(err);
  }
};

startApp();
app.use(removeWwwMiddlewareWWW); /*
if (pfx) {
  console.log('PFX file successfully loaded.');
} else {
  console.log('Failed to load PFX file.');
}*/

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
app.use('/auth', ldapsLogin);

// listeners
app.get('/ar', (req, res) => {
  console.log('Hello Áron!');
  res.send('Hello Áron!');
});
app.get('/ba', (req, res, next) => {
  console.log('Hello Balázs!');
  res.send('Hello Balázs! sssszzzzzzzzz');
});
app.get('/', (req, res, next) => {
  console.log('Hello Attila!');
  next();
});
