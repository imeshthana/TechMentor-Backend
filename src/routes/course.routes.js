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
courseRouter.put("/edit",authenticateAuth, editCourse);
courseRouter.delete("/delete",authenticateAuth, deleteCourse);
courseRouter.get("/get-all", getAllCourses);
courseRouter.get("/get/:id", getOneCourse);
courseRouter.get("/enroll/:id", authenticateAuth, enrollInCourse);

module.exports = courseRouter;
