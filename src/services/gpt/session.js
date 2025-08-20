const OpenAI = require("openai");

const openSession = async ({ messages, model = "gpt-4.1-mini", openIaKey }) => {
  const client = new OpenAI({ apiKey: openIaKey });

  const stream = await client.chat.completions.create({
    model,
    temperature: 0,
    messages,
  });

  return stream?.choices[0].message?.content;
};

module.exports = {
  openSession,
};
