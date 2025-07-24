const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const getAIResponse = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);

    const response = await openai.responses.create({
      model: "gpt-3.5-turbo",
      input: `A student says: "${prompt}". Based on this, suggest 5 suitable online courses with the organizations that offer them`,
      max_output_tokens: 300,
      temperature: 0.7,
    });

    console.log(response);

    res.status(200).json({
      status: "success",
      recommendations: response.output_text,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occurred",
    });
  }
};

module.exports = {
  getAIResponse,
};
