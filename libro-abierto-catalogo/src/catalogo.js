/**
 * Catálogo Libro Abierto v1.0: demostración completa del producto.
 * Usa algoritmos propios (Merge Sort, búsqueda binaria) sin sort nativo.
 * Ejecutar: node src/catalogo.js
 */

const { generarCatalogo } = require("./generador");
const { buscarPorTitulo, buscarPorAutor, buscarPorPalabra } = require("./busqueda");
const { ordenarPorIsbn, buscarPorIsbn, primeraPosicionIsbn } = require("./busquedaBinaria");
const { mergeSort } = require("./ordenamiento");
const { porAnio } = require("./comparadores");
const { topPrestados } = require("./topk");
const { ordenarPorTitulo, autocompletar } = require("./autocompletar");

/**
 * @typedef {Object} Libro
 * @property {string} isbn
 * @property {string} titulo
 * @property {string} autor
 * @property {number} anio
 * @property {number} prestamos
 */

/**
 * Crea el catálogo y sus copias ordenadas (ISBN y título) usando Merge Sort.
 * @param {number} [n=10000]
 * @param {{copiasRepetidas?: number}} [opciones]
 * @returns {{catalogo: Libro[], catalogoOrdenadoIsbn: Libro[], catalogoOrdenadoTitulo: Libro[]}}
 */
function crearCatalogo(n, opciones) {
  const total = n === undefined ? 10000 : n;
  const catalogo = generarCatalogo(total, opciones);
  const catalogoOrdenadoIsbn = ordenarPorIsbn(catalogo); // Merge Sort interno
  const catalogoOrdenadoTitulo = ordenarPorTitulo(catalogo); // Merge Sort interno
  return { catalogo, catalogoOrdenadoIsbn, catalogoOrdenadoTitulo };
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
  return `[${libro.isbn}] "${libro.titulo}" - ${libro.autor} (${libro.anio}) | préstamos: ${libro.prestamos}`;
}

/**
 * Imprime una consulta con algoritmo y comparaciones.
 * @param {{tipo:string, valor:string, algoritmo:string, comparaciones:number|string, resultado:string}} c
 */
function imprimirConsulta(c) {
  console.log(`Consulta: ${c.tipo} = "${c.valor}"`);
  console.log(`  Algoritmo: ${c.algoritmo}`);
  console.log(`  Comparaciones: ${c.comparaciones}`);
  console.log(`  Resultado: ${c.resultado}`);
  console.log("");
}

/**
 * Ejecuta la demostración completa del catálogo v1.0.
 * @returns {void}
 */
