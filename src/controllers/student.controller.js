const CourseModel = require("../models/course.model");
const UserModel = require("../models/user.model");

const getEnrolledCourses = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await UserModel.findById(id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const enrolledCourses = await Promise.all(
      user.courses.map(async (courseId) => {
        const course = await CourseModel.findById(courseId);
        return course;
      })
    );

    res.status(200).json({
      status: "success",
      message: "Enrolled courses found successfully",
      enrolledCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occurred",
    });
  }
};

module.exports = {
  getEnrolledCourses,
};
