const { body, check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addGradesValidator = [
  body("courseId").notEmpty().withMessage("Course id is required"),
  body("points")
    .notEmpty()
    .withMessage("Points is required")
    .isInt({ min: 0 })
    .withMessage("Points can't be lower than 0")
    .custom(async (val, { req }) => {
      const course = await prisma.course.findFirst({
        where: {
          id: req.body.courseId,
        },
      });

      if (!course) {
        throw new Error("Course not found");
      }
      if (val > course.fullMarks) {
        throw new Error("Points can't be higher than the fullMarks");
      }
      return true;
    }),
  body("userId").custom(async (val) => {
    const user = await prisma.user.findFirst({
      where: {
        id: val,
      },
    });
    if (!user) {
      throw new Error(`user not found `);
    }
  }),
  validatorMiddleware,
];

exports.updateGradeValidator = [
  body("courseId").notEmpty().withMessage("Course id is required"),
  body("points")
    .notEmpty()
    .withMessage("Points is required")
    .isInt({ min: 0 })
    .withMessage("Points can't be lower than 0")
    .custom(async (val, { req }) => {
      const course = await prisma.course.findFirst({
        where: {
          id: req.body.courseId,
        },
      });

      if (!course) {
        throw new Error("Course not found");
      }
      if (val > course.fullMarks) {
        throw new Error("Points can't be higher than the fullMarks");
      }
      return true;
    }),
  body("userId").custom(async (val, { req }) => {
    const user = await prisma.user.findFirst({
      where: {
        id: val,
      },
    });

    if (!user) {
      throw new Error(`user not found `);
    }
  }),
  validatorMiddleware,
];

exports.deleteGradeValidator = [validatorMiddleware];
