const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPEN_IA_SECRET_KEY,
});

module.exports = client;
