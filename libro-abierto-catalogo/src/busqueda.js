/**
 * Búsquedas lineales sobre el catálogo Libro Abierto.
 * Implementadas sin find, filter, indexOf ni includes sobre arreglos.
 */

/**
 * @typedef {Object} Libro
 * @property {string} isbn
 * @property {string} titulo
 * @property {string} autor
 * @property {number} anio
 * @property {number} prestamos
 */

/**
 * Normaliza un texto: elimina espacios sobrantes y pasa a minúsculas.
 * @param {string} texto - Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
function normalizarTexto(texto) {
  return String(texto).trim().toLowerCase();
}

/**
 * Busca el primer libro con título exacto (ignorando mayúsculas y espacios sobrantes).
 * Retorno temprano al encontrar coincidencia.
 * @param {Libro[]} libros - Catálogo de libros.
 * @param {string} titulo - Título a buscar.
 * @returns {{libro: Libro | null, comparaciones: number}} Resultado y comparaciones.
 */
function buscarPorTitulo(libros, titulo) {
  const buscado = normalizarTexto(titulo);
  let comparaciones = 0;

  for (let i = 0; i < libros.length; i++) {
    comparaciones++;
    if (normalizarTexto(libros[i].titulo) === buscado) {
      return { libro: libros[i], comparaciones };
    }
  }

  return { libro: null, comparaciones };
}

/**
 * Busca todos los libros de un autor (recorre siempre el catálogo completo).
 * @param {Libro[]} libros - Catálogo de libros.
 * @param {string} autor - Autor a buscar.
 * @returns {{libros: Libro[], comparaciones: number}} Resultados y comparaciones.
 */
function buscarPorAutor(libros, autor) {
  const buscado = normalizarTexto(autor);
  /** @type {Libro[]} */
  const resultados = [];
  let comparaciones = 0;

  for (let i = 0; i < libros.length; i++) {
    comparaciones++;
    if (normalizarTexto(libros[i].autor) === buscado) {
      resultados.push(libros[i]);
    }
  }

  return { libros: resultados, comparaciones };
}

/**
 * Busca libros cuyo título contiene la palabra indicada.
 * @param {Libro[]} libros - Catálogo de libros.
 * @param {string} palabra - Palabra a buscar dentro del título.
 * @returns {{libros: Libro[], comparaciones: number}} Resultados y comparaciones.
 */
function buscarPorPalabra(libros, palabra) {
  const buscada = normalizarTexto(palabra);
  /** @type {Libro[]} */
  const resultados = [];
  let comparaciones = 0;

  for (let i = 0; i < libros.length; i++) {
    comparaciones++;
    if (normalizarTexto(libros[i].titulo).includes(buscada)) {
      resultados.push(libros[i]);
    }
  }

  return { libros: resultados, comparaciones };
}

module.exports = {
  normalizarTexto,
  buscarPorTitulo,
  buscarPorAutor,
  buscarPorPalabra,
};
