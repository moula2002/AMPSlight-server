const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, category, location, description } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const project = new Project({
      title,
      category,
      location,
      description,
      imageUrl
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, category, location, description, isActive } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (title !== undefined) project.title = title;
    if (category !== undefined) project.category = category;
    if (location !== undefined) project.location = location;
    if (description !== undefined) project.description = description;
    
    if (isActive !== undefined) {
      project.isActive = isActive;
    }

    if (req.file) {
      project.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
};

