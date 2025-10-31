const { Schema, model } = require("mongoose");

const checkoutItemSchema = new Schema(
  {
    product: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      slug: {
        type: String,
        required: true,
      },

      coverImage: {
        type: String,
        required: true,
      },
    },

    volume: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      type: {
        type: String,
        enum: ["bottle", "decant"],
        required: true,
      },

      size: {
        type: Number,
        required: true,
      },
    },

    quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: false,
    },

    unitPrice: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { _id: false }
);

const checkoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [checkoutItemSchema],

    shippingAddress: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      stateId: { type: Number, required: true },

      cityId: {
        type: Schema.Types.ObjectId,
        ref: "City",
        required: true,
      },

      addressLine: { type: String, required: true },

      postalCode: { type: String, required: true },
    },

    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },

    finalAmount: {
      type: Number,
      min: 0,
      required: true,
    },

    currency: {
      type: String,
      enum: [
        "USD", // United States - Dollar
        "EUR", // European Union - Euro
        "GBP", // United Kingdom - Pound Sterling
        "JPY", // Japan - Yen
        "AUD", // Australia - Dollar
        "CAD", // Canada - Dollar
        "CHF", // Switzerland - Franc
        "CNY", // China - Yuan (Renminbi)
        "INR", // India - Rupee
        "BRL", // Brazil - Real
      ],
      default: "USD",
      required: true,
    },

    payment: {
      method: {
        type: String,
        enum: ["stripe", "paypal"],
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
        required: true,
      },

      paymentSessionId: String,
    },

    discount: {
      code: { type: String },
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

checkoutSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 90000,
    partialFilterExpression: { "payment.status": "pending" },
  }
);
checkoutSchema.index({ userId: 1 });

module.exports = model("Checkout", checkoutSchema);
