const AssistenteService = require("../../services/assistente");
const { openSession } = require("./session");

function extractBuffers(obj, files = []) {
  if (Array.isArray(obj))
    return obj.map((item, _) => extractBuffers(item, files));

  if (obj && typeof obj === "object") {
    // Caso seja um buffer serializado simples: { data: [ ... ] }
    // if (
    //   obj.data &&
    //   Array.isArray(obj.data) &&
    //   obj.data.every((n) => typeof n === "number")
    // ) {
    //   const buffer = Buffer.from(obj.data);
    //   const fileId = obj._id || `file_${files.length + 1}`;

    //   files.push({ id: fileId, buffer, path: prefix, size: buffer.length });
    //   return `__BUFFER_REPLACED__:${fileId}`;
    // }

    // Caso seja um arquivo no formato { _id, size, buffer: { data: [...] }, ... }
    if (obj.buffer && obj.buffer.data && Array.isArray(obj.buffer.data)) {
      files.push(obj);

      // Retorna o objeto sem o buffer
      const { buffer: _removed, ...rest } = obj;
      return { ...rest };
    }

    // Caso contrário, percorre recursivamente
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = extractBuffers(obj[key], files);
    }
    return newObj;
  }

  return obj;
}

const question = async ({ contexto, assistenteId, questao, openIaKey }) => {
  const assistente = await AssistenteService.buscarAssistentePorId({
    id: assistenteId,
  });

  const arquivosRemovidos = [];
  const jsonSemBuffers = extractBuffers(contexto, arquivosRemovidos);

  const fileMessage = {
    role: "user",
    content: [],
  };

  for (const arquivo of arquivosRemovidos) {
    if (typeof arquivo === "object" && "buffer" in arquivo) {
      if (arquivo?.mimetype.includes("image")) {
        const buffer = Buffer.from(arquivo.buffer.data);

        fileMessage.content.push({
          type: "image_url",
          image_url: {
            url: `data:${arquivo.mimetype};base64,${buffer.toString("base64")}`,
          },
        });
      }

      if (arquivo?.mimetype.includes("pdf")) {
        const buffer = Buffer.from(arquivo.buffer.data);

        fileMessage.content.push({
          type: "file",
          file: {
            filename: arquivo.nomeOriginal,
            file_data: `data:${arquivo.mimetype};base64,${buffer.toString(
              "base64"
            )}`,
          },
        });
      }
    }
  }

  const mensagensIniciais = [
    { role: "system", content: assistente.instrucao },
    { role: "system", content: JSON.stringify(jsonSemBuffers, null, 4) },
    fileMessage,
    { role: "user", content: assistente.mensagemInicial },
    ...(questao ? [{ role: "user", content: questao }] : []),
  ];

  const response = await openSession({
    messages: mensagensIniciais,
    openIaKey,
  });

  return response;
};

module.exports = {
  question,
};
