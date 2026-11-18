/**
 * Búsqueda binaria (iterativa y recursiva) por ISBN sobre catálogo ordenado.
 * Comparaciones de texto con localeCompare. Punto medio con Math.floor.
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
 * Ordena una copia del catálogo por ISBN usando localeCompare.
 * @param {Libro[]} libros - Catálogo original.
 * @returns {Libro[]} Copia ordenada por ISBN ascendente.
 */
function ordenarPorIsbn(libros) {
  const copia = libros.slice();
  copia.sort((a, b) => a.isbn.localeCompare(b.isbn));
  return copia;
}

/**
 * Búsqueda binaria iterativa por ISBN.
 * @param {Libro[]} librosOrdenados - Catálogo ordenado por ISBN.
 * @param {string} isbn - ISBN a buscar.
 * @returns {{libro: Libro | null, comparaciones: number}} Resultado y comparaciones.
 */
function buscarPorIsbn(librosOrdenados, isbn) {
  let inicio = 0;
  let fin = librosOrdenados.length - 1;
  let comparaciones = 0;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    comparaciones++;
    const cmp = librosOrdenados[medio].isbn.localeCompare(isbn);
    if (cmp === 0) {
      return { libro: librosOrdenados[medio], comparaciones };
    } else if (cmp < 0) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }

  return { libro: null, comparaciones };
}

/**
 * Búsqueda binaria recursiva por ISBN.
 * @param {Libro[]} librosOrdenados - Catálogo ordenado por ISBN.
 * @param {string} isbn - ISBN a buscar.
 * @param {number} inicio - Índice inicial.
 * @param {number} fin - Índice final.
 * @returns {{libro: Libro | null, comparaciones: number}} Resultado y comparaciones.
 */
function buscarPorIsbnRecursivo(librosOrdenados, isbn, inicio, fin) {
  if (inicio > fin) {
    return { libro: null, comparaciones: 0 };
  }

  const medio = Math.floor((inicio + fin) / 2);
  const cmp = librosOrdenados[medio].isbn.localeCompare(isbn);

  if (cmp === 0) {
    return { libro: librosOrdenados[medio], comparaciones: 1 };
  } else if (cmp < 0) {
    const resultado = buscarPorIsbnRecursivo(librosOrdenados, isbn, medio + 1, fin);
    return { libro: resultado.libro, comparaciones: 1 + resultado.comparaciones };
  } else {
    const resultado = buscarPorIsbnRecursivo(librosOrdenados, isbn, inicio, medio - 1);
    return { libro: resultado.libro, comparaciones: 1 + resultado.comparaciones };
  }
}

/**
 * Búsqueda binaria iterativa con traza de pasos (inicio, fin, medio).
 * @param {Libro[]} librosOrdenados - Catálogo ordenado por ISBN.
 * @param {string} isbn - ISBN a buscar.
 * @returns {{libro: Libro | null, comparaciones: number, pasos: {paso:number,inicio:number,fin:number,medio:number,isbnMedio:string,decision:string}[]}}
 */
function buscarPorIsbnConTraza(librosOrdenados, isbn) {
  let inicio = 0;
  let fin = librosOrdenados.length - 1;
  let comparaciones = 0;
  const pasos = [];
  let paso = 1;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    comparaciones++;
    const isbnMedio = librosOrdenados[medio].isbn;
    const cmp = isbnMedio.localeCompare(isbn);
    let decision;
    if (cmp === 0) {
      decision = "encontrado";
      pasos.push({ paso, inicio, fin, medio, isbnMedio, decision });
      return { libro: librosOrdenados[medio], comparaciones, pasos };
    } else if (cmp < 0) {
      decision = "medio < buscado -> inicio = medio + 1";
      pasos.push({ paso, inicio, fin, medio, isbnMedio, decision });
      inicio = medio + 1;
    } else {
      decision = "medio > buscado -> fin = medio - 1";
      pasos.push({ paso, inicio, fin, medio, isbnMedio, decision });
      fin = medio - 1;
    }
    paso++;
  }

  pasos.push({ paso, inicio, fin, medio: -1, isbnMedio: "-", decision: "inicio > fin -> no encontrado" });
  return { libro: null, comparaciones, pasos };
}

/**
 * Búsqueda binaria de la primera ocurrencia de un ISBN (lower bound).
 * @param {Libro[]} librosOrdenados - Catálogo ordenado por ISBN.
 * @param {string} isbn - ISBN a buscar.
 * @returns {{posicion: number, comparaciones: number}} Índice de la primera copia o -1.
 */
function primeraPosicionIsbn(librosOrdenados, isbn) {
  let inicio = 0;
  let fin = librosOrdenados.length - 1;
  let resultado = -1;
  let comparaciones = 0;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    comparaciones++;
    const cmp = librosOrdenados[medio].isbn.localeCompare(isbn);
    if (cmp === 0) {
      resultado = medio;
      fin = medio - 1; // continuar a la izquierda para hallar la primera
    } else if (cmp < 0) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }

  return { posicion: resultado, comparaciones };
}

module.exports = {
  ordenarPorIsbn,
  buscarPorIsbn,
  buscarPorIsbnRecursivo,
  buscarPorIsbnConTraza,
  primeraPosicionIsbn,
};
