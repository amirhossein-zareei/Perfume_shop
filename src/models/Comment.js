const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

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

  adminReply: {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
    createdAt: Date,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

module.exports = model("Comment", commentSchema);
