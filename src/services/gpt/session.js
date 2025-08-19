const client = require("../../config/openAi");

const openSession = async ({ messages, model = "gpt-4.1-mini" }) => {
  const stream = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages,
  });

  return stream?.choices[0].message?.content;
};

module.exports = {
  openSession,
};
