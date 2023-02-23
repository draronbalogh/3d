//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigForImgModels } from '../../_config/config-controller-data-types';

///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrForImageTypes = db.define('images', seqConfigForImgModels, {
  tableName: 'images',
  freezeTableName: true
});

const createImagesTable = async () => {
  try {
    await ModelCtrForImageTypes.sync({ force: true }); // TODO:: make it force: false
    console.log('ModelCtrForImageTypes table created');
  } catch (error) {
    console.error('Error creating Images table:', error);
  }
};

createImagesTable();
///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrForImageTypes, db };
