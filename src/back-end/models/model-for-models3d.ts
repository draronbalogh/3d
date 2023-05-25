//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import dbC from '../../_config/config-database';
import { seqConfigForModels3d } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrForModels3dTypes = dbC.define(_CONFIG.db.tableNameModels3d, seqConfigForModels3d, {
  tableName: _CONFIG.db.tableNameModels3d,
  freezeTableName: true
});

const create3dTable = async () => {
  try {
    await ModelCtrForModels3dTypes.sync({ force: false }); // TODO:: make it force: false
    console.log('ModelCtrFor3dTypes table created');
  } catch (error) {
    console.error('Error creating models table:', error);
  }
};

create3dTable();
///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrForModels3dTypes, dbC };
