const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    _isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    _isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    syllabus: {
      type: [
        {
          type: String,
          required: true,},
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("course", CourseSchema);

module.exports = CourseModel;
