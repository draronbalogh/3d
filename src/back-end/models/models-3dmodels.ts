//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import db from '../../_config/config-database';
import { modelConfigSequalizeDataTypes } from '../../_config/config-controller-data-types';

///////////////////////////////////////////////////////////   CONTROLLERS
const ModelControllerTypes = db.define('models', modelConfigSequalizeDataTypes, {
  freezeTableName: true
});

export default ModelControllerTypes;
