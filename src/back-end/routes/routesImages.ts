/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { deleteImage, deleteImageOnEditMenuInputChange, updateImages } from '../controllers/controllers-images';
const router = express.Router();
// router.delete('/routesImages/:modelId', deleteImage);
// router.delete('/:modelId', delete3dModel);
router.delete('/:modelId', deleteImage);
router.delete('/:modelId/:joinFromInput', deleteImageOnEditMenuInputChange);
router.patch('/:modelId', updateImages);
export default router;
