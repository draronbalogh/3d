import express from 'express';

import { getAllModels3ds, createModels3d, getModels3dById, updateModels3d, delete3dModel } from '../controllers/controllers-3dmodels';
const router = express.Router();
router.get('/', getAllModels3ds);
router.get('/:id', getModels3dById);
router.post('/', createModels3d);
router.patch('/:id', updateModels3d);
router.delete('/:id', delete3dModel);

export default router;
