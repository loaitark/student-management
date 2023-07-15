const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const { uploadSinglePdf } = require("../middlewares/uploadFilesMiddleware");

// @desc add content
// @route
// @access privite
exports.uploadCourseContent = uploadSinglePdf("content", "courses");

//@desc create Course
//@route post /api/v1/courses
//@access protect
exports.addCourse = asyncHandler(async (req, res, next) => {
  const course = await prisma.course.create({
    data: {
      name: req.body.name,
      content: req.body.content,
      description: req.body.description,
      duration: parseInt(req.body.duration),
      assignments: req.body.assignments,
      fullMarks: parseInt(req.body.fullMarks),
    },
  });
  res.status(201).json({ data: course });
});

//@desc create Course
//@route get /api/v1/courses
//@access public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const course = await prisma.course.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: course.length, data: course });
});

//@desc get  specifc course by id
//@route get /api/v1/users\:id
//@access public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await prisma.course.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!course) {
    res.status(404).json({ msg: `no course for this course id : ${id}` });
  }
  res.status(200).json({ data: course });
});

//@desc update  specifc course by id
//@route put /api/v1/course\:id
//@access privite
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await prisma.course.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: req.body.name,
      description: req.body.description,
      content: req.body.content,
      duration: parseInt(req.body.duration),
      assignments: req.body.assignments,
      fullMarks: parseInt(req.body.fullMarks),
    },
  });
  if (!course) {
    res.status(404).json({ msg: `no course for this course id : ${id}` });
  }
  res.status(200).json({ data: course });
});

//@desc delete  specifc course by id
//@route delete /api/v1/course\:id
//@access privite
exports.deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await prisma.course.delete({
    where: {
      id: parseInt(id),
    },
  });
  if (!course) {
    res.status(404).json({ msg: `no course for this course id : ${id}` });
  }
  res.status(204).send();
});
