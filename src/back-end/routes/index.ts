/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { getAllModels3ds, createModels3d, getModels3dById, updateModels3d, deleteModels3d } from '../controllers/controllers-3dmodels';
const router = express.Router();
router.get('/', getAllModels3ds);
router.get('/:modelId', getModels3dById);
router.post('/', createModels3d);
router.patch('/:modelId', updateModels3d);
router.delete('/:modelId', deleteModels3d);

export default router;
