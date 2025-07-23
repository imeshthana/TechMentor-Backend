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

courseRouter.post("/", authenticateAuth, addCourse);
courseRouter.put("/:id",authenticateAuth, editCourse);
courseRouter.delete("/:id",authenticateAuth, deleteCourse);
courseRouter.get("/", authenticateAuth, getAllCourses);
courseRouter.get("/:id", authenticateAuth, getOneCourse);
courseRouter.post("/enroll/:id", authenticateAuth, enrollInCourse);

module.exports = courseRouter;
