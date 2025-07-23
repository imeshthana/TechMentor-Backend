const CourseModel = require("../models/course.model");
const UserModel = require("../models/user.model");

const addCourse = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);

    const course = await CourseModel.findOne({
      name: data.title,
    });

    if (course) {
      console.log("Course already added");
      return res.status(400).json({
        status: "error",
        message: "Course already added",
      });
    }

    const instructor = await UserModel.findById(data.instructor_id);

    if (!instructor) {
      console.log("Instructor not found");
      return res.status(404).json({
        status: "error",
        message: "Instructor not found",
      });
    }

    const newCourse = new CourseModel({
      title: data.title,
      description: data.description,
      instructor_id: data.instructor_id,
      instructor_name: data.instructor_name,
      content: data.content,
    });

    instructor.courses.push(newCourse._id);
    await instructor.save();

    const result = await newCourse.save();

    console.log("Course added successfully");
    console.log(newCourse);

    if (result) {
      return res.status(201).json({
        status: "success",
        message: "Course added successfully",
        courseId: result._id,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const editCourse = async (req, res, next) => {
  try {
    const data = req.body;
    const courseId = req.params.id;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    course.title = data.title || course.title;
    course.description = data.description || course.description;
    course.content = data.content || course.content;

    const updatedCourse = await course.save();

    console.log("Course updated successfully");
    return res.status(200).json({
      status: "success",
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }
    if (course._isDeleted) {
      console.log("Course already deleted");
      return res.status(400).json({
        status: "error",
        message: "Course already deleted",
      });
    }

    course._isDeleted = true;
    await course.save();

    console.log("Course deleted successfully");
    return res.status(200).json({
      status: "success",
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await CourseModel.find();

    const allCourses = await Promise.all(
      courses.map(async (course) => {
        if (course._isDeleted) {
          return;
        }

        const courseDetail = {
          id: course._id,
          title: course.title,
          description: course.description,
          content: course.content,
          instructor_id: course.instructor_id,
          instructor_name: course.instructor_name,
        };

        return courseDetail;
      })
    );

    if (allCourses.length == 0) {
      console.log("Courses not found");
      return res.status(404).json({
        status: "error",
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      status: "success",
      courses: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const getOneCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }
    if (course._isDeleted) {
      console.log("Course is deleted");
      return res.status(400).json({
        status: "error",
        message: "Course is deleted",
      });
    }
    const courseDetail = {
      id: course._id,
      title: course.title,
      description: course.description,
      instructor_id: course.instructor_id,
      instructor_name: course.instructor_name,
      content: course.content,
      isActive: course._isActive,
    };
    console.log("Course found successfully");
    return res.status(200).json({
      status: "success",
      course: courseDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.body.id;

    console.log(userId);

    const course = await CourseModel.findById(courseId);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }
    if (course._isDeleted) {
      console.log("Course is deleted");
      return res.status(400).json({
        status: "error",
        message: "Course is deleted",
      });
    }

    const student = await UserModel.findById(userId).populate(
      "courses"
    );

    if (!student) {
      console.log("Student not found");
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    if (student.courses.includes(courseId)) {
      console.log("Already enrolled in this course");
      return res.status(400).json({
        status: "error",
        message: "Already enrolled in this course",
      });
    }
    student.courses.push(courseId);
    await student.save();
    console.log("Enrolled in course successfully");

    return res.status(200).json({
      status: "success",
      message: `Successfully enrolled in course ${courseId}`,
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
  addCourse,
  editCourse,
  deleteCourse,
  getAllCourses,
  getOneCourse,
  enrollInCourse,
};
