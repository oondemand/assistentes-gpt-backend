const GenericError = require("../generic");

class ListaNaoEncontradaError extends GenericError {
  constructor() {
    super("Lista não encontrada!", 404);
  }
}

module.exports = ListaNaoEncontradaError;
