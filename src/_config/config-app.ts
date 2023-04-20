export const appconfig = {
  app: {
    name: 'baseApp',
    version: '0.0.0',
    host: 'T1900317',
    httpport: '80',
    httpsport: '443'
    //        host: 'FOTO03SQLBUD',
    //        port: 80
  },
  auth: {
    auth_AD: 'true',
    auth_json: false,
    user_json: true
  },
  log: {
    logType_db: true,
    logType_txt: true,
    logType_txt_path: '/Logs/Log.txt'
  },
  db: {
    host: 'localhost',
    port: 3306,
    name: 'baseapp_db'
  }
};
