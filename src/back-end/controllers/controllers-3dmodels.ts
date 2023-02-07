//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/_config';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import ModelControllerTypes from '../models/models-3dmodels';
///////////////////////////////////////////////////////////   ROUTES
/**
 * Get all models 3d
 * @param req Request
 * @param res Response
 */
export const getAllModels3ds = async (req: Request, res: Response) => {
  try {
    const models = await ModelControllerTypes.findAll();
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
    const id = await ModelControllerTypes.findAll({
      limit: 1,
      where: {},
      order: [['createdAt', 'DESC']]
    });

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
    const product = await ModelControllerTypes.findAll({
      where: {
        id: req.params.id
      }
    });
    res.json(product[0]);
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
    const a = await ModelControllerTypes.create(req.body);
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
    await ModelControllerTypes.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json({
      message: 'ModelControllerTypes Updated'
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
    await ModelControllerTypes.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json({
      message: 'ModelControllerTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
