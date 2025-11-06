const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema(
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

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
      required: false,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    items: [orderItemSchema],

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

    totalPrice: {
      type: Number,
      min: 0,
      required: true,
    },

    finalPrice: {
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

      transactionId: {
        type: String,
        required: true,
      },

      paidAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
    },

    discount: {
      code: { type: String },
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

orderSchema.virtual("currentStatus").get(function () {
  const status = this.statusHistory;

  return status[status.length - 1].status;
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "payment.method": 1 });

module.exports = model("Order", orderSchema);
