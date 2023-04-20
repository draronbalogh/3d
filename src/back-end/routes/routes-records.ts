/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { getAllRecords, getLastRecordById, createRecords, getRecordsById, updateRecords, deleteRecords } from '../controllers/controller-for-records';
import { createImages } from '../controllers/controller-for-images';
import { createVideos } from '../controllers/controller-for-videos';
import { createModels3d } from '../controllers/controller-for-models3d';
const router = express.Router();
router.get('/', getAllRecords);
router.get('/getLastModelId', getLastRecordById);
router.get('/:recordId', getRecordsById);
router.post('/createRecord', createRecords);
router.post('/createImage', createImages);
router.post('/createVideo', createVideos);
router.post('/createModels3d', createModels3d);
router.patch('/:recordId', updateRecords);
router.delete('/:recordId', deleteRecords);
export default router;
