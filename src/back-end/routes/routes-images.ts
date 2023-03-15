/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { deleteImage, deleteImageOnEditMenuInputChange, updateImages } from '../controllers/controller-for-images';
const router = express.Router();
// router.delete('/routesImages/:recordId', deleteImage);
// router.delete('/:recordId', delete3dModel);
router.delete('/:recordId', deleteImage);
router.delete('/:recordId/:joinFromInput', deleteImageOnEditMenuInputChange);
router.patch('/:recordId', updateImages);
export default router;
