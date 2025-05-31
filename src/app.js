const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorHandlerMiddleware");
const AppError = require("./utils/AppError");
const authRouter = require("./modules/v1/auth/auth.routes");

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
app.use(cookieParser());

//* Routers
app.use("/api/v1/auth", authRouter);

//* 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

//* Error Handler
app.use(errorHandler);

module.exports = app;
