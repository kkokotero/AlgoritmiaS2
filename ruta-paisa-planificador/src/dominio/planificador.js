/**
 * Planificador de viajes Ruta Paisa v1.0.
 * Funcionalidades:
 * - Consulta de ruta con transbordos y cierres: <origen> <destino> [--cerradas ...]
 * - Listado ordenado de estaciones: --listado
 * - Consulta por rango de códigos: --rango <desde> <hasta>
 * - Análisis de estaciones críticas: --criticas
 * - Validación del plan de mantenimiento: --mantenimiento
 */

const { construirGrafoRed } = require("./red");
const { construirIndiceOriginal, listadoOrdenado, consultaRango } = require("./indice");
const { obtenerEstacionesCriticas, nombreEstacion } = require("./cierres");
const { ejecutarMantenimiento } = require("./mantenimiento");

/**
 * Parsea los argumentos de la terminal.
 * @param {string[]} argv
 * @returns {{modo: string, origen: number|null, destino: number|null, cerradas: Set<number>, desde: number|null, hasta: number|null, error: string|null}}
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const cerradas = new Set();
  /** @type {string[]} */
  const posicionales = [];
  let modo = "ruta";
  let desde = null;
  let hasta = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--mantenimiento") {
      modo = "mantenimiento";
    } else if (arg === "--listado") {
      modo = "listado";
    } else if (arg === "--criticas") {
      modo = "criticas";
    } else if (arg === "--rango") {
      modo = "rango";
      const v1 = args[i + 1];
      const v2 = args[i + 2];
      if (v1 === undefined || v2 === undefined) {
        return { modo, origen: null, destino: null, cerradas, desde: null, hasta: null, error: "Uso: --rango <desde> <hasta> (ej: --rango 10 30)" };
      }
      desde = parseInt(v1, 10);
      hasta = parseInt(v2, 10);
      i += 2;
    } else if (arg === "--cerradas") {
      const valor = args[i + 1];
      if (valor === undefined) {
        return { modo, origen: null, destino: null, cerradas, desde, hasta, error: "Debe indicar los códigos de estaciones cerradas después de --cerradas (ej: --cerradas 56,40)." };
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

  if (modo === "ruta") {
    if (posicionales.length < 2) {
      return {
        modo,
        origen: null,
        destino: null,
        cerradas,
        desde: null,
        hasta: null,
        error: "Uso: node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]\n" +
          "     node src/planificador.js --listado\n" +
          "     node src/planificador.js --rango <desde> <hasta>\n" +
          "     node src/planificador.js --criticas\n" +
          "     node src/planificador.js --mantenimiento",
      };
    }
    const origen = parseInt(posicionales[0], 10);
    const destino = parseInt(posicionales[1], 10);
    if (Number.isNaN(origen) || Number.isNaN(destino)) {
      return {
        modo,
        origen: null,
        destino: null,
        cerradas,
        desde: null,
        hasta: null,
        error: "Los códigos de origen y destino deben ser números válidos. Ejemplo: node src/planificador.js 10 59",
      };
    }
    return { modo, origen, destino, cerradas, desde: null, hasta: null, error: null };
  }

  if (modo === "rango") {
    if (desde === null || hasta === null || Number.isNaN(desde) || Number.isNaN(hasta)) {
      return { modo, origen: null, destino: null, cerradas, desde: null, hasta: null, error: "Uso: --rango <desde> <hasta> con códigos numéricos válidos." };
    }
    return { modo, origen: null, destino: null, cerradas, desde, hasta, error: null };
  }

  return { modo, origen: null, destino: null, cerradas, desde, hasta, error: null };
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
 * @param {import("../estructuras/Grafo")} grafo
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

/**
 * Consulta de ruta con transbordos y cierres.
 * @param {number} origen
 * @param {number} destino
 * @param {Set<number>} cerradas
 */
function consultarRuta(origen, destino, cerradas) {
  const indice = construirIndiceOriginal();
  const grafo = construirGrafoRed();

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

  console.log("=== Planificador Ruta Paisa v1.0 ===\n");
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

/**
 * Listado ordenado de estaciones (inorden del ABB).
 */
function mostrarListado() {
  const listado = listadoOrdenado();
  console.log("=== Listado ordenado de estaciones (código ascendente) ===\n");
  for (const e of listado) {
    console.log(`${e.codigo}\t${e.estacion}`);
  }
  console.log(`\nTotal: ${listado.length} estaciones.`);
}

/**
 * Consulta por rango de códigos.
 * @param {number} desde
 * @param {number} hasta
 */
function mostrarRango(desde, hasta) {
  const estaciones = consultaRango(desde, hasta);
  console.log(`=== Consulta por rango de códigos [${desde}, ${hasta}] ===\n`);
  if (estaciones.length === 0) {
    console.log("No hay estaciones en el rango indicado.");
    return;
  }
  for (const e of estaciones) {
    console.log(`${e.codigo}\t${e.estacion}`);
  }
  console.log(`\nTotal en rango: ${estaciones.length} estaciones.`);
}

/**
 * Análisis de estaciones críticas.
 */
function mostrarCriticas() {
  const grafo = construirGrafoRed();
  const idx = construirIndiceOriginal();
  const criticas = obtenerEstacionesCriticas(grafo, idx);
  console.log("=== Análisis de estaciones críticas ===\n");
  console.log("Una estación es crítica si su cierre (eliminación) divide la red en 2 o más componentes.\n");
  console.log(`Total estaciones críticas: ${criticas.length}\n`);
  for (const c of criticas) {
    console.log(`- ${c.nombre} (${c.codigo}): ${c.componentes.length} componentes al cerrarla`);
  }
}

function main() {
  const parsed = parseArgs(process.argv);
  if (parsed.error) {
    console.log(parsed.error);
    process.exitCode = 1;
    return;
  }

  switch (parsed.modo) {
    case "mantenimiento":
      ejecutarMantenimiento();
      return;
    case "listado":
      mostrarListado();
      return;
    case "rango":
      if (parsed.desde !== null && parsed.hasta !== null) {
        mostrarRango(parsed.desde, parsed.hasta);
      }
      return;
    case "criticas":
      mostrarCriticas();
      return;
    case "ruta":
      if (parsed.origen !== null && parsed.destino !== null) {
        consultarRuta(parsed.origen, parsed.destino, parsed.cerradas);
      }
      return;
    default:
      console.log("Modo no reconocido.");
      process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, detectarTransbordos, consultarRuta, mostrarListado, mostrarRango, mostrarCriticas, main };
