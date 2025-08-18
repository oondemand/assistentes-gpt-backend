const client = require("../../config/openAi");

const openSession = async ({ messages, model = "gpt-4o-mini" }) => {
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages,
  });

  return stream?.choices[0].message?.content;
};

module.exports = {
  openSession,
};
