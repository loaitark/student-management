const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getTaskValidator = [validatorMiddleware];

exports.addTaskValidator = [
  body("title").notEmpty().withMessage("title name is required"),
  body("courseId")
    .notEmpty()
    .withMessage("Course id is required")
    .withMessage("Please enter a valid id")
    .custom(async (val) => {
      const course = await prisma.course.findFirst({
        where: {
          id: parseInt(val),
        },
      });
      if (!course) {
        res.status(404).json({ msg: `no course for this course id : ${id}` });
      }
    }),
  body("points")
    .notEmpty()
    .withMessage("points is required")
    .isNumeric()
    .withMessage("points is number")
    .isLength({ min: 0 })
    .withMessage("points cant be less than 0"),
  body("description").notEmpty().withMessage("task description is required"),
  validatorMiddleware,
];

exports.updateTaskValidator = [
  body("courseId")
    .optional()
    .custom(async (val) => {
      const course = await prisma.course.findFirst({
        where: {
          id: parseInt(val),
        },
      });
      if (!course) {
        res.status(404).json({ msg: `no course for this course id : ${id}` });
      }
    }),
  body("points")
    .optional()
    .isNumeric()
    .withMessage("points is number")
    .isLength({ min: 0 })
    .withMessage("points cant be less than 0"),
  body("description").optional(),
  validatorMiddleware,
];

exports.deleteTaskValidator = [validatorMiddleware];
