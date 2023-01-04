import { Sequelize } from 'sequelize';
const db = new Sequelize('3d', 'root', 'Asdqwe123', { host: '127.0.0.1', dialect: 'mysql' });
export default db;
// more settings : https://www.bezkoder.com/node-js-upload-image-mysql/
