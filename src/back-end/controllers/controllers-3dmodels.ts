import Models3d from '../models/models-3dmodels';
import { Request, Response } from 'express';
export const getAllModels3ds = async (req: Request, res: Response) => {
  try {
    const models = await Models3d.findAll();
    res.json(models);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

export const getModels3dById = async (req: Request, res: Response) => {
  try {
    const product = await Models3d.findAll({
      where: {
        modelId: req.params.modelId
      }
    });
    res.json(product[0]);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

export const createModels3d = async (req: Request, res: Response) => {
  try {
    await Models3d.create(req.body);
    res.json({
      message: 'Models3d Created'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

export const updateModels3d = async (req: Request, res: Response) => {
  try {
    await Models3d.update(req.body, {
      where: {
        modelId: req.params.modelId
      }
    });
    res.json({
      message: 'Models3d Updated'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

export const deleteModels3d = async (req: Request, res: Response) => {
  try {
    await Models3d.destroy({
      where: {
        modelId: req.params.modelId
      }
    });
    res.json({
      message: 'Models3d Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
