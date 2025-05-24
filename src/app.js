const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandlerMidddleware");

const authRouter = require("./modules/v1/auth/auth.routes");

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

//* Routers
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

module.exports = app;
