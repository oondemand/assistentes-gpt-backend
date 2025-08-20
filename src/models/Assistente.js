const mongoose = require("mongoose");

const AssistenteSchema = new mongoose.Schema(
  {
    nome: String,
    modelo: String,
    descricao: String,
    instrucao: String,
    mensagemInicial: String,
    conhecimentos: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ["ativo", "inativo"], default: "ativo" },
    aplicativo: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Assistente = mongoose.model("Assistente", AssistenteSchema);
module.exports = Assistente;
