const { Router } = require("express");
const { getProfile , getEnrolledCourses } = require("../controllers/student.controller");
const authenticateAuth = require("../middleware/auth.middleware");

const studentRouter = Router();

studentRouter.get("/profile/:id", authenticateAuth, getProfile);
studentRouter.get("/courses/:id", authenticateAuth, getEnrolledCourses);

module.exports = studentRouter;
