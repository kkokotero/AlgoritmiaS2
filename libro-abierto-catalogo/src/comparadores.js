/**
 * Comparadores para ordenar el catálogo Libro Abierto.
 * Comparadores compuestos y utilitarios (incluye invertir).
 */

/**
 * @typedef {Object} LibroMin
 * @property {string} [autor]
 * @property {string} [titulo]
 * @property {number} [anio]
 * @property {number} [prestamos]
 */

/**
 * Compara por autor y, si son iguales, por título.
 * Ignora mayúsculas y tildes (sensitivity: "base").
 * @param {LibroMin} a
 * @param {LibroMin} b
 * @returns {number}
 */
function porAutorYTitulo(a, b) {
  const autorA = a.autor || "";
  const autorB = b.autor || "";
  const cmpAutor = autorA.localeCompare(autorB, "es", { sensitivity: "base" });
  if (cmpAutor !== 0) return cmpAutor;
  const tituloA = a.titulo || "";
  const tituloB = b.titulo || "";
  return tituloA.localeCompare(tituloB, "es", { sensitivity: "base" });
}

/**
 * Compara solo por autor (ignora mayúsculas y tildes).
 * @param {LibroMin} a
 * @param {LibroMin} b
 * @returns {number}
 */
function porAutor(a, b) {
  const autorA = a.autor || "";
  const autorB = b.autor || "";
  return autorA.localeCompare(autorB, "es", { sensitivity: "base" });
}

/**
 * Compara solo por título (ignora mayúsculas y tildes).
 * @param {LibroMin} a
 * @param {LibroMin} b
 * @returns {number}
 */
function porTitulo(a, b) {
  const tituloA = a.titulo || "";
  const tituloB = b.titulo || "";
  return tituloA.localeCompare(tituloB, "es", { sensitivity: "base" });
}

/**
 * Compara por año ascendente.
 * @param {LibroMin} a
 * @param {LibroMin} b
 * @returns {number}
 */
function porAnio(a, b) {
  return (a.anio || 0) - (b.anio || 0);
}

/**
 * Compara por préstamos de más a menos (descendente).
 * @param {LibroMin} a
 * @param {LibroMin} b
 * @returns {number}
 */
function porPrestamosDesc(a, b) {
  return (b.prestamos || 0) - (a.prestamos || 0);
}

/**
 * Recibe un comparador y devuelve el comparador contrario.
 * @template T
 * @param {(a:T,b:T)=>number} comparar
 * @returns {(a:T,b:T)=>number}
 */
function invertir(comparar) {
  return function (a, b) {
    return -comparar(a, b);
  };
}

module.exports = {
  porAutorYTitulo,
  porAutor,
  porTitulo,
  porAnio,
  porPrestamosDesc,
  invertir,
};
