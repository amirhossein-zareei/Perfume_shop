const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema(
  {
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    volumeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

cartItemSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

module.exports = model("CartItem", cartItemSchema);
