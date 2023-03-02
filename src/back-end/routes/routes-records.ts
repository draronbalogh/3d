/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { getAllModels3ds, getLastModelId, createModels3d, getModels3dById, updateModels3d, delete3dModel } from '../controllers/controllers-records';
import { createImages } from '../controllers/controllers-images';
import { createVideos } from '../controllers/controllers-videos';
const router = express.Router();
router.get('/', getAllModels3ds);
router.get('/getLastModelId', getLastModelId);
router.get('/:recordId', getModels3dById);
router.post('/createRecord', createModels3d);
router.post('/createImage', createImages);
router.post('/createVideo', createVideos);
router.patch('/:recordId', updateModels3d);
router.delete('/:recordId', delete3dModel);

export default router;
