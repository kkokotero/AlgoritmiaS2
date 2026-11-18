/**
 * Muestra de referencia del catálogo unificado Libro Abierto (8 libros).
 * El ISBN se almacena como texto para preservar el código de 13 dígitos como identificador.
 */

/**
 * @typedef {Object} Libro
 * @property {string} isbn - Identificador ISBN (13 dígitos) como texto.
 * @property {string} titulo - Título del libro.
 * @property {string} autor - Autor del libro.
 * @property {number} anio - Año de publicación.
 * @property {number} prestamos - Número de préstamos registrados.
 */

/** @type {Libro[]} */
const muestra = [
  { isbn: "9789584295125", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", anio: 1967, prestamos: 412 },
  { isbn: "9789588886121", titulo: "La vorágine", autor: "José Eustasio Rivera", anio: 1924, prestamos: 158 },
  { isbn: "9789584270344", titulo: "El olvido que seremos", autor: "Héctor Abad Faciolince", anio: 2006, prestamos: 367 },
  { isbn: "9789587047462", titulo: "Delirio", autor: "Laura Restrepo", anio: 2004, prestamos: 201 },
  { isbn: "9789584264879", titulo: "Rosario Tijeras", autor: "Jorge Franco", anio: 1999, prestamos: 189 },
  { isbn: "9789588948485", titulo: "Los ejércitos", autor: "Evelio Rosero", anio: 2007, prestamos: 96 },
  { isbn: "9789584276049", titulo: "La casa de las dos palmas", autor: "Manuel Mejía Vallejo", anio: 1988, prestamos: 74 },
  { isbn: "9789587434477", titulo: "Satanás", autor: "Mario Mendoza", anio: 2002, prestamos: 233 },
];

module.exports = muestra;
