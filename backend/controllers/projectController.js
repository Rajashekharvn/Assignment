const Project = require('../models/projectModel');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    const { projectName, description } = req.body;

    if (!projectName || !description) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const project = await Project.create({
        projectName,
        description,
        createdBy: req.user._id,
    });

    res.status(201).json(project);
};

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    const projects = await Project.find({ createdBy: req.user._id });
    res.json(projects);
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    const { projectName, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        project.projectName = projectName || project.projectName;
        project.description = description || project.description;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Project.deleteOne({ _id: req.params.id });
        res.json({ message: 'Project removed' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
