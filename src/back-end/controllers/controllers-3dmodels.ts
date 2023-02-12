//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/_config';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import { ModelCtrFor3dTypes, ModelCtrForImageTypes } from '../models/models-3dmodels';
///////////////////////////////////////////////////////////   ROUTES

/**
 * Get all models 3d
 * @param req Request
 * @param res Response
 */
export const getAllModels3ds = async (req: Request, res: Response) => {
  try {
    const models = await ModelCtrFor3dTypes.findAll();
    res.json(models);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get last model id
 * @param req Request
 * @param res Response
 */
export const getLastModelId = async (req: Request, res: Response) => {
  try {
    const id = await ModelCtrFor3dTypes.findAll({
      limit: 1,
      where: {},
      order: [['createdAt', 'DESC']]
    });
    console.log('id', id);
    res.json(id);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get model 3d by id
 * @param req Request
 * @param res Response
 */
export const getModels3dById = async (req: Request, res: Response) => {
  try {
    const modells = await ModelCtrFor3dTypes.findAll({
      where: {
        id: req.params.id
      }
    });
    res.json(modells[0]);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Create model 3d
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const createModels3d = async (req: Request, res: Response, next: any) => {
  try {
    const a = await ModelCtrFor3dTypes.create(req.body);
    await res.status(200).json('Record created');
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Update model 3d
 * @param req Request
 * @param res Response
 */
export const updateModels3d = async (req: Request, res: Response) => {
  try {
    await ModelCtrFor3dTypes.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json({
      message: 'ModelCtrFor3dTypes Updated'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete model 3d
 * @param req Request
 * @param res Response
 */
export const delete3dModel = async (req: Request, res: Response) => {
  try {
    await ModelCtrFor3dTypes.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json({
      message: 'ModelCtrFor3dTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
