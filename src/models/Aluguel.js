/**
 * Cria um objeto de Aluguel com os campos necessários.
 * @param {Object} data - Dados parciais para criar o aluguel.
 * @returns {Object} Objeto de aluguel formatado.
 */
export function createAluguel(data) {
  return {
    id: data.id || null,
    titulo: data.titulo || "",
    descricao: data.descricao || "",
    enderecoCompleto: data.enderecoCompleto || "",
    valorAluguel: typeof data.valorAluguel === "number" ? data.valorAluguel : 0,
    numeroDeBanheiros:
      typeof data.numeroDeBanheiros === "number" ? data.numeroDeBanheiros : 0,
    numeroDeVagas:
      typeof data.numeroDeVagas === "number" ? data.numeroDeVagas : 0,
    dataDisponibilidade: data.dataDisponibilidade || null, // formato ISO adequado ou objeto Date
    status: data.status || "",
    numeroDeQuartos:
      typeof data.numeroDeQuartos === "number" ? data.numeroDeQuartos : 0,
    areaEmM2: typeof data.areaEmM2 === "number" ? data.areaEmM2 : 0,
    mobiliado: data.mobiliado === true, // garante que o valor seja true ou false
    valorCaucao: typeof data.valorCaucao === "number" ? data.valorCaucao : 0,
    periodoMinimoContrato: data.periodoMinimoContrato || "",
    usuarioId: data.usuarioId, // obrigatório; não atribuímos valor padrão
    fotos: Array.isArray(data.fotos) ? data.fotos : [],
  };
}
