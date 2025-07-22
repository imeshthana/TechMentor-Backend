const { Router } = require("express");
const {
  signin,
  studentsignup,
  instructorSignup,
} = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/signin", signin);
authRouter.post("/signup/student", studentsignup);
authRouter.post("/signup/instructor", instructorSignup);


module.exports = authRouter;
