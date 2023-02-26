/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { deleteVideo, deleteVideoOnEditMenuInputChange, updateVideos } from '../controllers/controllers-videos';
const router = express.Router();
// router.delete('/routesVideos/:modelId', deleteVideo);
// router.delete('/:modelId', delete3dModel);
router.delete('/:modelId', deleteVideo);
router.delete('/:modelId/:joinFromInput', deleteVideoOnEditMenuInputChange);
router.patch('/:modelId', updateVideos);
export default router;
