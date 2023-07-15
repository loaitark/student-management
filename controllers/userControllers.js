const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
// const { uploadSingleImage } = require("../middlewares/uploadImage");

//@desc get  users
//@route post /api/v1/users
//@access public
exports.getUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const user = await prisma.user.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: user.length, data: user });
});

//@desc get  specifc user by id
//@route post /api/v1/users\:id
//@access public
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!user) {
    res.status(404).json({ msg: `no user for this user id : ${id}` });
  }
  res.status(200).json({ data: user });
});

//@desc Create user
//@route post /api/v1/users
//@access privte
exports.createUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
      role: req.body.role,
      phone: req.body.phone,
      Courses: {
        connect: { id: req.body.course },
      },
    },
  });

  res.status(201).json({ data: user });
});

//@desc update  specifc user by id
//@route put /api/v1/users\:id
//@access privite
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    },
  });
  if (!user) {
    res.status(404).json({ msg: `no user for this user id : ${id}` });
  }
  res.status(200).json({ data: user });
});
//@desc changepass user by id
//@route update /api/v1/users\changePass\:id
//@access privite
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      password: await bcrypt.hash(req.body.password, 8),
    },
  });
  if (!user) {
    res.status(404).json({ msg: `no user for this user id : ${id}` });
  }
  res.status(200).json({ data: user });
});

//@desc delete  specifc user by id
//@route delete /api/v1/users\:id
//@access privite
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  if (!user) {
    res.status(404).json({ msg: `no user for this user id : ${id}` });
  }
  res.status(204).send();
});

//@desc change loged user password
//@route create /api/v1/users\changeMyPass
//@access protect
exports.changeMypass = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.user.email,
    },
  });
  //update user password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: await bcrypt.hash(req.body.password, 8),
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({ data: user, token });
});

//@desc change loged user data
//@route create /api/v1/users\changeMyData
//@access protect
exports.changeMydata = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.user.email,
    },
  });
  //update user password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({ data: user, token });
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await prisma.user.delete({ where: { id: req.user.id } });
  res.status(204).json({ status: "success" });
});

exports.loggedUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      Courses: true,
    },
  });
  res.status(200).json({ user });
});
