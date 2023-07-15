const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

exports.signUpValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (val) => {
      const user = await prisma.user.findUnique({
        where: {
          email: val,
        },
      });
      if (user) {
        return Promise.reject(new Error("email already use"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password reqired")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charc")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirm  incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required"),
  body("role").default("student"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email"),
  check("password").notEmpty().withMessage("password reqired"),
  validatorMiddleware,
];
