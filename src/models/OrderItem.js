const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  volumeSize: {
    type: Number,
    required: true,
  },

  isOriginalPackaging: {
    type: Boolean,
    default: false,
    required: false,
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

  totalPrice: {
    type: Number,
    min: 0,
    required: false,
  },
});

module.exports = model("OrderItem", orderItemSchema);
