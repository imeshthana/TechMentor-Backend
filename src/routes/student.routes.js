const { Router } = require("express");
const { getEnrolledCourses } = require("../controllers/student.controller");
const authenticateAuth = require("../middleware/auth.middleware");

const studentRouter = Router();

studentRouter.get("/courses/:id", authenticateAuth, getEnrolledCourses);

module.exports = studentRouter;
