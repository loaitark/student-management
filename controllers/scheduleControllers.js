const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");

//@desc create schedule
//@route post /api/v1/schedule
//@access protect
exports.addSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await prisma.schedule.create({
    data: {
      classLevel: +req.body.classLevel,
      duration: +req.body.duration,
      Section: +req.body.Section,
      day: req.body.day,
      start: +req.body.start,
      end: +req.body.end,
      courseId: +req.body.courseId,
    },
  });

  res.status(201).json({ data: schedule });
});

//@desc get schedule
//@route get /api/v1/schedule
//@access public
exports.getScheduleS = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const schedule = await prisma.schedule.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: schedule.length, data: schedule });
});

//@desc get  specifc schedule by id
//@route get /api/v1/users\:id
//@access public
exports.getSchedule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!schedule) {
    res.status(404).json({ msg: `no schedule for this schedule id : ${id}` });
  }
  res.status(200).json({ data: schedule });
});

//@desc update  specifc schedule by id
//@route put /api/v1/course\:id
//@access privite
exports.updateSchedule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const schedule = await prisma.schedule.update({
    where: {
      id: parseInt(id),
    },
    data: {
      classLevel: +req.body.classLevel,
      duration: +req.body.duration,
      Section: +req.body.Section,
      day: req.body.day,
      start: +req.body.start,
      end: +req.body.end,
      courseId: +req.body.courseId,
    },
  });
  if (!schedule) {
    res.status(404).json({ msg: `no schedule for this schedule id : ${id}` });
  }
  res.status(200).json({ data: schedule });
});

//@desc delete  specifc schedule by id
//@route delete /api/v1/schedule\:id
//@access privite
exports.deletesSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const schedule = await prisma.schedule.delete({
    where: {
      id: parseInt(id),
    },
  });
  if (!schedule) {
    res.status(404).json({ msg: `no schedule for this schedule id : ${id}` });
  }
  res.status(204).send();
});
