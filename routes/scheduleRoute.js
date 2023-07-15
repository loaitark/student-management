const express = require("express");

const {
  addScheduleValidator,
  updateScheduleValidator,
  deleteScheduleValidator,
  getScheduleValidator,
} = require("../utils/validators/scheduleValidator");

const {
  addSchedule,
  getSchedule,
  getScheduleS,
  deletesSchedule,
  updateSchedule,
} = require("../controllers/scheduleControllers");
const { allowedTo, auth } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, allowedTo("admin"), addScheduleValidator, addSchedule)
  .get(getScheduleValidator, getScheduleS);

router
  .route("/:id")
  .get(getScheduleValidator, getSchedule)
  .put(auth, allowedTo("admin"), updateScheduleValidator, updateSchedule)
  .delete(auth, allowedTo("admin"), deleteScheduleValidator, deletesSchedule);

module.exports = router;
