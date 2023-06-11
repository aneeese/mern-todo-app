const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/").get(protect, getTasks).post(protect, setTask);
router.route("/:id").delete(protect, deleteTask).put(protect, updateTask);

module.exports = router;