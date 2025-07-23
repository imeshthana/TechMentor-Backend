const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
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
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
      required: true,
    },
    instructor_name: {
      type: String,
      required: true,
    },
    content: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("course", CourseSchema);

module.exports = CourseModel;
