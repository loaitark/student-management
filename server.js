const express = require("express");
const ApiError = require("./utils/apiError");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");
const taskRoute = require("./routes/taskRoute");
const scheduleRoute = require("./routes/scheduleRoute");
const gradesRoute = require("./routes/gradesRoute");

const globalError = require("./middlewares/errorMiddleware");
const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/schedules", scheduleRoute);
app.use("/api/v1/grades", gradesRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route :${req.originalUrl}`, 400));
});

app.use(globalError);

const server = app.listen(8080, () => {
  console.log("connect..");
});

//handle recjection outside express
process.on("unhandeledRejection", (err) => {
  console.error(`unhandeledRejection Errors :${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`shutting down`);
    process.exit(1);
  });
});
