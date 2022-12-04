import Sequelize from 'sequelize';
import db from '../config/config-database';

const { DataTypes } = Sequelize;

const Models3d = db.define(
  'models',
  {
    modelUuid: {
      type: DataTypes.TEXT
    },
    modelTitle: {
      type: DataTypes.TEXT
    },
    modelDescription: {
      type: DataTypes.TEXT
    }
  },
  {
    freezeTableName: true
  }
);

export default Models3d;
