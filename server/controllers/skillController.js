import Skill from '../models/Skill.js';

// Get all skills
export const getSkills = async (req, res, next) => {
  try {
    const { category, sort = 'order' } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;

    const skills = await Skill.find(filter).sort(sort);
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// Get single skill
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

// Create skill
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency, icon, color, order } = req.body;

    const skill = await Skill.create({
      user: req.user._id,
      name,
      category,
      proficiency,
      icon: icon || '',
      color: color || '#f59e0b',
      order: order || 0
    });

    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

// Update skill
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

// Delete skill
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
};

// Get skill categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Skill.distinct('category', {
      user: req.user._id
    });
    res.json(categories.sort());
  } catch (error) {
    next(error);
  }
};