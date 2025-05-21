const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const brandSchema = new Schema(
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

    logo: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    website: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

brandSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }

  next();
});

brandSchema.index({ slug: 1 }, { unique: true });

module.exports = model("Brand", brandSchema);
