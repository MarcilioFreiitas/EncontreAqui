/**
 * Cria um objeto de Comércio com os campos necessários.
 * @param {Object} data - Dados parciais para criar o comércio.
 * @returns {Object} Objeto de comércio formatado.
 */
export function createComercio(data) {
  return {
    id: data.id || null,
    titulo: data.titulo || "",
    descricao: data.descricao || "",
    enderecoCompleto: data.enderecoCompleto || "",
    horarioFuncionamento: data.horarioFuncionamento || "",
    telefone: data.telefone || "",
    website: data.website || "",
    tipoEstabelecimento: data.tipoEstabelecimento || "",
    usuarioId: data.usuarioId, // obrigatório; deve ser informado pelo usuário/ou store
    fotos: Array.isArray(data.fotos) ? data.fotos : [],
  };
}
