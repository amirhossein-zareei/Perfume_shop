const { Order } = require("../../../models");
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
