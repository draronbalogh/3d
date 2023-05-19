//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import dbC from '../../_config/config-database';
import { seqConfigForRecords } from '../../_config/config-controller-data-types';
import { _CONFIG } from '../../_config/config-general';

///////////////////////////////////////////////////////////   CONTROLLERS
const ModelCtrForRecordTypes = dbC.define(_CONFIG.db.tableNameRecords, seqConfigForRecords, {
  tableName: _CONFIG.db.tableNameRecords,
  freezeTableName: true
});

const createRecordModelTable = async () => {
  try {
    await ModelCtrForRecordTypes.sync({ force: false }); // TODO:: make it force: false
    console.log('ModelCtrForRecordTypes table created');
  } catch (error) {
    console.error('Error creating record model table:', error);
  }
};

createRecordModelTable();

///////////////////////////////////////////////////////////   EXPORT
export { ModelCtrForRecordTypes };
