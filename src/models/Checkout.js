const { Schema, model } = require("mongoose");

const checkoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "CheckoutItem",
        required: true,
      },
    ],

    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },

    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 30 * 60 * 1000,
      required: true,
    },
  },
  { timestamps: true }
);

checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
checkoutSchema.index({ userId: 1 });

module.exports = model("Checkout", checkoutSchema);
