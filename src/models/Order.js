const { Schema, model } = require("mongoose");

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "shipped", "delivered"],
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

    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],

    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },

    statusHistory: [statusHistorySchema],

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
orderSchema.index({ paymentMethod: 1 });

module.exports = model("Order", orderSchema);
