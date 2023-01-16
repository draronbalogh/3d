import ModelControllerTypes from '../models/models-3dmodels';
import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
// Option 3: Passing parameters separately (other dialects)
import db from '../../_config/config-database';

export const getAllModels3ds = async (req: Request, res: Response) => {
  try {
    const models = await ModelControllerTypes.findAll();
    res.json(models);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

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

export const createModels3d = async (req: Request, res: Response) => {
  try {
    const a = await ModelControllerTypes.create(req.body);
    res.status(200).json({
      message: 'Success creating a new record'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

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
