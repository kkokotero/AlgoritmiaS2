/**
 * Índice consultable Ruta Paisa.
 * Consultas y análisis del efecto del orden de inserción.
 */

const { ArbolBusqueda } = require("../estructuras/ArbolBusqueda");

/** @type {[number, string][]} */
const estaciones = [
  [50, "San Antonio"],
  [30, "Caribe"],
  [70, "Poblado"],
  [20, "Bello"],
  [40, "Hospital"],
  [60, "Exposiciones"],
  [80, "Itagüí"],
  [10, "Niquía"],
  [25, "Acevedo"],
  [35, "Universidad"],
  [45, "Parque Berrío"],
  [52, "Cisneros"],
  [56, "Estadio"],
  [65, "Industriales"],
  [90, "La Estrella"],
  [27, "Andalucía"],
  [29, "Santo Domingo"],
  [54, "Suramericana"],
  [58, "Floresta"],
  [59, "San Javier"],
];

/**
 * Construye el índice original insertando en el orden dado.
 * @returns {ArbolBusqueda}
 */
function construirIndiceOriginal() {
  const arbol = new ArbolBusqueda();
  for (const [codigo, nombre] of estaciones) {
    arbol.insertar(codigo, nombre);
  }
  return arbol;
}

/**
 * Obtiene el listado completo de estaciones en orden ascendente de código (inorden).
 * @param {ArbolBusqueda} [indice]
 * @returns {{codigo:number, estacion:string}[]}
 */
function listadoOrdenado(indice) {
  const idx = indice || construirIndiceOriginal();
  /** @type {{codigo:number, estacion:string}[]} */
  const listado = [];
  idx.inorden((n) => listado.push({ codigo: n.codigo, estacion: n.estacion }));
  return listado;
}

/**
 * Consulta estaciones por rango de códigos [desde, hasta].
 * @param {number} desde
 * @param {number} hasta
 * @param {ArbolBusqueda} [indice]
 * @returns {{codigo:number, estacion:string}[]}
 */
function consultaRango(desde, hasta, indice) {
  const idx = indice || construirIndiceOriginal();
  return idx.rango(desde, hasta);
}

/**
 * @param {{codigo:number, estacion:string, comparaciones:number}|null} res
 * @param {number} codigo
 * @returns {string}
 */
function formatoBusqueda(res, codigo) {
  if (res === null) return `buscar(${codigo}) -> null`;
  return `buscar(${codigo}) -> ${res.estacion} (código ${codigo}), comparaciones: ${res.comparaciones}`;
}

function main() {
  console.log("=== Planificador Ruta Paisa — Índice de estaciones ===\n");
  const indice = construirIndiceOriginal();
  console.log(`Índice construido con ${indice.contarNodos()} estaciones (orden de inserción original).\n`);

  console.log("-- Búsquedas por código --");
  const codigosConsulta = [50, 59, 10, 40, 33];
  for (const c of codigosConsulta) {
    console.log(formatoBusqueda(indice.buscar(c), c));
  }
  console.log("");

  const min = indice.minimo();
  const max = indice.maximo();
  console.log("-- Mínimo y máximo (sin recorrer todo el árbol) --");
  console.log(`Mínimo: ${min ? min.estacion : "null"} (código ${min ? min.codigo : "-"})`);
  console.log(`Máximo: ${max ? max.estacion : "null"} (código ${max ? max.codigo : "-"})`);
  console.log("");

  const zonaNorte = indice.rango(10, 30);
  console.log("-- Rango zona norte (códigos 10 a 30), en orden --");
  console.log(zonaNorte.map((e) => `${e.codigo} ${e.estacion}`).join(", "));
  console.log(`Nombres en orden: ${zonaNorte.map((e) => e.estacion).join(", ")}`);
  console.log("");

  const listado = listadoOrdenado(indice);
  console.log("-- Listado completo de estaciones (inorden, 10 a 90) --");
  console.log(listado.map((e) => `${e.codigo} ${e.estacion}`).join(" | "));
  console.log(`Total: ${listado.length} estaciones`);
  console.log("");

  console.log("-- Métricas del índice original --");
  console.log(`Altura (aristas): ${indice.altura()}`);
  console.log(`Hojas: ${indice.contarHojas()}`);
  console.log("");

  console.log("== Efecto del orden de inserción: datos cargados en orden ascendente ==\n");
  const estacionesOrdenadas = estaciones.slice().sort((a, b) => a[0] - b[0]);
  console.log("Orden de inserción ascendente:");
  console.log(estacionesOrdenadas.map((e) => `${e[0]} ${e[1]}`).join(", "));
  const arbolDegenerado = new ArbolBusqueda();
  for (const [codigo, nombre] of estacionesOrdenadas) {
    arbolDegenerado.insertar(codigo, nombre);
  }
  const alturaDeg = arbolDegenerado.altura();
  const busquedaSJ = arbolDegenerado.buscar(59);
  const busquedaLE = arbolDegenerado.buscar(90);
  console.log(`\nAltura del árbol degenerado (aristas): ${alturaDeg}`);
  console.log(`Niveles (uno por estación): ${alturaDeg + 1}`);
  console.log(`Comparaciones buscar(San Javier, 59): ${busquedaSJ ? busquedaSJ.comparaciones : "null"}`);
  console.log(`Comparaciones buscar(La Estrella, 90): ${busquedaLE ? busquedaLE.comparaciones : "null"}`);
  console.log("\nConclusión: al insertar en orden ascendente cada nodo se agrega como hijo derecho,");
  console.log("formando una lista enlazada (árbol degenerado) de n niveles. La búsqueda recorre");
  console.log("hasta n nodos en el peor caso: complejidad O(n), frente a O(log n) en un árbol balanceado.");
}

if (require.main === module) {
  main();
}

module.exports = { construirIndiceOriginal, estaciones, listadoOrdenado, consultaRango };
