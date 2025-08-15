const mongoose = require("mongoose");

const aplicativoSchema = new mongoose.Schema({
  url: { type: String },
  icone: { type: String },
  nome: { type: String, required: true },
  appKey: { type: String, unique: true, required: true },
  ambiente: { type: String, enum: ["prod", "homolog", "teste"] },
  usuarios: [
    {
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
      tipoAcesso: String,
    },
  ],
  status: {
    type: String,
    enum: ["ativo", "inativo"],
    default: "ativo",
  },
});

module.exports = mongoose.model("Aplicativo", aplicativoSchema);
