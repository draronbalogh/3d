import https from 'https';
import http from 'http';
import winca from 'win-ca';
import * as forge from 'node-forge';
import fs from 'fs';
import express from 'express';

/**
 * Interface for SSL configuration options.
 *
 * @property {any[]} winSrc - Source of Windows Certificate Store.
 * @property {string} privKeyPath - Path to the private key PFX file.
 * @property {string} passPhrase - Passphrase for the private key PFX file.
 * @property {string} thumbprint - Thumbprint of the certificate to use.
 * @property {string} errBag - Error message when no bags are found in the PFX file.
 * @property {string} errKey - Error message when no private key is found in the PFX file.
 * @property {string} errCert - Error message when the certificate is not found.
 */

interface SslConf {
  winSrc: any[];
  privKeyPath: string;
  passPhrase: string;
  thumprint: string;
  errBag: string;
  errKey: string;
  errCert: string;
}

const app = express();

/**
 * Configuration object for SSL settings.
 */
const sslConf: SslConf = {
  winSrc: ['trustedpublisher'],
  privKeyPath: 'd:/cert/3d_withSAN.pfx',
  thumprint: 'b0ba25f574aef5a37a40ccf6a9cb896ec59a3300',
  passPhrase: 'Fapapucs.1234',
  errBag: 'No bags found in the PFX file!',
  errKey: 'No private key found in the PFX file',
  errCert: 'Certificate not found'
};

/**
 * Fetches certificates from the Windows Certificate Store.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of certificates.
 */
const fetchCertificates = (): Promise<any[]> =>
  new Promise((resolve) => {
    let certificates: any[] = [];
    winca({
      format: winca.der2.pem,
      store: sslConf.winSrc,
      ondata: (crt: any) => {
        certificates.push(crt);
      },
      onend: () => {
        resolve(certificates);
      }
    });
  });

/**
 * Generates a SHA-1 thumbprint of the given certificate.
 *
 * @param {forge.pki.Certificate} cert The certificate to generate a thumbprint for.
 * @returns {string} The SHA-1 thumbprint of the certificate.
 */
const getThumbprint = (cert: forge.pki.Certificate): string => {
  const md = forge.md.sha1.create();
  md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes());
  return md.digest().toHex();
};

/**
 * Extracts the private key from a PFX file.
 *
 * @param {string} pathToPfx The path to the PFX file.
 * @param {string} passphrase The passphrase used to protect the PFX file.
 * @returns {string} The private key.
 * @throws Will throw an error if no bags found in the PFX file or no private key found in the PFX file.
 */
const getPrivateKeyFromPfx = (pathToPfx: string, passphrase: string): string => {
  const pfxFile = fs.readFileSync(pathToPfx, 'binary');
  const pfx = forge.pkcs12.pkcs12FromAsn1(forge.asn1.fromDer(pfxFile), passphrase);
  const bags = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  if (!bags) throw new Error(sslConf.errBag);
  const bag = bags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0];
  if (bag?.key) {
    return forge.pki.privateKeyToPem(bag.key);
  } else {
    throw new Error(sslConf.errKey);
  }
};

/**
 * Starts the application.
 * If the `NODE_ENV` is 'production', it starts -> HTTPS server,
 * otherwise, it starts --> HTTP server.
 */
const startApp = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const certificates = await fetchCertificates();
      const foundCertificate = certificates.find((cert: any) => {
        const parsedCert = forge.pki.certificateFromPem(cert),
          certThumbprint = getThumbprint(parsedCert);
        return certThumbprint === sslConf.thumprint;
      });
      if (!foundCertificate) throw new Error(sslConf.errCert);
      const privateKey = getPrivateKeyFromPfx(sslConf.privKeyPath, sslConf.passPhrase),
        options = { key: privateKey, cert: foundCertificate },
        httpsServer = https.createServer(options, app);
      httpsServer.listen(443, () => {
        console.log('HTTPS server running on port 443');
      });
    } else {
      const httpServer = http.createServer(app);
      httpServer.listen(80, () => {
        console.log('HTTP server running on port 80');
      });
    }
  } catch (err) {
    console.error(err);
  }
};

startApp();
