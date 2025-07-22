const { Router } = require("express");
const {
  signin,
  studentsignup,
  instructorSignup,
  refreshAccessToken
} = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/signin", signin);
authRouter.post("/signup/student", studentsignup);
authRouter.post("/signup/instructor", instructorSignup);
authRouter.post("/refresh", refreshAccessToken);

module.exports = authRouter;
