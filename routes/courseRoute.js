const express = require("express");
const {
  addCourseValidator,
  getCourseValidator,
  updateCourseValidator,
  deleteCourseValidator,
} = require("../utils/validators/courseValidator");
const {
  addCourse,
  uploadCourseContent,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseControllers");
const { allowedTo, auth } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    allowedTo("admin"),
    uploadCourseContent,
    addCourseValidator,
    addCourse
  )
  .get(getCourseValidator, getCourses);

router
  .route("/:id")
  .get(getCourseValidator, getCourse)
  .put(
    auth,
    allowedTo("admin"),
    uploadCourseContent,
    updateCourseValidator,
    updateCourse
  )
  .delete(auth, allowedTo("admin"), deleteCourseValidator, deleteCourse);

module.exports = router;
