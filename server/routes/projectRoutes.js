import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject, getProjectStats } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getProjectStats);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;