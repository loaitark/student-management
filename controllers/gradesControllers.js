const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");

//@desc create grades
//@route post /api/v1/grades
//@access protect
exports.addGrades = asyncHandler(async (req, res, next) => {
  const grades = await prisma.grades.create({
    data: {
      courseId: req.body.courseId,
      points: +req.body.points,
      userId: req.body.userId,
    },
  });
  res.status(201).json({ data: grades });
});

//@desc get Grades
//@route get /api/v1/grades
//@access public
exports.getGrades = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const grades = await prisma.grades.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: grades.length, data: grades });
});

//@desc get  specifc grades by id
//@route get /api/v1/grades\:id
//@access public
exports.getGrade = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const grades = await prisma.grades.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!grades) {
    res.status(404).json({ msg: `no grades for this grades id : ${id}` });
  }
  res.status(200).json({ data: grades });
});

//@desc update  specifc grades by id
//@route put /api/v1/grades\:id
//@access privite
exports.updateGrades = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const grades = await prisma.grades.update({
    where: {
      id: parseInt(id),
    },
    data: {
      points: +req.body.points,
      //   userId: req.body.userId,
      //   courseId: req.body.courseId,
    },
  });
  if (!grades) {
    res.status(404).json({ msg: `no grades for this grades id : ${id}` });
  }
  res.status(200).json({ data: grades });
});

//@desc delete  specifc schedule by id
//@route delete /api/v1/schedule\:id
//@access privite
exports.deletesGrade = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const grades = await prisma.grades.delete({
    where: {
      id: parseInt(id),
    },
  });
  if (!grades) {
    res.status(404).json({ msg: `no grades for this grades id : ${id}` });
  }
  res.status(204).send();
});
