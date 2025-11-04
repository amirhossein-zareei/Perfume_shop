const paypalSdk = require("@paypal/checkout-server-sdk");

const { convertToSmallestUnit } = require("../../utils/currency");
const { payment, app } = require("../../config/env");

const environment =
  app.nodeEnv === "production"
    ? new paypalSdk.core.LiveEnvironment(
        payment.paypalClientId,
        payment.paypalClientSecret
      )
    : new paypalSdk.core.SandboxEnvironment(
        payment.paypalClientId,
        payment.paypalClientSecret
      );

const paypalClient = new paypalSdk.core.PayPalHttpClient(environment);

const createPaypalSession = async (checkout) => {
  try {
    const request = new paypalSdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: checkout._id.toString(),
          custom_id: checkout.userId.toString(),

          amount: {
            currency_code: checkout.currency,
            value: convertToSmallestUnit(
              checkout.finalPrice,
              checkout.currency
            ).toString(),
          },
        },
      ],
      application_context: {
        return_url: `${app.frontendUrl}/checkout/success`,
        cancel_url: `${app.frontendUrl}/checkout/cancel`,
      },
    });

    const response = await paypalClient.execute(request);
    return {
      sessionId: response.result.id,
      paymentUrl: response.result.links.find((link) => link.rel === "approve")
        .href,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const verifyPaypalPayment = async (orderId) => {
  try {
    const request = new paypalSdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await paypalClient.execute(request);

    return {
      success: response.result.status === "COMPLETED",
      transactionId: response.result.purchase_units[0].payments.captures[0].id,
      checkoutId: response.result.purchase_units[0].reference_id,
      userId: response.result.purchase_units[0].custom_id,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const expirePaypalSession = async (orderId) => {
  try {
    return;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createPaypalSession,
  verifyPaypalPayment,
  expirePaypalSession,
};
