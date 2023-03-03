import { _CONFIG, HOST3D } from './config-general';
import { Sequelize } from 'sequelize';
const { db } = _CONFIG;
/* 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
const dbC = new Sequelize(db.host, db.user, db.pass, {
  host: '127.0.0.1',
  port: 3000,
  dialect: 'mysql',
  define: {
    freezeTableName: true
  },
  logging: console.log // output SQL statements to console
});
export default dbC;
// more settings : https://www.bezkoder.com/node-js-upload-image-mysql/
// https://stackoverflow.com/questions/69111238/mysql-sequelize-searching-two-tables-with-one-findall
