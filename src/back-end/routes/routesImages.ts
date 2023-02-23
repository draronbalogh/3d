/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { getAllModels3ds, getLastModelId, createModels3d, getModels3dById, updateModels3d, delete3dModel } from '../controllers/controllers-3dmodels';
import { createImages, deleteImage } from '../controllers/controllers-images';
const router = express.Router();
router.delete('/routesImages/:modelId', deleteImage);
export default router;
