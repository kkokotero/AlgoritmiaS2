/**
 * Generador de catálogos de libros para pruebas del motor Libro Abierto.
 */

const PALABRAS_TITULO_1 = [
  "Cien", "La", "El", "Los", "Las", "Memorias", "Sombras", "Historias",
  "Caminos", "Voces", "Noches", "Crónica", "Relatos", "Secretos", "Tiempo",
];
const PALABRAS_TITULO_2 = [
  "de", "del", "y", "en", "sobre", "sin", "bajo", "entre", "para", "hacia",
];
const PALABRAS_TITULO_3 = [
  "soledad", "montaña", "río", "fuego", "viento", "silencio", "esperanza",
  "olvido", "ciudad", "tierra", "mar", "luz", "invierno", "verano", "sueños",
];

const NOMBRES = [
  "Gabriel", "Laura", "Mario", "Jorge", "Héctor", "Evelio", "Manuel", "José",
  "Ana", "María", "Carlos", "Luis", "Sofía", "Andrés", "Valeria", "Pedro",
];
const APELLIDOS = [
  "García Márquez", "Restrepo", "Mendoza", "Franco", "Abad Faciolince",
  "Rosero", "Mejía Vallejo", "Rivera", "Pardo", "López", "Ramírez", "Torres",
  "Vargas", "Castro", "Moreno", "Rojas",
];

/**
 * Devuelve un entero aleatorio en el rango [min, max] (inclusive).
 * @param {number} min - Valor mínimo.
 * @param {number} max - Valor máximo.
 * @returns {number} Entero aleatorio.
 */
function aleatorioEntero(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera un ISBN de 13 dígitos como cadena de texto.
 * @returns {string} ISBN de 13 caracteres numéricos.
 */
function generarIsbn() {
  const numero = Math.floor(Math.random() * 1e13);
  return String(numero).padStart(13, "0");
}

/**
 * Genera un título combinando palabras de listas predefinidas.
 * @returns {string} Título generado.
 */
function generarTitulo() {
  const p1 = PALABRAS_TITULO_1[aleatorioEntero(0, PALABRAS_TITULO_1.length - 1)];
  const p2 = PALABRAS_TITULO_2[aleatorioEntero(0, PALABRAS_TITULO_2.length - 1)];
  const p3 = PALABRAS_TITULO_3[aleatorioEntero(0, PALABRAS_TITULO_3.length - 1)];
  return `${p1} ${p2} ${p3}`;
}

/**
 * Genera un nombre de autor combinando nombre y apellido.
 * @returns {string} Autor generado.
 */
function generarAutor() {
  const nombre = NOMBRES[aleatorioEntero(0, NOMBRES.length - 1)];
  const apellido = APELLIDOS[aleatorioEntero(0, APELLIDOS.length - 1)];
  return `${nombre} ${apellido}`;
}

/**
 * Genera un catálogo de n libros. Permite insertar copias repetidas del mismo ISBN.
 * @param {number} n - Cantidad total de libros a generar.
 * @param {{copiasRepetidas?: number}} [opciones] - Opciones del generador.
 * @returns {{isbn: string, titulo: string, autor: string, anio: number, prestamos: number}[]} Catálogo generado.
 */
function generarCatalogo(n, opciones) {
  const config = opciones || {};
  const copiasRepetidas = config.copiasRepetidas || 0;
  const cantidadBase = Math.max(0, n - copiasRepetidas);
  /** @type {{isbn: string, titulo: string, autor: string, anio: number, prestamos: number}[]} */
  const catalogo = [];
  const isbnsUsados = new Set();

  while (catalogo.length < cantidadBase) {
    const isbn = generarIsbn();
    if (isbnsUsados.has(isbn)) {
      continue;
    }
    isbnsUsados.add(isbn);
    catalogo.push({
      isbn,
      titulo: generarTitulo(),
      autor: generarAutor(),
      anio: aleatorioEntero(1900, 2026),
      prestamos: aleatorioEntero(0, 500),
    });
  }

  if (copiasRepetidas > 0 && catalogo.length > 0) {
    const original = catalogo[aleatorioEntero(0, catalogo.length - 1)];
    for (let i = 0; i < copiasRepetidas; i++) {
      catalogo.push({
        isbn: original.isbn,
        titulo: original.titulo,
        autor: original.autor,
        anio: original.anio,
        prestamos: aleatorioEntero(0, 500),
      });
    }
  }

  return catalogo;
}

module.exports = { generarCatalogo };
