import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';

const router = express.Router();

// GET /api/public/portfolio/:userId
router.get('/portfolio/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const [user, projects, skills] = await Promise.all([
      User.findById(userId).select('name title bio location website github linkedin twitter avatar email').lean(),
      Project.find({ user: userId }).sort({ featured: -1, createdAt: -1 }).lean(),
      Skill.find({ user: userId }).sort({ order: 1 }).lean()
    ]);

    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json({ user, projects, skills });
  } catch (error) {
    next(error);
  }
});

export default router;