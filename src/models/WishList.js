const { Schema, model } = require("mongoose");

const wishListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

wishListSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = model("WishList", wishListSchema);
