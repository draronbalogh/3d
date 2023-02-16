import { DataTypes } from 'sequelize';

export const seqConfigFor3dModels = {
  modelId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  modelCreatedAt: { type: DataTypes.DATE },
  modelUpdatedAt: { type: DataTypes.DATE },
  modelUuid: { type: DataTypes.STRING(100) },
  modelUploaderUid: { type: DataTypes.STRING(50) },
  modelTitle: { type: DataTypes.STRING(255) },
  modelDescription: { type: DataTypes.TEXT },
  modelChannel: { type: DataTypes.STRING(50) },
  modelCategory: { type: DataTypes.STRING(50) },
  modelRenderEngine: { type: DataTypes.STRING(255) },
  modelPolyCategory: { type: DataTypes.STRING(50) },
  modelPolyCount: { type: DataTypes.STRING(255) },
  modelFormat: { type: DataTypes.STRING(255) },
  modelTags: { type: DataTypes.STRING(255) },
  modelUrl: { type: DataTypes.STRING(255) },
  modelFileName: { type: DataTypes.TEXT },
  modelImgs: { type: DataTypes.TEXT },
  modelSourceUrl: { type: DataTypes.TEXT },
  modelIframeUrl: { type: DataTypes.TEXT },
  modelExtraLinks: { type: DataTypes.TEXT },
  modelMaterialUrl: { type: DataTypes.TEXT },
  modelState: { type: DataTypes.STRING(255) },
  modelVisibility: { type: DataTypes.TINYINT },
  modelRigged: { type: DataTypes.TINYINT },
  modelAnimated: { type: DataTypes.TINYINT },
  modelUv: { type: DataTypes.TEXT },
  modelLegality: { type: DataTypes.STRING(255) },
  modelScript: { type: DataTypes.TEXT },
  modelViewerUid: { type: DataTypes.STRING(50) },
  modelViewCount: { type: DataTypes.INTEGER },
  modelDownloaderUid: { type: DataTypes.STRING(50) },
  modelDownloadCount: { type: DataTypes.INTEGER }
};

export const seqConfigForImgModels = {
  imgId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  imgCreatedAt: { type: DataTypes.DATE },
  imgUpdatedAt: { type: DataTypes.DATE },
  modelId: { type: DataTypes.INTEGER },
  modelUuid: { type: DataTypes.STRING(100) },
  imgUuid: { type: DataTypes.STRING(100) },
  imgUploaderUid: { type: DataTypes.STRING(50) },
  imgFileName: { type: DataTypes.TEXT },
  imgFilePath: { type: DataTypes.TEXT },
  imgFileType: { type: DataTypes.STRING(100) },
  imgFileFormat: { type: DataTypes.STRING(100) },
  imgFileWidth: { type: DataTypes.INTEGER },
  imgFileHeight: { type: DataTypes.INTEGER },
  imgFileResolution: { type: DataTypes.INTEGER },
  imgFileTags: { type: DataTypes.TEXT },
  imgFileDescription: { type: DataTypes.TEXT },
  imgFileTitle: { type: DataTypes.STRING(255) },
  imgFileCategory: { type: DataTypes.STRING(255) },
  imgFileSourceUrl: { type: DataTypes.TEXT }
};
