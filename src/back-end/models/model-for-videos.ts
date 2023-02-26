//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigForVidModels } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrForVideoTypes = db.define(_CONFIG.db.tableNameVideos, seqConfigForVidModels, {
  tableName: _CONFIG.db.tableNameVideos,
  freezeTableName: true
});

const createVideosTable = async () => {
  try {
    await ModelCtrForVideoTypes.sync({ force: true }); // TODO:: make it force: false
    console.log('ModelCtrForVideoTypes table created');
  } catch (error) {
    console.error('Error creating Videos table:', error);
  }
};

createVideosTable();
///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrForVideoTypes, db };
