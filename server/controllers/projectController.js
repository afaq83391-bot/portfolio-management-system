import Project from '../models/Project.js';

// Get all projects for logged-in user
export const getProjects = async (req, res, next) => {
  try {
    const { status, featured, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single project
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// Create project
export const createProject = async (req, res, next) => {
  try {
    const { title, description, shortDesc, technologies, githubUrl, liveUrl, status, featured, startDate, endDate, images } = req.body;

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      shortDesc: shortDesc || '',
      technologies: technologies || [],
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      status: status || 'completed',
      featured: featured || false,
      startDate: startDate || null,
      endDate: endDate || null,
      images: images || []
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// Dashboard stats
export const getProjectStats = async (req, res, next) => {
  try {
    const stats = await Project.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          planned: { $sum: { $cond: [{ $eq: ['$status', 'planned'] }, 1, 0] } },
          featured: { $sum: { $cond: ['$featured', 1, 0] } }
        }
      }
    ]);

    res.json(stats[0] || { total: 0, completed: 0, inProgress: 0, planned: 0, featured: 0 });
  } catch (error) {
    next(error);
  }
};