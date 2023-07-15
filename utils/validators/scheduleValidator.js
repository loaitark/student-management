const { body, check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addScheduleValidator = [
  body("classLevel")
    .notEmpty()
    .withMessage("course level required")
    .isInt({ min: 0, max: 6 })
    .withMessage("Class Level must be between 0 and 4"),
  body("Section")
    .notEmpty()
    .withMessage("Section is required")
    .isInt({ min: 1 })
    .withMessage("Section can't be lower than 1"),
  body("courseId")
    .notEmpty()
    .withMessage("Course id is required")
    .custom(async (val) => {
      const course = await prisma.course.findFirst({
        where: {
          id: val,
        },
      });
      if (!course) {
        throw new Error(`Course not found `);
      }
    }),
  body("duration")
    .notEmpty()
    .withMessage("Course duration is required")
    .isInt({ min: 0, max: 4 })
    .withMessage("Course duration must be between 0 and 4 hours"),
  body("start")
    .notEmpty()
    .withMessage("Course start is required")
    .isInt({ min: 0, max: 24 })
    .withMessage("Course start must be between 0 and 24 hours"),
  body("end")
    .notEmpty()
    .withMessage("Course end is required")
    .isInt({ min: 0, max: 24 })
    .withMessage("Course end must be between 0 and 24 hours"),

  validatorMiddleware,
];

exports.updateScheduleValidator = [
  body("classLevel")
    .notEmpty()
    .withMessage("course level required")
    .isInt({ min: 0, max: 6 })
    .withMessage("Class Level must be between 0 and 4"),
  body("Section")
    .notEmpty()
    .withMessage("Section is required")
    .isInt({ min: 1 })
    .withMessage("Section can't be lower than 1"),
  body("courseId")
    .notEmpty()
    .withMessage("Course id is required")
    .custom(async (val) => {
      const course = await prisma.course.findFirst({
        where: {
          id: val,
        },
      });
      if (!course) {
        throw new Error(`Course not found `);
      }
    }),
  body("duration")
    .notEmpty()
    .withMessage("Course duration is required")
    .isInt({ min: 0, max: 4 })
    .withMessage("Course duration must be between 0 and 4 hours"),
  body("start")
    .notEmpty()
    .withMessage("Course start is required")
    .isInt({ min: 0, max: 24 })
    .withMessage("Course start must be between 0 and 24 hours"),
  body("end")
    .notEmpty()
    .withMessage("Course end is required")
    .isInt({ min: 0, max: 24 })
    .withMessage("Course end must be between 0 and 24 hours"),

  validatorMiddleware,
];

exports.getScheduleValidator = [validatorMiddleware];

exports.deleteScheduleValidator = [validatorMiddleware];
