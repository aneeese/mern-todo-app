const Task = require("../models/taskModel");

class TaskService {
  async getTasks(userId) {
    const tasks = await Task.find({ user: userId });
    return tasks;
  }

  async createTask(userId, taskData) {
    const { task } = taskData;

    if (!task) {
      throw new Error("Please add a text field");
    }

    const createdTask = await Task.create({
      user: userId,
      task: task,
      completed: false,
    });

    return createdTask;
  }

  async updateTask(userId, taskId, taskData) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.user.equals(userId)) {
      throw new Error("User not authorized");
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
    });

    return updatedTask;
  }

  async deleteTask(userId, taskId) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.user.equals(userId)) {
      throw new Error("User not authorized");
    }

    await Task.deleteOne({ _id: taskId });

    return taskId;
  }
}

module.exports = new TaskService();
