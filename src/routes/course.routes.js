const { Router } = require("express");
const {
  addCourse,
  editCourse,
  deleteCourse,
  getAllCourses,
  getOneCourse,
  enrollInCourse,
} = require("../controllers/course.controller");
const authenticateAuth = require("../middleware/auth.middleware");

const courseRouter = Router();

courseRouter.post("/add", authenticateAuth, addCourse);
courseRouter.put("/edit/:id",authenticateAuth, editCourse);
courseRouter.delete("/delete/:id",authenticateAuth, deleteCourse);
courseRouter.get("/get", getAllCourses);
courseRouter.get("/get/:id", getOneCourse);
courseRouter.post("/enroll/:id", authenticateAuth, enrollInCourse);

module.exports = courseRouter;
