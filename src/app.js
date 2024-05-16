const cors = require("cors");
const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/users", userRouter);

module.exports = app;
