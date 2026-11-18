/**
 * Búsqueda por prefijo y autocompletar sobre catálogo ordenado por título.
 * Búsqueda binaria de límite inferior (lower bound) + recorrido de coincidencias.
 * Normalización sin distinguir mayúsculas ni tildes.
 */

const { mergeSort } = require("./ordenamiento");

/**
 * Normaliza un texto para comparación por prefijo:
 * minúsculas, sin tildes/diacríticos y sin espacios extremos.
 * @param {string} texto
 * @returns {string}
 */
function normalizarTitulo(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Comparador por título normalizado (sin mayúsculas ni tildes).
 * @param {{titulo:string}} a
 * @param {{titulo:string}} b
 * @returns {number}
 */
function porTituloNormalizado(a, b) {
  const na = normalizarTitulo(a.titulo || "");
  const nb = normalizarTitulo(b.titulo || "");
  if (na < nb) return -1;
  if (na > nb) return 1;
  return 0;
}

/**
 * Devuelve una copia del catálogo ordenada por título (sin distinguir mayúsculas ni tildes)
 * usando Merge Sort.
 * @template {{titulo:string}} T
 * @param {T[]} libros
 * @returns {T[]}
 */
function ordenarPorTitulo(libros) {
  return mergeSort(libros, porTituloNormalizado).arreglo;
}

/**
 * Búsqueda binaria de límite inferior (lower bound):
 * primera posición cuyo título normalizado es mayor o igual que el prefijo normalizado.
 * @param {{titulo:string}[]} librosOrdenadosPorTitulo - Catálogo ordenado por título normalizado.
 * @param {string} prefijo - Prefijo a buscar.
 * @returns {number} Índice de la primera posición >= prefijo (puede ser libros.length).
 */
function primeraPosicionPrefijo(librosOrdenadosPorTitulo, prefijo) {
  const p = normalizarTitulo(prefijo);
  let inicio = 0;
  let fin = librosOrdenadosPorTitulo.length; // intervalo [inicio, fin)

  while (inicio < fin) {
    const medio = Math.floor((inicio + fin) / 2);
    const t = normalizarTitulo(librosOrdenadosPorTitulo[medio].titulo);
    if (t < p) {
      inicio = medio + 1;
    } else {
      fin = medio;
    }
  }

  return inicio;
}

/**
 * Autocompleta títulos que empiezan con el prefijo indicado.
 * Usa búsqueda binaria para ubicar el inicio y recorre solo las coincidencias.
 * @param {{titulo:string}[]} librosOrdenadosPorTitulo - Catálogo ordenado por título normalizado.
 * @param {string} prefijo - Prefijo escrito por el usuario.
 * @param {number} max - Máximo de sugerencias a devolver.
 * @returns {{titulos: string[], posicionInicial: number, revisados: number}} Títulos sugeridos e info.
 */
function autocompletar(librosOrdenadosPorTitulo, prefijo, max) {
  const p = normalizarTitulo(prefijo);
  const limite = Math.max(0, max);
  const inicio = primeraPosicionPrefijo(librosOrdenadosPorTitulo, prefijo);
  /** @type {string[]} */
  const titulos = [];
  let i = inicio;
  let revisados = 0;

  while (i < librosOrdenadosPorTitulo.length && titulos.length < limite) {
    const titulo = librosOrdenadosPorTitulo[i].titulo;
    const tNorm = normalizarTitulo(titulo);
    revisados++;
    if (p === "" || tNorm.startsWith(p)) {
      titulos.push(titulo);
      i++;
    } else {
      // Al estar ordenado, si ya no empieza con el prefijo no habrá más coincidencias
      break;
    }
  }

  return { titulos, posicionInicial: inicio, revisados };
}

module.exports = {
  normalizarTitulo,
  porTituloNormalizado,
  ordenarPorTitulo,
  primeraPosicionPrefijo,
  autocompletar,
};
