//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   EXPRESS
import express from 'express';
import cors from 'cors';
import bodyParser, { json } from 'body-parser';
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
// import ActiveDirectory from 'activedirectory2';
import ldap, { Client } from 'ldapjs';
import { ServerResponse } from 'http';
import { Response } from 'express';

import { promisify } from 'util';

const { validation, url, msg, routes } = _CONFIG;
interface Config {
  url: string;
  baseDN: string;
  username: string;
  password: string;
}
interface User {
  displayName: string;
  mail: string;
  telephoneNumber: string;
  department: string;
}
interface Entry {
  entry: any;
  name: string;
  phone: string;
}

interface Leader {
  email: string | undefined;
}
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

/**
Get role values from an LDAP entry for the specified attribute type that contains the substring 'CN=beleptetes'.
@param {Object} entry - The LDAP entry object.
@param {string} type - The type of the attribute to search for.
@returns {Array<string>} - An array of role values.
*/
const getRoleValues = (entry: any, type: string) => {
  const attribute: any = entry.pojo.attributes.find((attributeCheck: { type: string; value: any }) => attributeCheck.type === type);
  return attribute.values.filter((str: any) => str.includes('CN=beleptetes')).map((str: any) => str.split(',')[0].substring(3).replace(/"/g, '')) ?? [];
};

/**
Get the manager name from an LDAP entry for the specified attribute type.
@param {Object} entry - The LDAP entry object.
@param {string} type - The type of the attribute to search for.
@returns {string} - The manager name or 'Nincs megadva' if not found.
*/

const getManagerName = (entry: any, type: string) => {
  const parts = getAttributeValue(entry, type).split(',');
  const cnPart = parts.find((part) => part.startsWith('CN='));
  return cnPart?.substring(3).replace(/"/g, '') ?? 'Nincs megadva';
};

/**
Get the value of an attribute from an LDAP entry for the specified attribute type.
@param {Object} entry - The LDAP entry object.
@param {string} type - The type of the attribute to search for.
@returns {string} - The value of the attribute or an empty string if not found.
*/
const getAttributeValue = (entry: any, type: string) => {
  const attribute = entry.pojo.attributes.find((attributeCheck: { type: string; value: any }) => attributeCheck.type === type);
  return JSON.stringify(attribute?.values[0]).replace(/"/g, '');
};

/**
 * Authenticate a user against a LDAP server using ActiveDirectory library.
 * @param {express.Request} req - The request object from express.
 * @param {express.Response} res - The response object from express.
 * @returns {Promise<Leader|null>} - A promise that resolves with a Leader object or null, depending on the result of the LDAP query.
 
* Filter explanation (minden value egy []):
    objectClass: Kategória szűrő: 'top', 'person', 'organizationalPerson', 'user'
    cn: Common Name: LDAP attribútum, azaz név rendesen kiírva pl.: 'Balogh Áron'
    sn: Surname: vezetéknév pl.: 'Balogh'
    l: Location: lakhely pl.: 'Budapest'
    title: Beosztás: pl.: fejlesztőa
    description: Beosztás leírása: pl.: műsorinformatikai fejlesztő mérnök
    postalCode: Irányítószám, 1037
    physicalDeliveryfficeName: Irodai helyiség: pl.: A2044
    givenName: Keresztnév, pl.: Áron
    displayName: Megjelenített név, pl.: Balogh Áron
    memberOf: Felhasználóhoz vagy csoport tagjaihoz kapcsolódó jogosultságokat, információkat tartalmazza: az irodát (pl.:Informatikai Iroda) a hierarchiában elfoglalt pozíciójukat is valamint azoknak a csoportoknak a nevét tartalmazzák, amelyekbe az adott felhasználó vagy csoport tagja tartozik.
    department: Részleg, pl.: Szoftverfejlesztés és Szoftverüzemeltetés Csoport
    company: Cég, pl.: Médiaszolg.-tám. és Vagyonkezelő Alap
    streetAddress: Cég címe, pl.: Kunigunda útja 64.
    name: Név, pl.: Balogh Áron
    sAMAccountName: !!FONTOS!! AD-hhoz egyedi hálózati bejelentkezési név, egyedi azonosító
    otherFacsimileTelephoneNumber: Itt a userhez tartozó PC-k jelölését találjuk, pl.: ['mit-grpc-01', 'grpc-10']
    userPrincipalName: Email cím pl.: balogh.aron@mtva.hu
    mail: Email cím pl.: Balogh.Aron@mtva.hu
    manager: Felettes, pl.: ['CN=Fodor Erika,OU=MTVA,OU=Windows_10,OU=Users,OU=MTVA,DC=intra,DC=mtv,DC=hu']
    mobile: Mobil, pl.: ['+36 (30) 211 3146']
    pager: Bérkód, pl.: 123456
    thumbnailPhoto: User fotója, pl.: ����\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00��\x
    mailNickname: Nicknév, pl.: aron.balogh

  * Filter name és magyarzázata (csak pálda): 
      filterForName: `(&
        (objectcategory=person) 
        (objectclass=user)
        (samaccountname=aron.balogh)
        (!(pager=TECHNIKAI*))
        (!(pager=fax))
        (pager=*)
        (mail=*)
        (!(samaccountname=*teszt*))
        (!(samaccountname=*test*))
        (!(samaccountname=_*))
        (!(userAccountControl:1.2.840.113556.1.4.803:=2)))`

    - A találatok objectcategory tulajdonsága 'person' kell legyen
    - A találatok objectclass tulajdonsága 'user' kell legyen
    - A találatok samaccountname tulajdonságának értéke 'aron.balogh' kell legyen
    - A találatok pager tulajdonsága nem tartalmazhatja a 'TECHNIKAI*' vagy a 'fax' szavakat
    - A találatok pager tulajdonságának üresnek nem szabad lennie
    - A találatok mail tulajdonságának értéke nem lehet üres
    - A találatok samaccountname tulajdonsága nem lehet olyan, ami tartalmazza a 'teszt', 'test' vagy '_*' karakterláncokat
    - A találatok userAccountControl tulajdonsága nem lehet letiltott (2-es értékkel jelölve)
 */

const ldapsLogin = async (req: express.Request, res: express.Response): Promise<void> => {
  const client: Client = ldap.createClient({
    url: _CONFIG.ldap.urlSecFull,
    tlsOptions: {
      rejectUnauthorized: false
    },
    reconnect: false,
    connectTimeout: 5000,
    idleTimeout: 1500
  });

  let responseSent = false;

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
        var entries: Entry[] = [];
        const searchCallback = (err: Error | null, searchRes: any) => {
          if (err) {
            reject(`Keresési hiba: ${err}`);
            return;
          }
          searchRes.on('searchEntry', (entry: any) => {
            if (entry?.pojo) {
              const name = getAttributeValue(entry, 'displayName');
              if (name === 'Nincs megadva') return;
              const phone = getAttributeValue(entry, 'mobile');
              if (phone === 'Nincs megadva') return;
              entries.push({ entry: entry.pojo.attributes, name: getAttributeValue(entry, 'displayName'), phone: '123' });
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
app.use('/auth', ldapsLogin);
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
