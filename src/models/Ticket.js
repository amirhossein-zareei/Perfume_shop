const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
  subject: {
    type: String,
    trim: true,
    required: true,
  },

  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      message: {
        type: String,
        trim: true,
        required: true,
      },

      createdAt: {
        type: Date,
        default: Date.now,
        required: false,
      },
    },
  ],

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["open", "pending", "closed"],
    default: "open",
    required: false,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    required: false,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

ticketSchema.index({ userId: 1, status: 1 });

module.exports = model("Ticket", ticketSchema);
