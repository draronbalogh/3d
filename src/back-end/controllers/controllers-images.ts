//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/_config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import { ModelCtrForImageTypes } from '../models/model-for-images';
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
        imageId: req.params.imageId
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
    const a = await ModelCtrForImageTypes.create(req.body);
    await res.status(200).json('Record created');
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
    await ModelCtrForImageTypes.update(req.body, {
      where: {
        imageId: req.params.imageId
      }
    });
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
export const delete3dModel = async (req: Request, res: Response) => {
  try {
    await ModelCtrForImageTypes.destroy({
      where: {
        imageId: req.params.imageId
      }
    });
    res.json({
      message: 'ModelCtrForImageTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
