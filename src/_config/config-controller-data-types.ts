import { DataTypes } from 'sequelize';

export const modelConfigSequalizeDataTypes = {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
  modelUuid: { type: DataTypes.STRING },
  modelUploaderUid: { type: DataTypes.STRING },
  modelTitle: { type: DataTypes.STRING },
  modelDescription: { type: DataTypes.TEXT },
  modelChannel: { type: DataTypes.STRING },
  modelCategory: { type: DataTypes.STRING },
  modelFormat: { type: DataTypes.STRING },
  modelTags: { type: DataTypes.STRING },
  modelUrl: { type: DataTypes.STRING },
  modelFileName: { type: DataTypes.STRING },
  modelImgs: { type: DataTypes.TEXT },
  modelSourceUrl: { type: DataTypes.STRING },
  modelExtraLinks: { type: DataTypes.TEXT },
  modelState: { type: DataTypes.STRING },
  modelVisibility: { type: DataTypes.TINYINT },
  modelRigged: { type: DataTypes.TINYINT },
  modelAnimated: { type: DataTypes.TINYINT },
  modelPolyCategory: { type: DataTypes.STRING },
  modelLegality: { type: DataTypes.STRING }
};
