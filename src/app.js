const cors = require("cors");
const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
const workspaceRouter = require("./routes/workspaceRoute");

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/workspaces", workspaceRouter);

module.exports = app;
