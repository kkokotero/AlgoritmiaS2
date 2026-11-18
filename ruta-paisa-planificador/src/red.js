/**
 * Construcción del grafo no dirigido de la red Ruta Paisa (Semana 4, Día 2).
 * Cada par de estaciones consecutivas de una línea es una conexión.
 * Ejecutar: node src/red.js
 */

const Grafo = require("./Grafo");
const { construirIndiceOriginal } = require("./indice");

/**
 * Definición de líneas: estaciones en orden (códigos).
 * @type {{nombre: string, estaciones: number[]}[]}
 */
const lineas = [
  { nombre: "A", estaciones: [10, 20, 30, 35, 40, 45, 50, 60, 65, 70, 80, 90] },
  { nombre: "B", estaciones: [50, 52, 54, 56, 58, 59] },
  { nombre: "K", estaciones: [30, 25, 27, 29] },
  { nombre: "T", estaciones: [40, 56, 65] },
];

/**
 * Construye el grafo de la red a partir de las líneas.
 * @returns {Grafo}
 */
function construirGrafoRed() {
  const grafo = new Grafo();

  for (const linea of lineas) {
    for (let i = 0; i < linea.estaciones.length; i++) {
      grafo.agregarEstacion(linea.estaciones[i]);
    }
    for (let i = 0; i < linea.estaciones.length - 1; i++) {
      grafo.conectar(linea.estaciones[i], linea.estaciones[i + 1]);
    }
  }

  return grafo;
}

if (require.main === module) {
  const grafo = construirGrafoRed();

  // Reutilización del índice del Día 1 para traducir códigos a nombres
  const indice = construirIndiceOriginal();

  console.log("=== Grafo de la red Ruta Paisa (no dirigido) ===\n");
  console.log(`Número de estaciones (V): ${grafo.numeroEstaciones()}`);
  console.log(`Número de conexiones (E): ${grafo.numeroConexiones()}\n`);

  console.log("-- Estaciones de transbordo (grado > 2) --");
  for (const [codigo, vecinos] of grafo.adyacencia.entries()) {
    if (vecinos.length > 2) {
      const res = indice.buscar(codigo);
      const nombre = res ? res.estacion : String(codigo);
      console.log(`${nombre} (código ${codigo}) - grado ${vecinos.length}, vecinos: [${vecinos.join(", ")}]`);
    }
  }

  console.log("\n-- Lista de adyacencia (código -> vecinos) --");
  for (const [codigo, vecinos] of grafo.adyacencia.entries()) {
    const res = indice.buscar(codigo);
    const nombre = res ? res.estacion : String(codigo);
    console.log(`${codigo} (${nombre}): [${vecinos.join(", ")}]`);
  }
}

module.exports = { Grafo, construirGrafoRed, lineas };
