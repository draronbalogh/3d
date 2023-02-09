import { Sequelize } from 'sequelize';

const db = new Sequelize('3d', 'root', 'Asdqwe123', {
  host: '127.0.0.1',
  dialect: 'mysql' /* or 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  define: {
    freezeTableName: true
  }
});
export default db;
// more settings : https://www.bezkoder.com/node-js-upload-image-mysql/
// https://stackoverflow.com/questions/69111238/mysql-sequelize-searching-two-tables-with-one-findall
