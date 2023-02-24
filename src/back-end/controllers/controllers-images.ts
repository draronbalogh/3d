//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import sequelize from 'sequelize';
import { db, ModelCtrForImageTypes } from '../models/model-for-images';
///////////////////////////////////////////////////////////   ROUTES

/**
 * Get all images
 * @param req Request
 * @param res Response
 */
export const getAllImagess = async (req: Request, res: Response) => {
  try {
    const images = await ModelCtrForImageTypes.findAll();
    res.json(images);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get last image imageId
 * @param req Request
 * @param res Response
 */
export const getLastModelId = async (req: Request, res: Response) => {
  try {
    const imageId = await ModelCtrForImageTypes.findAll({
      limit: 1,
      where: {},
      order: [['createdAt', 'DESC']]
    });
    console.log('imageId', imageId);
    res.json(imageId);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get images by imageId
 * @param req Request
 * @param res Response
 */
export const getImagesById = async (req: Request, res: Response) => {
  try {
    const imagels = await ModelCtrForImageTypes.findAll({
      where: {
        joinId: req.params.imageId
      }
    });
    res.json(imagels[0]);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Create images
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const createImages = async (req: Request, res: Response, next: any) => {
  try {
    for (const element of req.body) {
      await ModelCtrForImageTypes.create(element);
    }

    res.status(200).json('Records created successfully');
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
/**
 * Update images
 * @param req Request
 * @param res Response
 */
export const updateImages = async (req: Request, res: Response) => {
  try {
    await db.query('SET sql_safe_updates = 0;');
    await ModelCtrForImageTypes.update(req.body, {
      where: {
        joinId: req.params.imageId
      }
    });
    await db.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrForImageTypes Updated'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete images
 * @param req Request
 * @param res Response
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    await db.query('SET sql_safe_updates = 0;');
    await ModelCtrForImageTypes.destroy({
      where: {
        joinId: req.params.modelId
      }
    });
    await db.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrForImageTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
