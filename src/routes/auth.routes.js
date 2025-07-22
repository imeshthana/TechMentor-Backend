const { Router } = require("express");
const { signin, studentsignup, adminsignup  } = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/signin", signin);
authRouter.post("/signup", studentsignup);
authRouter.post("/admin/signup", adminsignup);


module.exports = authRouter;
