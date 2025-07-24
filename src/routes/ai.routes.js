const { Router } = require("express");
const { getAIResponse } = require("../controllers/ai.controller");
const authenticateAuth = require("../middleware/auth.middleware");

const aiRouter = Router();

aiRouter.post("/", getAIResponse);

module.exports = aiRouter;
