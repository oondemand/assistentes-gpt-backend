const GenericError = require("../generic");

class ArquivoNaoEncontradoError extends GenericError {
  constructor() {
    super("Arquivo não encontrado!", 404);
  }
}

module.exports = ArquivoNaoEncontradoError;
