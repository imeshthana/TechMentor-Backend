const { Router } = require("express");
const { getInstructorCourses  } = require("../controllers/instructor.controller");
const authenticateAuth = require("../middleware/auth.middleware");

const instructorRouter = Router();

instructorRouter.get("/courses/:id", authenticateAuth, getInstructorCourses);

module.exports = instructorRouter;
