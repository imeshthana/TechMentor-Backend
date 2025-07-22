const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema(
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

const InstructorModel = mongoose.model("instructors", InstructorSchema);

module.exports = InstructorModel;
