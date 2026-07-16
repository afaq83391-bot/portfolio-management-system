import express from 'express';
import { getSkills, getSkill, createSkill, updateSkill, deleteSkill, getCategories } from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', protect, getCategories);
router.get('/', protect, getSkills);
router.get('/:id', protect, getSkill);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;