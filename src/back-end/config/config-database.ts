import { Sequelize } from 'sequelize';
const db = new Sequelize('3d', 'root', '', { host: 'localhost', dialect: 'mysql' });
export default db;
