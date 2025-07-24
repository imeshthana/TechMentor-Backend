const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      required: true,
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "course",
      default: [],
    },
    refresh: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
