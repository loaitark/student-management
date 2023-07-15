const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCourseValidator = [validatorMiddleware];

exports.addCourseValidator = [
  body("name")
    .notEmpty()
    .withMessage("Course name is required")
    .custom(async (val) => {
      const course = await prisma.course.findFirst({
        where: {
          name: val,
        },
      });
      if (course) {
        throw new Error(`Course already exists`);
      }
    }),
  body("description").notEmpty().withMessage("description is required"),
  body("duration")
    .notEmpty()
    .withMessage("duration is required")
    .isNumeric()
    .withMessage("duration is number"),
  validatorMiddleware,
];

exports.updateCourseValidator = [
  body("duration")
    .notEmpty()
    .withMessage("course duration is required")
    .isNumeric()
    .withMessage("Course duration is num"),
  body("name")
    .notEmpty()
    .withMessage("course name required")
    .custom(async (val) => {
      const course = prisma.course.findUnique({
        where: {
          name: val,
        },
      });
      if (course) {
        throw new Error(`Course already exists`);
      }
    }),
  validatorMiddleware,
];

exports.deleteCourseValidator = [validatorMiddleware];
