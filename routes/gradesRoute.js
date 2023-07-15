const express = require("express");
const { addGradesValidator } = require("../utils/validators/gradesValidator");
const {
  addGrades,
  getGrades,
  getGrade,
  updateGrades,
  deletesGrade,
} = require("../controllers/gradesControllers");
const { allowedTo, auth } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, allowedTo("admin"), addGradesValidator, addGrades)
  .get(getGrades);

router.route("/:id").get(getGrade).put(updateGrades).delete(deletesGrade);

module.exports = router;
