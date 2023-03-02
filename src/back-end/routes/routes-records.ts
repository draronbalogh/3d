/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import { getAllRecords, getLastRecordById, createRecords, getRecordsById, updateRecords, deleteRecords } from '../controllers/controllers-records';
import { createImages } from '../controllers/controllers-images';
import { createVideos } from '../controllers/controllers-videos';
const router = express.Router();
router.get('/', getAllRecords);
router.get('/getLastModelId', getLastRecordById);
router.get('/:recordId', getRecordsById);
router.post('/createRecord', createRecords);
router.post('/createImage', createImages);
router.post('/createVideo', createVideos);
router.patch('/:recordId', updateRecords);
router.delete('/:recordId', deleteRecords);

export default router;
