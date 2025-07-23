const { Router } = require("express");

const authRouter = require("./auth.routes");
const courseRouter = require("./course.routes");
const studentRouter = require("./student.routes");
const instructorRouter = require("./instructor.routes");

const router = Router();

router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/student", studentRouter);
router.use("/instructor", instructorRouter);

module.exports = router;