function ejecutarReporte() {
  const { catalogo, catalogoOrdenadoIsbn, catalogoOrdenadoTitulo } = crearCatalogo(10000, { copiasRepetidas: 3 });

  // ISBN con copias repetidas
  let isbnConCopias = null;
  for (let i = 1; i < catalogoOrdenadoIsbn.length; i++) {
    if (catalogoOrdenadoIsbn[i].isbn === catalogoOrdenadoIsbn[i - 1].isbn) {
      isbnConCopias = catalogoOrdenadoIsbn[i].isbn;
      break;
    }
  }

  // Valores representativos
  const libroTitulo = catalogo[Math.floor(catalogo.length / 2)];
  const libroAutor = catalogo[100];
  const libroIsbn = catalogo[500];
  const palabra = (libroTitulo.titulo.split(" ")[0] || "de");

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        Catálogo Libro Abierto v1.0 — Demostración            ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`Libros generados: ${catalogo.length}`);
  console.log("Copias ordenadas preparadas con Merge Sort propio (sin sort nativo):");
  console.log(`  - Por ISBN: ${catalogoOrdenadoIsbn.length} elementos`);
  console.log(`  - Por título (normalizado): ${catalogoOrdenadoTitulo.length} elementos`);
  console.log(`ISBN con copias repetidas: ${isbnConCopias ? isbnConCopias : "ninguno"}`);
  console.log("");

  console.log("── 1. Consultas por TÍTULO, AUTOR e ISBN ─────────────────────\n");

  // Título
  const rTitulo = buscarPorTitulo(catalogo, libroTitulo.titulo);
  imprimirConsulta({
    tipo: "Título (exacto)",
    valor: libroTitulo.titulo,
    algoritmo: "Búsqueda lineal con retorno temprano (catálogo no ordenado por título)",
    comparaciones: rTitulo.comparaciones,
    resultado: formatoLibro(rTitulo.libro),
  });

  // Autor
  const rAutor = buscarPorAutor(catalogo, libroAutor.autor);
  const muestraAutor = rAutor.libros.slice(0, 2).map(formatoLibro).join(" | ");
  imprimirConsulta({
    tipo: "Autor (todas las coincidencias)",
    valor: libroAutor.autor,
    algoritmo: "Búsqueda lineal, recorrido completo",
    comparaciones: rAutor.comparaciones,
    resultado: `${rAutor.libros.length} libro(s)` + (muestraAutor ? ` — ej.: ${muestraAutor}` : ""),
  });

  // Palabra (consulta complementaria)
  const rPalabra = buscarPorPalabra(catalogo, palabra);
  imprimirConsulta({
    tipo: "Palabra en título",
    valor: palabra,
    algoritmo: "Búsqueda lineal, recorrido completo",
    comparaciones: rPalabra.comparaciones,
    resultado: `${rPalabra.libros.length} libro(s) encontrado(s)`,
  });

  // ISBN existente (búsqueda binaria)
  const rIsbn = buscarPorIsbn(catalogoOrdenadoIsbn, libroIsbn.isbn);
  imprimirConsulta({
    tipo: "ISBN (existente, búsqueda binaria)",
    valor: libroIsbn.isbn,
    algoritmo: "Búsqueda binaria iterativa (catálogo ordenado por ISBN con Merge Sort)",
    comparaciones: rIsbn.comparaciones,
    resultado: formatoLibro(rIsbn.libro),
  });

  // ISBN con copias (primera ocurrencia)
  if (isbnConCopias) {
    const rPrimera = primeraPosicionIsbn(catalogoOrdenadoIsbn, isbnConCopias);
    const copias = contarCopiasIsbn(catalogoOrdenadoIsbn, isbnConCopias, rPrimera.posicion);
    const libroPrimera = rPrimera.posicion !== -1 ? catalogoOrdenadoIsbn[rPrimera.posicion] : null;
    imprimirConsulta({
      tipo: "ISBN con copias (primera ocurrencia)",
      valor: isbnConCopias,
      algoritmo: "Búsqueda binaria lower bound + conteo a la derecha (catálogo ordenado por ISBN)",
      comparaciones: rPrimera.comparaciones,
      resultado: `primera posición = ${rPrimera.posicion}, copias = ${copias}, libro = ${formatoLibro(libroPrimera)}`,
    });
  }

  // ISBN inexistente
  const rIsbnNo = buscarPorIsbn(catalogoOrdenadoIsbn, "0000000000000");
  imprimirConsulta({
    tipo: "ISBN (inexistente)",
    valor: "0000000000000",
    algoritmo: "Búsqueda binaria iterativa (catálogo ordenado por ISBN con Merge Sort)",
    comparaciones: rIsbnNo.comparaciones,
    resultado: formatoLibro(rIsbnNo.libro),
  });

  console.log("── 2. Top 10 de libros más prestados ─────────────────────────\n");
  const ranking = topPrestados(catalogo, 10);
  console.log(`Algoritmo: Merge Sort por préstamos descendente + tomar 10 (O(n log n), comparaciones: ${ranking.comparaciones})`);
  console.log("| # | Préstamos | Año  | Título | Autor |");
  console.log("|---:|---:|---:|---|---|");
  for (let i = 0; i < ranking.resultado.length; i++) {
    const l = ranking.resultado[i];
    console.log(`| ${i + 1} | ${l.prestamos} | ${l.anio} | ${l.titulo} | ${l.autor} |`);
  }
  console.log("");

  console.log("── 3. Autocompletar por prefijo de título (3 ejemplos) ───────\n");
  const prefijoFrecuente = (catalogoOrdenadoTitulo[100].titulo.split(" ")[0] || "la").slice(0, 2);
  const prefijoUnico = catalogoOrdenadoTitulo[200].titulo.slice(0, Math.min(12, catalogoOrdenadoTitulo[200].titulo.length));
  const prefijoInexistente = "zzzzq";

  const ejemplosAuto = [
    { etiqueta: "Prefijo frecuente", prefijo: prefijoFrecuente, max: 5 },
    { etiqueta: "Prefijo específico (pocos/único resultado esperado)", prefijo: prefijoUnico, max: 5 },
    { etiqueta: "Prefijo sin resultados", prefijo: prefijoInexistente, max: 5 },
  ];

  for (const ej of ejemplosAuto) {
    const res = autocompletar(catalogoOrdenadoTitulo, ej.prefijo, ej.max);
    console.log(`${ej.etiqueta}: prefijo="${ej.prefijo}" (max ${ej.max})`);
    console.log(`  Algoritmo: búsqueda binaria de límite inferior (primeraPosicionPrefijo) + recorrido contiguo O(log n + k)`);
    console.log(`  Posición inicial: ${res.posicionInicial}, elementos revisados: ${res.revisados}, sugerencias: ${res.titulos.length}`);
    if (res.titulos.length === 0) {
      console.log("  Resultado: (sin sugerencias)");
    } else {
      for (let i = 0; i < res.titulos.length; i++) {
        console.log(`  - ${res.titulos[i]}`);
      }
    }
    console.log("");
  }

  console.log("── 4. Catálogo de exhibición ordenado por año (Merge Sort) ───\n");
  const exhibicion = mergeSort(catalogo, porAnio).arreglo.slice(0, 10);
  console.log("Algoritmo: Merge Sort por año ascendente (estable, O(n log n)), mostrando primeros 10 para exhibición");
  console.log("| # | Año  | Título | Autor | Préstamos |");
  console.log("|---:|---:|---|---|---:|");
  for (let i = 0; i < exhibicion.length; i++) {
    const l = exhibicion[i];
    console.log(`| ${i + 1} | ${l.anio} | ${l.titulo} | ${l.autor} | ${l.prestamos} |`);
  }
  console.log("");

  console.log("=== Fin de la demostración v1.0 ===");
}

if (require.main === module) {
  ejecutarReporte();
}

module.exports = {
  crearCatalogo,
  contarCopiasIsbn,
  ejecutarReporte,
};
