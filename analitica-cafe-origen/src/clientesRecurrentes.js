/**
 * Verificación y medición de clientes recurrentes (original vs Set vs Map).
 * Ejecutar: node src/clientesRecurrentes.js
 */

const { VENTAS } = require("./datos.js");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  comprasPorCliente,
} = require("./analitica.js");

/**
 * @typedef {{ n: number, original: number | null, set: number, map: number }} FilaMedicion
 */

/**
 * Convierte un resultado (Set o arreglo) a un arreglo ordenado para comparar.
 * @param {Set<string> | string[]} valor
 * @returns {string[]}
 */
function normalizarResultado(valor) {
  if (valor instanceof Set) return [...valor].sort();
  return [...valor].sort();
}

/**
 * Compara dos arreglos de strings ya ordenados.
 * @param {string[]} a
 * @param {string[]} b
 * @returns {boolean}
 */
function iguales(a, b) {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/**
 * Genera ventas sintéticas para pruebas de rendimiento.
 * @param {number} n
 * @param {number} [clientesUnicos=2000]
 * @returns {import('./datos.js').Venta[]}
 */
function generarVentas(n, clientesUnicos = 2000) {
  /** @type {import('./datos.js').Venta[]} */
  const ventas = [];
  for (let i = 0; i < n; i++) {
    ventas.push({
      id: i + 1,
      fecha: "2026-09-01",
      cliente: `C${i % clientesUnicos}`,
      producto: "Producto",
      ciudad: "Bogotá",
      cantidad: 1,
      precio: 1000,
    });
  }
  return ventas;
}

/**
 * Mide el tiempo de ejecución de una función (console.time + hrtime).
 * @param {(ventas: import('./datos.js').Venta[]) => Set<string> | string[]} fn
 * @param {import('./datos.js').Venta[]} ventas
 * @param {string} etiqueta
 * @returns {{ ms: number, resultado: Set<string> | string[], etiqueta: string }}
 */
function medir(fn, ventas, etiqueta) {
  const label = `${etiqueta} (${ventas.length})`;
  console.time(label);
  const inicio = process.hrtime.bigint();
  const resultado = fn(ventas);
  const fin = process.hrtime.bigint();
  console.timeEnd(label);
  const ms = Number(fin - inicio) / 1e6;
  return { ms, resultado, etiqueta };
}

/**
 * Verifica que las tres versiones devuelvan los mismos clientes.
 * @param {string} nombre
 * @param {import('./datos.js').Venta[]} ventas
 * @returns {boolean}
 */
function verificarConjunto(nombre, ventas) {
  const a = normalizarResultado(clientesRecurrentes(ventas));
  const b = normalizarResultado(clientesRecurrentesSet(ventas));
  const c = normalizarResultado(comprasPorCliente(ventas));
  const ok = iguales(a, b) && iguales(b, c);
  console.log(`${nombre}: ${ok ? "OK" : "DIFERENTE"}`);
  if (!ok) {
    console.log("original:", a);
    console.log("set:", b);
    console.log("map:", c);
  }
  return ok;
}

console.log("=== Verificación ===");
let ok = true;
ok = verificarConjunto("Datos Día 1 (VENTAS)", VENTAS) && ok;
const ventas5k = generarVentas(5000);
ok = verificarConjunto("5.000 ventas generadas", ventas5k) && ok;

console.log("\n=== Mediciones ===");
const tamanos = [1000, 10000, 100000];
/** @type {FilaMedicion[]} */
const filas = [];

for (const n of tamanos) {
  const ventas = generarVentas(n);
  /** @type {FilaMedicion} */
  const fila = { n, original: null, set: 0, map: 0 };

  if (n <= 10000) {
    const mOrig = medir(clientesRecurrentes, ventas, "original");
    fila.original = mOrig.ms;
  }

  const mSet = medir(clientesRecurrentesSet, ventas, "set");
  const mMap = medir(comprasPorCliente, ventas, "map");
  fila.set = mSet.ms;
  fila.map = mMap.ms;

  const r1 =
    n <= 10000
      ? normalizarResultado(medir(clientesRecurrentes, ventas, "original").resultado)
      : normalizarResultado(mSet.resultado);
  const r2 = normalizarResultado(mSet.resultado);
  const r3 = normalizarResultado(mMap.resultado);
  if (!iguales(r2, r3) || (n <= 10000 && !iguales(r1, r2))) {
    console.error(`Resultados distintos en n=${n}`);
    ok = false;
  }

  filas.push(fila);
}

/**
 * Formatea milisegundos para la tabla.
 * @param {number | null} ms
 * @returns {string}
 */
function fmt(ms) {
  if (ms == null) return "omitida (no razonable)";
  return ms < 1000 ? `${ms.toFixed(3)} ms` : `${(ms / 1000).toFixed(3)} s`;
}

console.log("\n| Ventas | Original (fuerza bruta) | Set | Map |");
console.log("|-------:|------------------------:|----:|----:|");
for (const f of filas) {
  console.log(`| ${f.n} | ${fmt(f.original)} | ${fmt(f.set)} | ${fmt(f.map)} |`);
}

console.log(`\nRESULTADO: ${ok ? "OK" : "FALLA"}`);
process.exitCode = ok ? 0 : 1;
