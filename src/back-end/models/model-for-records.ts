//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigForRecords } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';

///////////////////////////////////////////////////////////   CONTROLLERS
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const ModelCtrFor3dTypes = db.define(_CONFIG.db.tableNameRecords, seqConfigForRecords, {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  tableName: _CONFIG.db.tableNameRecords,
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
