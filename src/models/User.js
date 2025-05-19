const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      minlength: 8,
      select: false,
    },

    authType: {
      type: String,
      enum: ["email", "google"],
      default: "email",
      required: true,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, strict: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    next(err);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (!this._update.password) return next();

    this._update.password = await bcrypt.hash(this._update.password, 12);
  } catch (err) {
    next(err);
  }
});

userSchema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("favorites", {
  ref: "Favorite",
  localField: "_id",
  foreignField: "userId",
});

module.exports = model("User", userSchema);
