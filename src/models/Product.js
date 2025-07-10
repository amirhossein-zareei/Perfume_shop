const { Schema, model } = require("mongoose");

const volumeSchema = new Schema(
  {
    size: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    isOriginalPackaging: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    galleryImages: [
      {
        type: String,
      },
    ],

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    volumes: [volumeSchema],

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },

    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      required: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, strict: true }
);

productSchema.index({ slug: 1, isActive: 1 });

module.exports = model("Product", productSchema);
