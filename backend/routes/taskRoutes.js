const express = require('express');
const {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, addTask);
router.route('/:projectId').get(protect, getTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
