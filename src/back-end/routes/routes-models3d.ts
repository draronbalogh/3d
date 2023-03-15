/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { deleteModels3d, delete3dOnEditMenuInputChange, updateModels3d } from '../controllers/controller-for-models3d';
const router = express.Router();
// router.delete('/routes3ds/:recordId', delete3d);
// router.delete('/:recordId', delete3dModel);
router.delete('/:recordId', deleteModels3d);
router.delete('/:recordId/:joinFromInput', delete3dOnEditMenuInputChange);
router.patch('/:recordId', updateModels3d);
export default router;
