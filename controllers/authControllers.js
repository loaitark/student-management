const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

//@desc signUp
//@route create /api/v1/auth\signUp
//@access public
exports.signUp = asyncHandler(async (req, res, next) => {
  //create user
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
      role: req.body.role,
      phone: req.body.phone,
      // Courses: {
      //   connect: { id: req.body.course },
      // },
    },
  });

  //generate token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(201).json({ data: user, token });
});

exports.logIn = asyncHandler(async (req, res, next) => {
  //find user at db
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(new ApiError("no user for this email", 404));
  }
  //no user fo this
  //check pass
  const checkPass = await bcrypt.compare(req.body.password, user.password);

  if (!checkPass) {
    return next(new ApiError("password incorrect", 404));
  }
  //return user data
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  //genetret jwt
  res.status(200).json({ token, user });
});

exports.auth = asyncHandler(async (req, res, next) => {
  //check valid token
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    return next(
      new ApiError("You are not logged in to access this route", 401)
    );
  }
  const token = authorizationHeader.replace("Bearer ", "");
  if (!token) {
    return next(new ApiError("you are not login to access this route", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //decode jwt token
  //find user with id
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });
  //throw err
  if (!user) {
    return next(new ApiError("no user for this token", 401));
  }

  //save id for this user
  req.user = user;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("This user is not allowed to access this route", 401)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(new ApiError("no user for this email", 404));
  }
  //generate rest code
  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  //hash rest code
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");
  //save rest code
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordRestCode: hashedRestCode,
      passwordRestExp: new Date(Date.now() + 10 * 60 * 1000),
      passwordRestVerified: false,
    },
  });

  const message = `hi ${user.name} \n , your rest code for student mangement email. \n ${restCode}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password rest code",
      message,
    });
  } catch (err) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordRestCode: undefined,
        passwordRestExp: undefined,
        passwordRestVerified: undefined,
      },
    });
    return next(new ApiError("there an error in sending email", 500));
  }

  res.status(200).json({ status: "success" });
});

exports.verifyPassRestCode = asyncHandler(async (req, res, next) => {
  //get user based on rest code
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordRestCode: hashedRestCode,
      passwordRestExp: {
        gt: new Date(),
      },
    },
  });
  if (!user) {
    return next(new ApiError("rest code valid or expr"));
  }
  //rest code valid
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordRestVerified: true,
    },
  });

  res.status(200).json({ status: "success" });
});

//@desc restpass
//@route create /api/v1/auth\restPass
//@access public
exports.restPassword = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(new ApiError("no user for this email", 404));
  }
  if (!user.passwordRestVerified) {
    return next(new ApiError("your rest code not verified", 400));
  }
  //update user password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: await bcrypt.hash(req.body.password, 8),
      passwordRestCode: null,
      passwordRestExp: null,
      passwordRestVerified: null,
    },
  });

  //create token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({ token });
});
