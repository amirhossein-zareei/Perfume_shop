const { Schema, model } = require("mongoose");

//* State Model
const stateSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
});

//* City Model
const citySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },

  stateId: {
    type: Number,
    ref: "State",
    required: true,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },
});

citySchema.index({ name: 1, stateId: 1 }, { unique: true });
citySchema.index({ name: 1 });
const State = model("State", stateSchema);

const City = model("City", citySchema);

module.exports = {
  State,
  City,
};
