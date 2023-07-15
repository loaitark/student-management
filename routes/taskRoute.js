const express = require("express");
const {
  addTaskValidator,
  updateTaskValidator,
  getTaskValidator,
  deleteTaskValidator,
} = require("../utils/validators/taskValidator");
const {
  addTask,
  getTask,
  getTasks,
  updateTask,
  uploadTaskContent,
  deleteTask,
} = require("../controllers/taskControllers");
const { allowedTo, auth } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, allowedTo("admin"), uploadTaskContent, addTaskValidator, addTask)
  .get(getTaskValidator, getTasks);

router
  .route("/:id")
  .get(getTask)
  .put(
    auth,
    allowedTo("admin"),
    uploadTaskContent,
    updateTaskValidator,
    updateTask
  )
  .delete(auth, allowedTo("admin"), deleteTaskValidator, deleteTask);

module.exports = router;
