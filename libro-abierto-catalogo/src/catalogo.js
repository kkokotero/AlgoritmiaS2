/**
 * Catálogo Libro Abierto v0.1: genera 10.000 libros, prepara copia ordenada por ISBN
 * y ofrece consultas por título, autor, palabra e ISBN con reporte.
 * Ejecutar: node src/catalogo.js
 */

const { generarCatalogo } = require("./generador");
const { buscarPorTitulo, buscarPorAutor, buscarPorPalabra } = require("./busqueda");
const { ordenarPorIsbn, buscarPorIsbn, primeraPosicionIsbn } = require("./busquedaBinaria");

/**
 * @typedef {Object} Libro
 * @property {string} isbn
 * @property {string} titulo
 * @property {string} autor
 * @property {number} anio
 * @property {number} prestamos
 */

/**
 * Crea el catálogo y su copia ordenada por ISBN.
 * @param {number} [n=10000] - Número de libros.
 * @param {{copiasRepetidas?: number}} [opciones] - Opciones del generador.
 * @returns {{catalogo: Libro[], catalogoOrdenadoIsbn: Libro[]}}
 */
function crearCatalogo(n, opciones) {
  const total = n === undefined ? 10000 : n;
  const catalogo = generarCatalogo(total, opciones);
  const catalogoOrdenadoIsbn = ordenarPorIsbn(catalogo);
  return { catalogo, catalogoOrdenadoIsbn };
}

/**
 * Cuenta copias consecutivas de un ISBN desde la primera posición.
 * @param {Libro[]} librosOrdenados
 * @param {string} isbn
 * @param {number} posicionInicial
 * @returns {number}
 */
function contarCopiasIsbn(librosOrdenados, isbn, posicionInicial) {
  if (posicionInicial === -1) return 0;
  let cantidad = 0;
  let i = posicionInicial;
  while (i < librosOrdenados.length && librosOrdenados[i].isbn === isbn) {
    cantidad++;
    i++;
  }
  return cantidad;
}

/**
 * Formatea un libro de forma breve.
 * @param {Libro | null | undefined} libro
 * @returns {string}
 */
function formatoLibro(libro) {
  if (!libro) return "null";
  return `[${libro.isbn}] "${libro.titulo}" - ${libro.autor} (${libro.anio})`;
}

/**
 * Imprime una consulta y su resultado.
 * @param {{tipo:string, valor:string, algoritmo:string, comparaciones:number, resultado:string}} c
 */
function imprimirConsulta(c) {
  console.log(`Consulta: ${c.tipo} = "${c.valor}"`);
  console.log(`  Algoritmo: ${c.algoritmo}`);
  console.log(`  Comparaciones: ${c.comparaciones}`);
  console.log(`  Resultado: ${c.resultado}`);
  console.log("");
}

/**
 * Genera y muestra el reporte de consultas de ejemplo.
 * @returns {void}
 */
