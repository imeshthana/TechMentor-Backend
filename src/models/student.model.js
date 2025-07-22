const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    fullName: {
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
    enrolledCourses: {
      type: [mongoose.Schema.Types.ObjectId],
        ref: "course",
        default: [],
      },
  },
  { timestamps: true }
);

const StudentModel = mongoose.model("students", StudentSchema);

module.exports = StudentModel;
