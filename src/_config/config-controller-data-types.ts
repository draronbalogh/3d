import { DataTypes } from 'sequelize';

export const modelConfigSequalizeDataTypes = {
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
  modelUuid: { type: DataTypes.STRING },
  modelUploaderUid: { type: DataTypes.STRING },
  modelFileName: { type: DataTypes.STRING },
  modelTitle: { type: DataTypes.STRING },
  modelDescription: { type: DataTypes.TEXT },
  modelChannel: { type: DataTypes.STRING },
  modelCategory: { type: DataTypes.STRING },
  modelFormat: { type: DataTypes.STRING },
  modelTags: { type: DataTypes.STRING },
  modelImgs: { type: DataTypes.TEXT },
  modelExtraLinks: { type: DataTypes.TEXT },
  modelUrl: { type: DataTypes.STRING },
  modelState: { type: DataTypes.STRING },
  modelVisibility: { type: DataTypes.TINYINT },
  modelRigged: { type: DataTypes.TINYINT },
  modelAnimated: { type: DataTypes.TINYINT },
  modelPolyCategory: { type: DataTypes.STRING },
  modelLegality: { type: DataTypes.STRING }
};
