const Assistente = require("../../models/Assistente");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const AssistenteNaoEncontradoError = require("../errors/assistente/assistenteNaoEncontrado");
const Aplicativo = require("../../models/Aplicativo");
const { default: mongoose } = require("mongoose");

const criar = async ({ assistente }) => {
  const novoAssistente = new Assistente(assistente);
  await novoAssistente.save();
  return novoAssistente;
};

const atualizar = async ({ id, assistente }) => {
  const assistenteAtualizado = await Assistente.findByIdAndUpdate(
    id,
    assistente,
    {
      new: true,
    }
  );
  if (!assistenteAtualizado) return new AssistenteNaoEncontradoError();
  return assistenteAtualizado;
};

const excluir = async ({ id }) => {
  const assistenteExcluido = await Assistente.findByIdAndUpdate(id, {
    status: "arquivado",
  });
  if (!assistenteExcluido) return new AssistenteNaoEncontradoError();
  return assistenteExcluido;
};

const buscarAssistentePorId = async ({ id }) => {
  const assistente = await Assistente.findById(id);
  if (!assistente || !id) throw new AssistenteNaoEncontradoError();
  return assistente;
};

const listarComPaginacao = async ({
  filtros,
  pageIndex,
  pageSize,
  searchTerm,
  usuario,
}) => {
  const aplicativos = await Aplicativo.find(
    usuario.tipo === "admin"
      ? {}
      : { "usuarios.usuario": new mongoose.Types.ObjectId(usuario._id) }
  );

  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Assistente.schema,
    searchTerm,
    camposBusca: ["modulo", "assistente"],
  });

  const { limite, page, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [assistentes, totalDeAssistentes] = await Promise.all([
    Assistente.find({
      $and: [
        { status: { $ne: "arquivado" }, aplicativo: { $in: aplicativos } },
        ...query,
      ],
    })
      .skip(skip)
      .limit(limite)
      .populate("aplicativo"),
    Assistente.countDocuments({
      $and: [
        { status: { $ne: "arquivado" }, aplicativo: { $in: aplicativos } },
        ...query,
      ],
    }),
  ]);

  return { page, limite, assistentes, totalDeAssistentes };
};

const listarTodosAssistentesAtivos = async ({ usuario }) => {
  const aplicativos = await Aplicativo.find(
    usuario.tipo === "admin"
      ? {}
      : { "usuarios.usuario": new mongoose.Types.ObjectId(usuario._id) }
  );

  return await Assistente.find({
    status: "ativo",
    aplicativo: { $in: aplicativos },
  }).populate("aplicativo");
};

module.exports = {
  criar,
  atualizar,
  excluir,
  buscarAssistentePorId,
  listarComPaginacao,
  listarTodosAssistentesAtivos,
};
