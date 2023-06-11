const mongoose = require("mongoose");
const TaskService = require("../services/taskService");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

describe("Task Service", () => {
  // Connect to the test database before running the tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb");
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("getTasks", () => {
    it("should return an empty array when no tasks exist for the user", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Call the getTasks function
      const tasks = await TaskService.getTasks(userId);

      // Check if the returned tasks array is empty
      expect(tasks).toEqual([]);
    });

    it("should return an array of tasks belonging to the user", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Create some tasks for the user
      await Task.create({ user: userId, task: "Task 1", completed: false });
      await Task.create({ user: userId, task: "Task 2", completed: true });

      // Call the getTasks function
      const tasks = await TaskService.getTasks(userId);

      // Check if the returned tasks array contains the created tasks
      expect(tasks.length).toBe(2);
      expect(tasks[0].task).toBe("Task 1");
      expect(tasks[1].task).toBe("Task 2");
    });
  });

  describe("createTask", () => {
    it("should create a new task and return the created task object", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Create a task data object
      const taskData = {
        task: "New Task",
      };

      // Call the createTask function
      const createdTask = await TaskService.createTask(userId, taskData);

      // Check if the returned task object matches the created task data
      expect(createdTask.user.toString()).toBe(userId.toString());
      expect(createdTask.task).toBe(taskData.task);
      expect(createdTask.completed).toBe(false);
    });

    it("should throw an error when the task text field is not provided", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Create a task data object without the task field
      const taskData = {};

      // Call the createTask function and expect it to throw an error
      await expect(TaskService.createTask(userId, taskData)).rejects.toThrow(
        "Please add a text field"
      );
    });
  });

  describe("updateTask", () => {
    it("should update the task and return the updated task object", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Create a task for the user
      const task = await Task.create({
        user: userId,
        task: "Task 1",
        completed: false,
      });

      // Create a task data object with updated fields
      const updatedTaskData = {
        task: "Updated Task",
        completed: true,
      };

      // Call the updateTask function
      const updatedTask = await TaskService.updateTask(
        userId,
        task._id,
        updatedTaskData
      );

      // Check if the returned task object matches the updated task data
      expect(updatedTask.task).toBe(updatedTaskData.task);
      expect(updatedTask.completed).toBe(updatedTaskData.completed);
    });

    it("should throw an error when the task is not found", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Create a task data object with updated fields
      const updatedTaskData = {
        task: "Updated Task",
        completed: true,
        completedAt: new Date(),
      };

      // Call the updateTask function and expect it to throw an error
      await expect(
        TaskService.updateTask(
          userId,
          new mongoose.Types.ObjectId(),
          updatedTaskData
        )
      ).rejects.toThrow("Task not found");
    });

    it("should throw an error when the user is not authorized", async () => {
      // Create two users and get their IDs
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();

      // Create a task for the first user
      const task = await Task.create({
        user: userId1,
        task: "Task 1",
        completed: false,
      });

      // Create a task data object with updated fields
      const updatedTaskData = {
        task: "Updated Task",
        completed: true,
        completedAt: new Date(),
      };

      // Call the updateTask function with the second user's ID and expect it to throw an error
      await expect(
        TaskService.updateTask(userId2, task._id, updatedTaskData)
      ).rejects.toThrow("User not authorized");
    });
  });

  describe("deleteTask", () => {
    it("should delete the task and return the deleted task ID", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Create a task for the user
      const task = await Task.create({
        user: userId,
        task: "Task 1",
        completed: false,
      });

      // Call the deleteTask function
      const deletedTaskId = await TaskService.deleteTask(userId, task._id);

      // Check if the returned task ID matches the deleted task's ID
      expect(deletedTaskId).toBe(task._id);

      // Check if the task is actually deleted from the database
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it("should throw an error when the task is not found", async () => {
      // Create a user and get their ID
      const userId = new mongoose.Types.ObjectId();

      // Call the deleteTask function and expect it to throw an error
      await expect(
        TaskService.deleteTask(userId, new mongoose.Types.ObjectId())
      ).rejects.toThrow("Task not found");
    });

    it("should throw an error when the user is not authorized", async () => {
      // Create two users and get their IDs
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();

      // Create a task for the first user
      const task = await Task.create({
        user: userId1,
        task: "Task 1",
        completed: false,
      });

      // Call the deleteTask function with the second user's ID and expect it to throw an error
      await expect(TaskService.deleteTask(userId2, task._id)).rejects.toThrow(
        "User not authorized"
      );
    });
  });
});
