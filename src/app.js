const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorHandlerMiddleware");
const AppError = require("./utils/AppError");
const authRouter = require("./modules/v1/auth/auth.routes");
const userRouter = require("./modules/v1/user/user.routes");
const brandRouter = require("./modules/v1/brand/brand.routes");
const categoryRouter = require("./modules/v1/category/category.routes");
const addressRouter = require("./modules/v1/address/address.routes.js");
const commentRouter = require("./modules/v1/comment/comment.routes.js");
const productRouter = require("./modules/v1/product/product.routes.js");
const productAdminRouter = require("./modules/v1/product/product.admin.routes.js");
const cartRouter = require("./modules/v1/cart/cart.routes.js");
const checkoutRouter = require("./modules/v1/checkout/checkout.routes.js");
const orderRouter = require("./modules/v1/order/order.routes.js");
// const orderAdminRouter = require("./modules/v1/order/order.admin.routes.js");

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
app.use(cookieParser());

//* Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/admin/products/", productAdminRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin/orders", orderAdminRouter);

//* 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

//* Error Handler
app.use(errorHandler);

module.exports = app;
