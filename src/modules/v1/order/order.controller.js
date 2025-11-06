const { Order } = require("../../../models");
const { adjustProductStock } = require("../../../services/orderService");
const APIFeatures = require("../../../utils/apiFeatures");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalOrders = await Order.countDocuments({ userId });

    const features = new APIFeatures(Order.find({ userId }), req.query)
      .sort()
      .paginate();

    const orders = await features.query.select(
      "orderNumber finalPrice currency statusHistory currentStatus items createdAt"
    );

    const formattedOrders = orders.map((order) => ({
      orderNumber: order.orderNumber,
      finalPrice: order.finalPrice,
      currency: order.currency,
      itemCount: order.items.length,
      status: order.currentStatus,
      createdAt: order.createdAt,
    }));

    const pagination = generatePaginationData(totalOrders, features);

    return sendSuccess(res, "Orders retrieved.", {
      orders: formattedOrders,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ orderNumber, userId });

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    return sendSuccess(res, "Order retrieved.", { order });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderNumber } = req.params;

    const order = await Order.findOne({ userId, orderNumber });

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    if (order.currentStatus === "cancelled") {
      throw new AppError("This order has already been cancelled.", 400);
    }

    if (order.currentStatus !== "pending") {
      throw new AppError("Only pending orders can be cancelled.", 400);
    }

    await adjustProductStock(order.items, +1);

    order.statusHistory.push({
      status: "cancelled",
      note: "Cancelled by user",
    });

    await order.save();

    sendSuccess(res, "Order cancelled successfully.", { orderNumber });
  } catch (err) {
    next(err);
  }
};

exports.getOrdersForAdmin = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();

    const features = new APIFeatures(Order.find(), req.query).sort().paginate();

    const orders = await features.query.select(
      "orderNumber finalPrice currency statusHistory currentStatus userId shippingAddress.name shippingAddress.phone createdAt"
    );

    const formattedOrders = orders.map((order) => ({
      orderNumber: order.orderNumber,
      finalPrice: order.finalPrice,
      currency: order.currency,
      customerName: order.shippingAddress.name,
      customerPhone: order.shippingAddress.phone,
      status: order.currentStatus,
      createdAt: order.createdAt,
    }));

    const pagination = generatePaginationData(totalOrders, features);

    return sendSuccess(res, "Orders retrieved.", {
      orders: formattedOrders,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderForAdmin = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber })
      .populate("userId", "email")
      .lean();

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    return sendSuccess(res, "Order retrieved.", { order });
  } catch (err) {
    next(err);
  }
};