function ejecutarReporte() {
  // Genera 10.000 libros incluyendo copias repetidas del mismo ISBN
  const { catalogo, catalogoOrdenadoIsbn } = crearCatalogo(10000, { copiasRepetidas: 3 });

  // Identificar un ISBN con copias (las últimas insertadas comparten ISBN con alguna base)
  let isbnConCopias = null;
  for (let i = 1; i < catalogoOrdenadoIsbn.length; i++) {
    if (catalogoOrdenadoIsbn[i].isbn === catalogoOrdenadoIsbn[i - 1].isbn) {
      isbnConCopias = catalogoOrdenadoIsbn[i].isbn;
      break;
    }
  }

  // Seleccionar valores existentes para consultas representativas
  const libroTitulo = catalogo[Math.floor(catalogo.length / 2)];
  const libroAutor = catalogo[100];
  const libroIsbn = catalogo[500];
  const palabra = libroTitulo.titulo.split(" ")[0] || "de";

  console.log("=== Catálogo Libro Abierto v0.1 ===");
  console.log(`Libros generados: ${catalogo.length}`);
  console.log(`Copia ordenada por ISBN: ${catalogoOrdenadoIsbn.length} elementos`);
  console.log(`ISBN con copias repetidas: ${isbnConCopias ? isbnConCopias : "ninguno"}`);
  console.log("\n--- Reporte de consultas de ejemplo ---\n");

  // 1. Búsqueda por título (existente)
  const rTitulo = buscarPorTitulo(catalogo, libroTitulo.titulo);
  imprimirConsulta({
    tipo: "Título (exacto)",
    valor: libroTitulo.titulo,
    algoritmo: "Búsqueda lineal (retorno temprano)",
    comparaciones: rTitulo.comparaciones,
    resultado: formatoLibro(rTitulo.libro),
  });

  // 2. Búsqueda por título (inexistente)
  const rTituloNo = buscarPorTitulo(catalogo, "Título que no existe en el catálogo XYZ");
  imprimirConsulta({
    tipo: "Título (inexistente)",
    valor: "Título que no existe en el catálogo XYZ",
    algoritmo: "Búsqueda lineal (retorno temprano)",
    comparaciones: rTituloNo.comparaciones,
    resultado: formatoLibro(rTituloNo.libro),
  });

  // 3. Búsqueda por autor (puede devolver varios)
  const rAutor = buscarPorAutor(catalogo, libroAutor.autor);
  const muestraAutor = rAutor.libros.slice(0, 2).map(formatoLibro).join(" | ");
  imprimirConsulta({
    tipo: "Autor (todos los libros)",
    valor: libroAutor.autor,
    algoritmo: "Búsqueda lineal (recorrido completo)",
    comparaciones: rAutor.comparaciones,
    resultado: `${rAutor.libros.length} libro(s) encontrado(s)` + (muestraAutor ? ` — ej.: ${muestraAutor}` : ""),
  });

  // 4. Búsqueda por palabra en título
  const rPalabra = buscarPorPalabra(catalogo, palabra);
  const muestraPalabra = rPalabra.libros.slice(0, 2).map(formatoLibro).join(" | ");
  imprimirConsulta({
    tipo: "Palabra en título",
    valor: palabra,
    algoritmo: "Búsqueda lineal (recorrido completo)",
    comparaciones: rPalabra.comparaciones,
    resultado: `${rPalabra.libros.length} libro(s) encontrado(s)` + (muestraPalabra ? ` — ej.: ${muestraPalabra}` : ""),
  });

  // 5. Búsqueda por ISBN (binaria iterativa)
  const rIsbn = buscarPorIsbn(catalogoOrdenadoIsbn, libroIsbn.isbn);
  imprimirConsulta({
    tipo: "ISBN (existente)",
    valor: libroIsbn.isbn,
    algoritmo: "Búsqueda binaria iterativa (catálogo ordenado por ISBN)",
    comparaciones: rIsbn.comparaciones,
    resultado: formatoLibro(rIsbn.libro),
  });

  // 6. Búsqueda por ISBN con copias repetidas (primera ocurrencia)
  if (isbnConCopias) {
    const rPrimera = primeraPosicionIsbn(catalogoOrdenadoIsbn, isbnConCopias);
    const copias = contarCopiasIsbn(catalogoOrdenadoIsbn, isbnConCopias, rPrimera.posicion);
    const libroPrimera = rPrimera.posicion !== -1 ? catalogoOrdenadoIsbn[rPrimera.posicion] : null;
    imprimirConsulta({
      tipo: "ISBN con copias (primera ocurrencia)",
      valor: isbnConCopias,
      algoritmo: "Búsqueda binaria - primera ocurrencia (lower bound) + conteo a la derecha",
      comparaciones: rPrimera.comparaciones,
      resultado: `primera posición = ${rPrimera.posicion}, copias = ${copias}, libro = ${formatoLibro(libroPrimera)}`,
    });

    // Prueba: la búsqueda binaria normal también encuentra una de las copias
    const rBinariaNormal = buscarPorIsbn(catalogoOrdenadoIsbn, isbnConCopias);
    imprimirConsulta({
      tipo: "ISBN con copias (binaria normal)",
      valor: isbnConCopias,
      algoritmo: "Búsqueda binaria iterativa (encuentra una de las copias)",
      comparaciones: rBinariaNormal.comparaciones,
      resultado: rBinariaNormal.libro ? `encontrado en alguna copia: ${formatoLibro(rBinariaNormal.libro)}` : "null",
    });
  }

  // 7. Búsqueda por ISBN inexistente
  const rIsbnNo = buscarPorIsbn(catalogoOrdenadoIsbn, "0000000000000");
  imprimirConsulta({
    tipo: "ISBN (inexistente)",
    valor: "0000000000000",
    algoritmo: "Búsqueda binaria iterativa (catálogo ordenado por ISBN)",
    comparaciones: rIsbnNo.comparaciones,
    resultado: formatoLibro(rIsbnNo.libro),
  });

  console.log("=== Fin del reporte v0.1 ===");
}

if (require.main === module) {
  ejecutarReporte();
}

module.exports = {
  crearCatalogo,
  contarCopiasIsbn,
  ejecutarReporte,
};
