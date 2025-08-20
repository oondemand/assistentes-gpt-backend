const ArquivoNaoEncontradoError = require("../errors/arquivo/arquivoNaoEncontradoError");
const Arquivo = require("../../models/Arquivo");

const obterPorId = async ({ id }) => {
  const arquivo = await Arquivo.findById(id);
  if (!arquivo || !id) throw new ArquivoNaoEncontradoError();
  return arquivo;
};

const criarArquivo = async ({ arquivo }) => {
  return await Arquivo.create({
    buffer: arquivo.buffer,
    mimetype: arquivo.mimetype,
    nome: arquivo.originalname,
    size: arquivo.size,
  });
};

module.exports = {
  obterPorId,
  criarArquivo,
};
