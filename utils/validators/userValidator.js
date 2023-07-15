const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

exports.getUserValidator = [validatorMiddleware];

exports.createUserValidator = [
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
  check("phone")
    .isMobilePhone("ar-EG")
    .optional()
    .withMessage("Please enter a valid egyptian phone number"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!user) {
        throw new Error("no user found");
      }
      //no user fo this
      //check pass
      const checkPass = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!checkPass) {
        throw new Error("incorrect pass");
      }
      //verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirm  incorrect");
      }
    }),
  validatorMiddleware,
];

exports.updateUserValidator = [
  body("email").optional(),
  body("phone")
    .isMobilePhone("ar-EG")
    .optional()
    .withMessage("Please enter a valid egyptian phone number"),
  validatorMiddleware,
];

exports.deleteUserValidator = [validatorMiddleware];
