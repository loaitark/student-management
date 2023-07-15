const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  loggedUser,
  changeMypass,
  changeMydata,
  deleteLoggedUserData,
  //uploadUserImage,
} = require("../controllers/userControllers");
const { allowedTo, auth } = require("../controllers/authControllers");

const router = express.Router();

router.get("/getMe", auth, loggedUser);
router.put("/changeMyPass", auth, changeMypass);
router.put("/changeMydata", auth, changeMydata);
router.delete("/deleteMyAcc", auth, deleteLoggedUserData);

router.put(
  "/changePassword/:id",
  auth,
  allowedTo("admin"),
  changeUserPasswordValidator,
  changePassword
);
router
  .route("/")
  .post(auth, allowedTo("admin"), createUserValidator, createUser)
  .get(getUsers);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(auth, allowedTo("admin"), updateUserValidator, updateUser)
  .delete(auth, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
