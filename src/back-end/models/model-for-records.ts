//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { seqConfigForRecords } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';

///////////////////////////////////////////////////////////   CONTROLLERS
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const ModelCtrForRecordTypes = db.define(_CONFIG.db.tableNameRecords, seqConfigForRecords, {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  tableName: _CONFIG.db.tableNameRecords,
  freezeTableName: true
});

const createRecordModelTable = async () => {
  try {
    await ModelCtrForRecordTypes.sync({ force: true }); // TODO:: make it force: false
    console.log('ModelCtrForRecordTypes table created');
  } catch (error) {
    console.error('Error creating record model table:', error);
  }
};

createRecordModelTable();

///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrForRecordTypes };
