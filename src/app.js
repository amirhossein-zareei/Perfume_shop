const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(errorHandler)

module.exports = app;
