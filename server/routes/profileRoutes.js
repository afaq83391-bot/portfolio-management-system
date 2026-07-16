import express from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/', protect, deleteAccount);

export default router;