const { Router } = require("express");

const authRouter = require("./auth.routes");
const courseRouter = require("./course.routes");

const router = Router();

router.use("/auth", authRouter);
router.use("/course", courseRouter);

module.exports = router;
