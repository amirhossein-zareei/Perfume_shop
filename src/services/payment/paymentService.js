const {
  createStripeSession,
  verifyStripePayment,
  expireStripeSession,
} = require("../../services/payment/stripeService");
const {
  createPaypalSession,
  verifyPaypalPayment,
  expirePaypalSession,
} = require("../../services/payment/paypalService");
const AppError = require("../../utils/AppError");

const createPaymentSession = async (checkout) => {
  const { method } = checkout.payment;

  switch (method) {
    case "stripe":
      return await createStripeSession(checkout);

    case "paypal":
      return await createPaypalSession(checkout);

    default:
      throw new AppError("Invalid payment method.", 400);
  }
};

const verifyPayment = async (method, sessionId) => {
  switch (method) {
    case "stripe":
      return await verifyStripePayment(sessionId);

    case "paypal":
      return await verifyPaypalPayment(sessionId);

    default:
      throw new AppError("Invalid payment method.", 400);
  }
};

const cancelPaymentSession = async (method, sessionId) => {
  switch (method) {
    case "stripe":
      return await expireStripeSession(sessionId);

    case "paypal":
      return await expirePaypalSession(sessionId);

    default:
      throw new AppError("Invalid payment method.", 400);
  }
};

module.exports = {
  createPaymentSession,
  verifyPayment,
  cancelPaymentSession,
};
