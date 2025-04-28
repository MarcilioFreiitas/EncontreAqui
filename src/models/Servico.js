/**
 * Cria um objeto de Serviço com os campos necessários.
 * @param {Object} data - Dados parciais para criar o serviço.
 * @returns {Object} Objeto de serviço formatado.
 */
export function createServico(data) {
  return {
    id: data.id || null,
    titulo: data.titulo || "",
    descricao: data.descricao || "",
    preco: typeof data.preco === "number" ? data.preco : 0,
    categoria: data.categoria || "",
    localizacao: data.localizacao || "",
    dataCriacao: data.dataCriacao || null,
    dataAtualizacao: data.dataAtualizacao || null,
    areaAtuacao: data.areaAtuacao || "",
    tempoMedioAtendimento:
      typeof data.tempoMedioAtendimento === "number"
        ? data.tempoMedioAtendimento
        : 0,
    necessitaAgendamento: data.necessitaAgendamento === true,
    profissionalResponsavel: data.profissionalResponsavel || "",
    usuarioId: data.usuarioId, // obrigatório
    fotos: Array.isArray(data.fotos) ? data.fotos : [],
  };
}
