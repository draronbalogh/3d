//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   CONFIG
import { _CONFIG } from '../../_config/config-general';
///////////////////////////////////////////////////////////   CONTROLLERS
import { Request, Response } from 'express';
import sequelize from 'sequelize';
import { db, ModelCtrForVideoTypes } from '../models/model-for-videos';
///////////////////////////////////////////////////////////   ROUTES

/**
 * Get all videos
 * @param req Request
 * @param res Response
 */
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await ModelCtrForVideoTypes.findAll();
    res.json(videos);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get last video videoId
 * @param req Request
 * @param res Response
 */
export const getLastModelId = async (req: Request, res: Response) => {
  try {
    const videoId = await ModelCtrForVideoTypes.findAll({
      limit: 1,
      where: {},
      order: [['createdAt', 'DESC']]
    });
    console.log('videoId', videoId);
    res.json(videoId);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Get videos by videoId
 * @param req Request
 * @param res Response
 */
export const getVideosById = async (req: Request, res: Response) => {
  try {
    const videols = await ModelCtrForVideoTypes.findAll({
      where: {
        joinId: req.params.videoId
      }
    });
    res.json(videols[0]);
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Create videos
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const createVideos = async (req: Request, res: Response, next: any) => {
  try {
    for (const element of req.body) {
      await ModelCtrForVideoTypes.create(element);
    }

    res.status(200).json('Records created successfully');
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
/**
 * Update videos
 * @param req Request
 * @param res Response
 */
export const updateVideos = async (req: Request, res: Response) => {
  try {
    await db.query('SET sql_safe_updates = 0;');
    await ModelCtrForVideoTypes.update(req.body, {
      where: {
        joinId: req.params.videoId
      }
    });
    await db.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrForVideoTypes Updated'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete videos
 * @param req Request
 * @param res Response
 */
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    await db.query('SET sql_safe_updates = 0;');
    await ModelCtrForVideoTypes.destroy({
      where: {
        joinId: req.params.modelId
      }
    });
    await db.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrForVideoTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};

/**
 * Detete videos
 * @param req Request
 * @param res Response
 */
export const deleteVideoOnEditMenuInputChange = async (req: Request, res: Response) => {
  try {
    await db.query('SET sql_safe_updates = 0;');
    await ModelCtrForVideoTypes.destroy({
      where: {
        joinId: req.params.modelId,
        joinFromInput: req.params.joinFromInput
      }
    });
    await db.query('SET sql_safe_updates = 1;');
    res.json({
      message: 'ModelCtrForVideoTypes Deleted'
    });
  } catch (error: any | unknown) {
    res.json({ message: error.message });
  }
};
