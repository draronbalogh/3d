import { Sequelize } from 'sequelize';
const db = new Sequelize('3d', 'root', 'Asdqwe123', { host: 'localhost', dialect: 'mysql' });
export default db;
