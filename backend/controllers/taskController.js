const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// @desc    Add a task to a project
// @route   POST /api/tasks
// @access  Private
const addTask = async (req, res) => {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
    });

    res.status(201).json(task);
};

// @desc    Get all tasks for a project (with pagination and filtering)
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasks = async (req, res) => {
    const { projectId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Everyone who is logged in can view tasks? 
    // Requirement says: "Get All Tasks of a Project"
    // Let's check authorization
    if (project.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const query = { projectId };
    if (status) {
        query.status = status;
    }

    const count = await Task.countDocuments(query);
    const tasks = await Task.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    res.json({
        tasks,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
        const project = await Project.findById(task.projectId);
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        const project = await Project.findById(task.projectId);
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Task.deleteOne({ _id: req.params.id });
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

module.exports = { addTask, getTasks, updateTask, deleteTask };
