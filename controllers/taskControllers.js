const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const { uploadSinglePdf } = require("../middlewares/uploadFilesMiddleware");

// @desc add content
// @route
// @access privite
exports.uploadTaskContent = uploadSinglePdf("content", "taks");

//@desc create task
//@route post /api/v1/Tasks
//@access protect
exports.addTask = asyncHandler(async (req, res, next) => {
  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      description: req.body.description,
      points: parseInt(req.body.points),
      courseId: +req.body.courseId,
    },
  });
  //console.log(task);
  res.status(201).json({ data: task });
});

//@desc create Task
//@route get /api/v1/Task
//@access public
exports.getTasks = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const Task = await prisma.task.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: Task.length, data: Task });
});

//@desc get  specifc task by id
//@route get /api/v1/task\:id
//@access public
exports.getTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!task) {
    res.status(404).json({ msg: `no task for this task id : ${id}` });
  }
  res.status(200).json({ data: task });
});

//@desc update  specifc task by id
//@route put /api/v1/tasks\:id
//@access privite
exports.updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: req.body.title,
      content: req.body.content,
      description: req.body.description,
      points: parseInt(req.body.points),
      courseId: +req.body.courseId,
    },
    // data: {
    //   title: req.body.title,
    //   description: req.body.description,
    //   content: req.body.content,
    //   points: req.body.points,
    //   courseId: +req.body.courseId,
    // },
  });
  if (!task) {
    res.status(404).json({ msg: `no task for this task id : ${id}` });
  }
  res.status(200).json({ data: task });
});

//@desc delete  specifc task by id
//@route delete /api/v1/task\:id
//@access privite
exports.deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  });
  if (!task) {
    res.status(404).json({ msg: `no task for this task id : ${id}` });
  }
  res.status(204).send();
});
