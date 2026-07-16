import express from 'express';
import { uploadImage, uploadImages, deleteFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/image', protect, uploadImage);
router.post('/images', protect, uploadImages);
router.delete('/', protect, deleteFile);

export default router;