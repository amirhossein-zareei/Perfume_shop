const { Schema, model } = require("mongoose");

const couponUsageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  couponId: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },

  usedAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

couponUsageSchema.index({ userId: 1, couponId: 1 }, { unique: true });

module.exports = model("CouponUsage", couponUsageSchema);
