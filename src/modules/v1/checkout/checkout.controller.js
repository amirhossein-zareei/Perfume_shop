const { Checkout, Cart, CartItem, Address } = require("../../../models");
const {
  getValidatedCartItems,
  calculateCartTotals,
  getCheckoutReadyItems,
  createItemSnapshot,
} = require("../../../services/cartService");
const { sendSuccess } = require("../../../utils/apiResponse");
const {
  createPaymentSession,
  cancelPaymentSession,
  verifyPayment,
} = require("../../../services/payment/paymentService");
const AppError = require("../../../utils/AppError");

exports.createCheckout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [address, checkoutExists] = await Promise.all([
      Address.findOne({ userId }).lean(),
      Checkout.exists({ userId }),
    ]);

    if (!address) {
      throw new AppError(
        "To continue, Please add a shipping address first.",
        409
      );
    }

    if (checkoutExists) {
      throw new AppError(
        "You already have an active checkout session. Please proceed with it or cancel it.]",
        409
      );
    }

    const { items } = await getValidatedCartItems(userId);

    if (items.length === 0) {
      throw new AppError("Your shopping cart is empty.", 400);
    }

    const checkoutReadyItems = getCheckoutReadyItems(items);

    if (checkoutReadyItems.length === 0) {
      throw new AppError("No available product in your cart to proceed.", 400);
    }

    const checkoutItems = checkoutReadyItems.map((item) =>
      createItemSnapshot(item)
    );

    const { totalPrice, finalPrice } = calculateCartTotals(checkoutReadyItems);

    const checkout = await Checkout.create({
      userId,
      items: checkoutItems,
      shippingAddress: {
        name: req.user.name,
        phone: address.phone,
        stateId: address.stateId,
        cityId: address.cityId,
        addressLine: address.addressLine,
        postalCode: address.postalCode,
      },
      currency: "USD",
      totalPrice,
      finalPrice,
    });

    return sendSuccess(res, "Checkout session created successfully.", {
      checkout: checkout,
      saving: totalPrice - finalPrice,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCheckout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const checkout = await Checkout.findOne({ userId }).lean();

    if (!checkout) {
      throw new AppError("Checkout not found.", 404);
    }

    return sendSuccess(res, "", { checkout });
  } catch (err) {
    next(err);
  }
};

exports.updateCheckout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;
    const checkout = await Checkout.findOne({ userId });

    if (!checkout) {
      throw new AppError("Checkout not found.", 404);
    }

    const address = addressId
      ? await Address.findOne({ _id: addressId, userId }).lean()
      : null;

    if (addressId) {
      if (!address) {
        throw new AppError("Address not found or does not belong to you.", 404);
      }

      checkout.shippingAddress = {
        name: req.user.name,
        phone: address.phone,
        stateId: address.stateId,
        cityId: address.cityId,
        addressLine: address.addressLine,
        postalCode: address.postalCode,
      };
    }

    checkout.currency = req.body.currency || checkout.currency;
    checkout.payment.method = req.body.paymentMethod || checkout.payment.method;

    await checkout.save();

    return sendSuccess(res, "Checkout session updated successfully.", {
      checkout,
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelCheckout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const checkout = await Checkout.findOne({
      userId,
      "payment.status": "pending",
    });

    if (!checkout) {
      throw new AppError("Checkout not found.", 404);
    }

    if (checkout.payment.sessionId) {
      await cancelPaymentSession(
        checkout.payment.method,
        checkout.payment.sessionId
      );
    }

    checkout.payment.status = "cancelled";
    await checkout.save();

    return sendSuccess(res, "Checkout session deleted successfully.");
  } catch (err) {
    next(err);
  }
};

exports.initiatePayment = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const checkout = await Checkout.findOne({
      userId,
      "payment.status": "pending",
    });

    if (!checkout) {
      throw new AppError("No active checkout session found.", 404);
    }

    if (checkout.payment.sessionId) {
      throw new AppError(
        "An active payment link already exists. Complete or cancel it first.",
        409
      );
    }

    const paymentData = await createPaymentSession(checkout);

    checkout.payment.sessionId = paymentData.sessionId;
    await checkout.save();

    return sendSuccess(res, "Payment link generated.", {
      paymentUrl: paymentData.paymentUrl,
    });
  } catch (err) {
    next(err);
  }
};
