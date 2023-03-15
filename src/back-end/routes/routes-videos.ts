/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { deleteVideo, deleteVideoOnEditMenuInputChange, updateVideos } from '../controllers/controller-for-videos';
const router = express.Router();
// router.delete('/routesVideos/:recordId', deleteVideo);
// router.delete('/:recordId', delete3dModel);
router.delete('/:recordId', deleteVideo);
router.delete('/:recordId/:joinFromInput', deleteVideoOnEditMenuInputChange);
router.patch('/:recordId', updateVideos);
export default router;
