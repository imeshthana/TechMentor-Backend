const CourseModel = require("../models/course.model");

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

    const newCourse = new CourseModel({
      title: data.title,
      description: data.description,
      instructors: data.instructors,
      syllabus: data.syllabus
    });

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
        const courseId = data.id;
    
        const course = await CourseModel.findById(courseId);
        if (!course) {
        console.log("Course not found");
        return res.status(404).json({
            status: "error",
            message: "Course not found",
        });
        }
    
        course.title = data.name || course.name;
        course.description = data.description || course.description;
        course.instructor = data.instructor || course.instructor;
        course.syllabus = data.syllabus || course.syllabus;
    
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
        const courseId = req.body.id;
    
        const course = await CourseModel
            .findById(courseId)
            .populate("instructors");
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
          name: course.name,
          description: course.description,
          coursePrice: course.coursePrice,
          isActive: course._isActive,
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
    
        const course = await CourseModel
            .findById(courseId)
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
            instructor: course.instructor,
            syllabus: course.syllabus,
            isActive: course._isActive,
        };
        console.log("Course found successfully");
        return res.status(200).json({
            status: "success",
            course: courseDetail,
        });
    }
    catch (error) {
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
    const userId = req.user.id;

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

    const StudentModel = require("../models/student.model");
    const student = await StudentModel
        .findById(userId)
        .populate("enrolledCourses");

    if (!student) {
        console.log("Student not found");
        return res.status(404).json({
            status: "error",
            message: "Student not found",
        });
    }

    if (student.enrolledCourses.includes(courseId)) {
        console.log("Already enrolled in this course");
        return res.status(400).json({
            status: "error",
            message: "Already enrolled in this course",
        });
    }
    student.enrolledCourses.push(courseId);
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
      message: "Error occurred while enrolling in course",
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
