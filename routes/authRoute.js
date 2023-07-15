const express = require("express");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const {
  logIn,
  forgetPassword,
  signUp,
  verifyPassRestCode,
  restPassword,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/login", loginValidator, logIn);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyPassRestCode", verifyPassRestCode);
router.put("/restPassword", restPassword);

module.exports = router;
