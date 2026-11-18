/**
 * Planificador de viajes Ruta Paisa v0.2.
 * Uso: node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]
 * Ejemplo: node src/planificador.js 10 59
 *          node src/planificador.js 10 59 --cerradas 56
 */

const { construirGrafoRed } = require("./red");
const { construirIndiceOriginal } = require("./indice");

/**
 * Parsea los argumentos de la terminal.
 * @param {string[]} argv
 * @returns {{origen: number|null, destino: number|null, cerradas: Set<number>, error: string|null}}
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const cerradas = new Set();
  /** @type {string[]} */
  const posicionales = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--cerradas") {
      const valor = args[i + 1];
      if (valor === undefined) {
        return { origen: null, destino: null, cerradas, error: "Debe indicar los códigos de estaciones cerradas después de --cerradas (ej: --cerradas 56,40)." };
      }
      const partes = valor.split(",");
      for (const p of partes) {
        const n = parseInt(p.trim(), 10);
        if (!Number.isNaN(n)) cerradas.add(n);
      }
      i++;
    } else if (arg.startsWith("--cerradas=")) {
      const valor = arg.substring("--cerradas=".length);
      const partes = valor.split(",");
      for (const p of partes) {
        const n = parseInt(p.trim(), 10);
        if (!Number.isNaN(n)) cerradas.add(n);
      }
    } else {
      posicionales.push(arg);
    }
  }

  if (posicionales.length < 2) {
    return {
      origen: null,
      destino: null,
      cerradas,
      error: "Uso: node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]",
    };
  }

  const origen = parseInt(posicionales[0], 10);
  const destino = parseInt(posicionales[1], 10);
  if (Number.isNaN(origen) || Number.isNaN(destino)) {
    return {
      origen: null,
      destino: null,
      cerradas,
      error: "Los códigos de origen y destino deben ser números válidos. Ejemplo: node src/planificador.js 10 59",
    };
  }

  return { origen, destino, cerradas, error: null };
}

/**
 * Obtiene el nombre de una estación por código usando el índice.
 * @param {number} codigo
 * @param {any} indice
 * @returns {string}
 */
function nombreDe(codigo, indice) {
  const res = indice.buscar(codigo);
  return res ? res.estacion : `Código ${codigo}`;
}

/**
 * Detecta transbordos comparando la línea de cada tramo con la del anterior.
 * @param {number[]} ruta - Camino de códigos.
 * @param {import("./Grafo")} grafo
 * @returns {{en: number, deLinea: string, aLinea: string}[]}
 */
function detectarTransbordos(ruta, grafo) {
  /** @type {{en: number, deLinea: string, aLinea: string}[]} */
  const transbordos = [];
  if (ruta.length < 3) return transbordos;

  let lineaAnterior = grafo.obtenerLineaConexion(ruta[0], ruta[1]);
  for (let i = 1; i < ruta.length - 1; i++) {
    const lineaActual = grafo.obtenerLineaConexion(ruta[i], ruta[i + 1]);
    if (lineaAnterior !== null && lineaActual !== null && lineaAnterior !== lineaActual) {
      transbordos.push({ en: ruta[i], deLinea: lineaAnterior, aLinea: lineaActual });
    }
    lineaAnterior = lineaActual;
  }
  return transbordos;
}

function main() {
  const { origen, destino, cerradas, error } = parseArgs(process.argv);
  if (error) {
    console.log(error);
    process.exitCode = 1;
    return;
  }
  if (origen === null || destino === null) {
    console.log("Uso: node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]");
    process.exitCode = 1;
    return;
  }

  const indice = construirIndiceOriginal();
  const grafo = construirGrafoRed();

  // Validar códigos con buscar del índice
  const resOrigen = indice.buscar(origen);
  const resDestino = indice.buscar(destino);

  if (!resOrigen) {
    console.log(`No se encontró la estación de origen con código ${origen}. Verifique el código e intente de nuevo.`);
    process.exitCode = 1;
  }
  if (!resDestino) {
    console.log(`No se encontró la estación de destino con código ${destino}. Verifique el código e intente de nuevo.`);
    process.exitCode = 1;
  }
  if (!resOrigen || !resDestino) return;

  // Validar si origen o destino están cerrados
  if (cerradas.has(origen)) {
    console.log(`La estación de origen ${resOrigen.estacion} (${origen}) está cerrada. No es posible iniciar el viaje.`);
    process.exitCode = 1;
    return;
  }
  if (cerradas.has(destino)) {
    console.log(`La estación de destino ${resDestino.estacion} (${destino}) está cerrada. No es posible completar el viaje.`);
    process.exitCode = 1;
    return;
  }

  console.log("=== Planificador Ruta Paisa v0.2 ===\n");
  console.log(`Origen:  ${resOrigen.estacion} (${origen})`);
  console.log(`Destino: ${resDestino.estacion} (${destino})`);
  if (cerradas.size > 0) {
    const nombresCerradas = Array.from(cerradas).map((c) => `${nombreDe(c, indice)} (${c})`).join(", ");
    console.log(`Estaciones cerradas: ${nombresCerradas}`);
  }
  console.log("");

  const ruta = grafo.bfs(origen, destino, cerradas);

  if (!ruta) {
    if (cerradas.size > 0) {
      console.log("Viaje imposible: no hay ruta disponible entre el origen y el destino con las estaciones cerradas indicadas.");
      console.log("Sugerencia: intente nuevamente sin cerrar estaciones o con un conjunto diferente de cierres para ver alternativas.");
    } else {
      console.log("Viaje imposible: no existe una ruta que conecte el origen con el destino en la red.");
    }
    return;
  }

  const transbordos = detectarTransbordos(ruta, grafo);
  const transbordoSet = new Set(transbordos.map((t) => t.en));
  const paradas = ruta.length - 1;

  console.log("-- Ruta sugerida --");
  for (let i = 0; i < ruta.length; i++) {
    const codigo = ruta[i];
    const nombre = nombreDe(codigo, indice);
    let marca = "";
    if (i === 0) marca = " (inicio)";
    else if (i === ruta.length - 1) marca = " (destino)";
    if (transbordoSet.has(codigo)) {
      const t = transbordos.find((x) => x.en === codigo);
      if (t) marca += ` [Transbordo: Línea ${t.deLinea} -> Línea ${t.aLinea}]`;
    }
    console.log(`${i + 1}. ${nombre} (${codigo})${marca}`);
    if (i < ruta.length - 1) {
      const linea = grafo.obtenerLineaConexion(ruta[i], ruta[i + 1]);
      if (linea) console.log(`    ↓ Línea ${linea}`);
    }
  }

  console.log("");
  console.log(`Total de paradas (tramos): ${paradas}`);
  console.log(`Total de estaciones en el recorrido: ${ruta.length}`);
  if (transbordos.length === 0) {
    console.log("Transbordos: ninguno (ruta directa en la misma línea).");
  } else {
    console.log(`Transbordos: ${transbordos.length}`);
    for (const t of transbordos) {
      console.log(`  - En ${nombreDe(t.en, indice)} (${t.en}): cambio de Línea ${t.deLinea} a Línea ${t.aLinea}`);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, detectarTransbordos };
