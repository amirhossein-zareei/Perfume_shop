const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const categorySchema = new Schema(
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
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      required: false,
    },

    icon: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 }, { unique: true });

categorySchema.pre("validate", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }

  next();
});

module.exports = model("Category", categorySchema);
