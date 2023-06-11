const asyncHandler = require("express-async-handler");
const taskService = require("../services/taskService");

// @desc    Get tasks
// @route   GET /tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Set task
// @route   POST /tasks
// @access  Private
const setTask = asyncHandler(async (req, res) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update task
// @route   PUT /tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const taskId = await taskService.deleteTask(req.user.id, req.params.id);
    res.status(200).json({ id: taskId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
};
