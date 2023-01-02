import { Sequelize } from 'sequelize';
const db = new Sequelize('3d', 'root', 'Asdqwe123', { host: 'localhost', dialect: 'mysql' });
export default db;
// more settings : https://www.bezkoder.com/node-js-upload-image-mysql/
