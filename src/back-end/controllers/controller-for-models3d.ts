//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import sequelize from 'sequelize';
import { dbC, ModelCtrForModels3dTypes } from '../models/model-for-models3d';
///////////////////////////////////////////////////////////   ROUTES

/**
 * Get all models3d
 * @param req Request
 * @param res Response
 */
export const getAllModels3d = async (req: Request, res: Response) => {
  try {
    const models3d = await ModelCtrForModels3dTypes.findAll();
    res.json(models3d);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get last 3d 3dId
 * @param req Request
 * @param res Response
 */
export const getLastModelId = async (req: Request, res: Response) => {
  try {
    const model3dId = await ModelCtrForModels3dTypes.findAll({
      limit: 1,
      where: {},
      order: [['createdAt', 'DESC']]
    });
    res.json(model3dId);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get models3d by 3dId
 * @param req Request
 * @param res Response
 */
export const getModels3dById = async (req: Request, res: Response) => {
  try {
    const model3dls = await ModelCtrForModels3dTypes.findAll({
      where: {
        joinId: req.params.model3dId
      }
    });
    res.json(model3dls[0]);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Create models3d
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const createModels3d = async (req: Request, res: Response, next: any) => {
  try {
    for (const element of req.body) {
      await ModelCtrForModels3dTypes.create(element);
    }

    res.status(200).json('Records created successfully');
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
/**
 * Update models3d
 * @param req Request
 * @param res Response
 */
export const updateModels3d = async (req: Request, res: Response) => {
  try {
    await dbC.query('SET sql_safe_updates = 0;');
    await ModelCtrForModels3dTypes.update(req.body, {
      where: {
        joinId: req.params.model3dId
      }
    });
    await dbC.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrFor3dTypes Updated'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete models3d
 * @param req Request
 * @param res Response
 */
export const deleteModels3d = async (req: Request, res: Response) => {
  try {
    await dbC.query('SET sql_safe_updates = 0;');
    await ModelCtrForModels3dTypes.destroy({
      where: {
        joinId: req.params.recordId
      }
    });
    await dbC.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrFor3dTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete models3d
 * @param req Request
 * @param res Response
 */
export const delete3dOnEditMenuInputChange = async (req: Request, res: Response) => {
  try {
    await dbC.query('SET sql_safe_updates = 0;');
    await ModelCtrForModels3dTypes.destroy({
      where: {
        joinId: req.params.recordId,
        joinFromInput: req.params.joinFromInput
      }
    });
    await dbC.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrFor3dTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
