//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import { ModelCtrForRecordTypes } from '../models/model-for-records';
import { dbC, ModelCtrForImageTypes } from '../models/model-for-images';
///////////////////////////////////////////////////////////   ROUTES

/**
 * Get all Records
 * @param req Request
 * @param res Response
 */
export const getAllRecords = async (req: Request, res: Response) => {
  try {
    const records = await ModelCtrForRecordTypes.findAll();
    res.json(records);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get last model recordId
 * @param req Request
 * @param res Response
 */
export const getLastRecordById = async (req: Request, res: Response) => {
  try {
    const recordId = await ModelCtrForRecordTypes.findAll({
      limit: 1,
      where: {},
      order: [['createdAt', 'DESC']]
    });
    console.log('recordId', recordId);
    res.json(recordId);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get model record by recordId
 * @param req Request
 * @param res Response
 */
export const getRecordsById = async (req: Request, res: Response) => {
  try {
    const modells = await ModelCtrForRecordTypes.findAll({
      where: {
        recordId: req.params.recordId
      }
    });
    res.json(modells[0]);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Create model record
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const createRecords = async (req: Request, res: Response, next: any) => {
  try {
    const a = await ModelCtrForRecordTypes.create(req.body);
    await res.status(200).json('Record created');
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Update model record
 * @param req Request
 * @param res Response
 */
export const updateRecords = async (req: Request, res: Response) => {
  try {
    await ModelCtrForRecordTypes.update(req.body, {
      where: {
        recordId: req.params.recordId
      }
    });
    res.json({
      message: 'ModelCtrForRecordTypes Updated'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete model record
 * @param req Request
 * @param res Response
 */
export const deleteRecords = async (req: Request, res: Response) => {
  try {
    await ModelCtrForRecordTypes.destroy({
      where: {
        recordId: req.params.recordId
      }
    });
    /* await ModelCtrForImageTypes.destroy({
      where: {
        recordId: req.params.recordId
      }
    });*/

    res.json({
      message: 'ModelCtrForRecordTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
