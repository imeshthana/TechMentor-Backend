const CourseModel = require("../models/course.model");
const UserModel = require("../models/user.model");

const getInstructorCourses = async (req, res, next) => {
  try {
    const instructorId = req.params.id;

    const user = await UserModel.findById(instructorId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const courses = await CourseModel.find({
      instructor_id: instructorId,
      _isDeleted: false,
    });

    const students = await UserModel.find({
      courses: { $exists: true, $ne: [] },
      role: "student",
    }).populate("courses");

    const courseData = courses.map((course) => {
      const enrolledStudents = students
        .filter((student) =>
          student.courses.some((cId) => cId.equals(course._id))
        )
        .map((student) => ({
          id: student._id,
          name: student.fullname,
        }));

      return {
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          content: course.content,
          createdAt: course.createdAt,
        },
        enrolledStudents,
      };
    });

    res.status(200).json({
      status: "success",
      message: "Instructor courses found successfully",
      courses: courseData,
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
  getInstructorCourses,
};
