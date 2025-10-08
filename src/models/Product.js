const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const volumeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["bottle", "decant"],
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
      required: function () {
        return this.type === "bottle";
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
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
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    galleryImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    volumes: [volumeSchema],

    ratingsSum: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      min: 0,
      default: 0,
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
  {
    timestamps: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

volumeSchema.virtual("priceAfterDiscount").get(function () {
  const productDiscount = this.parent().discount;

  if (!productDiscount || productDiscount === 0) return this.price;

  const discountAmount = this.price * (productDiscount / 100);

  return Math.round(this.price - discountAmount);
});

productSchema.index({ slug: 1, name: 1 });

productSchema.virtual("averageRating").get(function () {
  if (this.ratingsCount === 0) return 0;

  return parseFloat((this.ratingsSum / this.ratingsCount).toFixed(1));
});

productSchema.pre("validate", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }

  next();
});

module.exports = model("Product", productSchema);
