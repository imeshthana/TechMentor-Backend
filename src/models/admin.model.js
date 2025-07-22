const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
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
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("admins", AdminSchema);

module.exports = AdminModel;
