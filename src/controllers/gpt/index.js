const GPTService = require("../../services/gpt");
const Helpers = require("../../utils/helpers");

const question = async (req, res) => {
  const result = await GPTService.question({
    assistenteId: req?.body?.assistenteId,
    contexto: req?.body?.contexto,
    questao: req?.body?.questao,
    openIaKey: req?.body?.openIaKey,
  });

  Helpers.sendResponse({ res, statusCode: 200, result });
};

module.exports = {
  question,
};
