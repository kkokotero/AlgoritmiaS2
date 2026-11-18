/**
 * Análisis de cierres con DFS: alcanzabilidad, componentes y estaciones críticas.
 */

const { construirGrafoRed } = require("./red");
const { construirIndiceOriginal } = require("./indice");

/**
 * @param {number} codigo
 * @param {any} idx
 * @returns {string}
 */
function nombreEstacion(codigo, idx) {
  const res = idx.buscar(codigo);
  return res ? res.estacion : String(codigo);
}

/**
 * Compara dos arreglos como conjuntos de códigos.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {boolean}
 */
function mismosElementos(a, b) {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  for (const x of b) {
    if (!sa.has(x)) return false;
  }
  return true;
}

/**
 * Calcula las estaciones críticas: al cerrar una, la red se divide en 2+ componentes.
 * @param {import("../estructuras/Grafo")} [grafo]
 * @param {any} [idx]
 * @returns {{codigo:number, nombre:string, componentes:number[][]}[]}
 */
function obtenerEstacionesCriticas(grafo, idx) {
  const g = grafo || construirGrafoRed();
  const indice = idx || construirIndiceOriginal();
  const todas = Array.from(g.adyacencia.keys());
  /** @type {{codigo:number, nombre:string, componentes:number[][]}[]} */
  const criticas = [];
  for (const estacion of todas) {
    const comps = g.componentes(new Set([estacion]));
    if (comps.length >= 2) {
      criticas.push({ codigo: estacion, nombre: nombreEstacion(estacion, indice), componentes: comps });
    }
  }
  criticas.sort((a, b) => a.codigo - b.codigo);
  return criticas;
}

function main() {
  const grafo = construirGrafoRed();
  const idx = construirIndiceOriginal();
  const todas = Array.from(grafo.adyacencia.keys());

  console.log("=== DFS y análisis de cierres - Ruta Paisa ===\n");

  console.log("-- 1. Alcanzabilidad con red completa (desde cada estación) --");
  let todasAlcanzan = true;
  for (const inicio of todas) {
    const alcanzables = grafo.dfs(inicio, new Set());
    if (alcanzables.length !== 20) {
      todasAlcanzan = false;
      console.log(`  Desde ${inicio}: ${alcanzables.length} estaciones (esperado 20)`);
    }
  }
  console.log(`¿DFS desde cualquier estación alcanza las 20 estaciones? ${todasAlcanzan ? "Sí" : "No"}\n`);

  console.log("-- 2. DFS recursivo vs iterativo (mismo conjunto de estaciones) --");
  let coincidenTodos = true;
  for (const inicio of todas) {
    const rec = grafo.dfs(inicio, new Set());
    const it = grafo.dfsIterativo(inicio, new Set());
    if (!mismosElementos(rec, it)) {
      coincidenTodos = false;
      console.log(`  Diferencia desde ${inicio}`);
    }
  }
  console.log(`¿Versiones recursiva e iterativa encuentran el mismo conjunto desde todas las estaciones? ${coincidenTodos ? "Sí" : "No"}\n`);

  console.log("-- 3. Cierre de Estadio (56) --");
  const cerradasEstadio = new Set([56]);
  const compsEstadio = grafo.componentes(cerradasEstadio);
  console.log(`Número de componentes al cerrar Estadio: ${compsEstadio.length}`);
  for (let i = 0; i < compsEstadio.length; i++) {
    const comp = compsEstadio[i];
    const nombres = comp.map((c) => `${nombreEstacion(c, idx)} (${c})`).sort().join(", ");
    console.log(`  Componente ${i + 1} (${comp.length} estaciones): ${nombres}`);
  }
  const principalIdx = compsEstadio.reduce((maxI, c, i, arr) => c.length > arr[maxI].length ? i : maxI, 0);
  const aisladas = [];
  for (let i = 0; i < compsEstadio.length; i++) {
    if (i !== principalIdx) {
      for (const c of compsEstadio[i]) aisladas.push(c);
    }
  }
  const nombresAisladas = aisladas.map((c) => `${nombreEstacion(c, idx)} (${c})`).sort().join(", ");
  console.log(`Estaciones aisladas del resto de la red: ${nombresAisladas}\n`);

  console.log("-- 4. Estaciones críticas (su cierre divide la red en 2 o más componentes) --");
  const criticas = obtenerEstacionesCriticas(grafo, idx);
  console.log(`Total estaciones críticas: ${criticas.length}`);
  for (const c of criticas) {
    const compsOrdenados = c.componentes
      .map((comp) => comp.slice().sort((x, y) => x - y))
      .sort((a, b) => a.length - b.length || a[0] - b[0]);
    const detalle = compsOrdenados
      .map((comp) => `{${comp.map((x) => `${nombreEstacion(x, idx)}(${x})`).join(", ")}}`)
      .join(" | ");
    console.log(`  ${nombreEstacion(c.codigo, idx)} (${c.codigo}) -> ${c.componentes.length} componentes: ${detalle}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { obtenerEstacionesCriticas, nombreEstacion };
