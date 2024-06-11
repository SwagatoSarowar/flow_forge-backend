const cors = require("cors");
const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
const workspaceRouter = require("./routes/workspaceRoute");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/workspaces", workspaceRouter);

// not found route
app.all("*", function (req, res, next) {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling middleware
app.use(errorController);

module.exports = app;
