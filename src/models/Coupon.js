const { Schema, model } = require("mongoose");

const couponSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },

  description: {
    type: String,
    trim: true,
    default: "",
    required: false,
  },

  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },

  discountValue: {
    type: Number,
    min: 0,
    required: true,
  },

  conditionType: {
    type: String,
    enum: ["firstPurchase", "minAmount", "brand", "category", "product"],
    required: true,
  },

  conditionValue: {
    type: Schema.Types.Mixed,
    default: null,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

couponSchema.index({ name: 1 });

module.exports = model("Coupon", couponSchema);
