const { payment, app } = require("../../config/env");
const { convertToSmallestUnit } = require("../../utils/currency");

const stripe = require("stripe")(payment.stripeSecretKey);

const createStripeSession = async (checkout) => {
  try {
    const lowerCurrency = checkout.currency.toLowerCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: checkout.items.map((item) => ({
        price_data: {
          currency: lowerCurrency,
          product_data: {
            name: item.product.name,
            images: item.product.coverImage ? [item.product.coverImage] : [],
          },
          unit_amount: convertToSmallestUnit(item.unitPrice, lowerCurrency),
        },
        quantity: item.quantity,
      })),

      success_url: `${app.frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${app.frontendUrl}/checkout/cancel`,
      client_reference_id: checkout._id.toString(),

      metadata: {
        userId: checkout.userId.toString(),
      },
    });

    return {
      sessionId: session.id,
      paymentUrl: session.url,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const verifyStripePayment = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: session.payment_status,
      transactionId: session.payment_intent,
      checkoutId: session.client_reference_id,
      userId: session.metadata.userId,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const expireStripeSession = async (sessionId) => {
  try {
    await stripe.checkout.session.expire(sessionId);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createStripeSession,
  verifyStripePayment,
  expireStripeSession,
};
