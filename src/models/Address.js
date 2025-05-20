const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
  {
    phone: {
      type: String,
      trim: true,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stateId: {
      type: Number,
      ref: "State",
      required: true,
    },

    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    addressLine: {
      type: String,
      trim: true,
      required: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Address", addressSchema);
