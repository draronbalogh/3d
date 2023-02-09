//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigFor3dModels, seqConfigForImgModels } from '../../_config/config-controller-data-types';

///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrFor3dTypes = db.define('models', seqConfigFor3dModels, {
  freezeTableName: true
});

const ModelCtrForImageTypes = db.define('images', seqConfigForImgModels, {
  tableName: 'images',
  freezeTableName: true
});

const create3dModelTable = async () => {
  try {
    await ModelCtrFor3dTypes.sync({ force: false });
    console.log('ModelCtrFor3dTypes table created');
  } catch (error) {
    console.error('Error creating 3d model table:', error);
  }
};

const createImagesTable = async () => {
  try {
    await ModelCtrForImageTypes.sync({ force: false });
    console.log('ModelCtrForImageTypes table created');
  } catch (error) {
    console.error('Error creating Images table:', error);
  }
};

create3dModelTable();
createImagesTable();
///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrFor3dTypes, ModelCtrForImageTypes };
