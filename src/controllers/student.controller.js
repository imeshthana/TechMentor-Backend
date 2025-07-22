const StudentModel = require("../models/student.model");
const CourseModel = require("../models/course.model");

const getProfile = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await StudentModel.findById(id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Profile found successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        enrolledCourses: user.enrolledCourses,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const getEnrolledCourses = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await StudentModel.findById(id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const enrolledCourses = await Promise.all(
      user.enrolledCourses.map(async (courseId) => {
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
  getProfile,
  getEnrolledCourses,
};
