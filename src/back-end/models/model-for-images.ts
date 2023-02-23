//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigForImgModels } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrForImageTypes = db.define(_CONFIG.db.tableNameImages, seqConfigForImgModels, {
  tableName: _CONFIG.db.tableNameImages,
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
