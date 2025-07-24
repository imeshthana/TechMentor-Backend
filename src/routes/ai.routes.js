const { Router } = require("express");
const { getAIResponse } = require("../controllers/ai.controller");

const aiRouter = Router();

aiRouter.post("/", getAIResponse);

module.exports = aiRouter;
