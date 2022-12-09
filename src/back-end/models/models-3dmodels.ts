import db from '../../_config/config-database';
import { modelConfigSequalizeDataTypes } from '../../_config/config-controller-data-types';

const ModelControllerTypes = db.define('models', modelConfigSequalizeDataTypes, {
  freezeTableName: true
});

export default ModelControllerTypes;
