//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigFor3dModels } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';

///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrFor3dTypes = db.define(_CONFIG.db.tableName3d, seqConfigFor3dModels, {
  tableName: _CONFIG.db.tableName3d,
  freezeTableName: true
});

const create3dModelTable = async () => {
  try {
    await ModelCtrFor3dTypes.sync({ force: true }); // TODO:: make it force: false
    console.log('ModelCtrFor3dTypes table created');
  } catch (error) {
    console.error('Error creating 3d model table:', error);
  }
};

create3dModelTable();

///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrFor3dTypes };
