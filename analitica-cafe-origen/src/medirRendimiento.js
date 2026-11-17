/**
 * Medición de rendimiento v0.1 (simulado) vs v1.0.
 * Ejecutar: node src/medirRendimiento.js
 */

const { VENTAS } = require("./datos.js");
const { generarVentas, totalesPorDia } = require("./generarVentas.js");
const { CATALOGO, comboRegaloOptimizado } = require("./catalogo.js");
const { mejorSemana } = require("./ventanas.js");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  fechasConVentas,
  primerClienteUnico,
  productoEstrellaPorCiudad,
  resumenDelDia,
  resumenPorCiudad,
  resumenPorProducto,
  ticketPromedio,
  topProductosPorValor,
  totalVendidoM,
  unidadesVendidasM,
  ventaMayor,
} = require("./analitica.js");

const VENTAS_DIARIAS_SEPTIEMBRE = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370,
];

/**
 * Pipeline tipo reporte v0.1 (sin secciones nuevas, usando recurrentes O(n^2)).
 * @param {import('./datos.js').Venta[]} ventas
 */
function pipelineV01(ventas) {
  totalVendidoM(ventas);
  unidadesVendidasM(ventas);
  ticketPromedio(ventas);
  ventaMayor(ventas);
  resumenPorCiudad(ventas);
  resumenPorProducto(ventas);
  topProductosPorValor(ventas, 3);
  const fechas = fechasConVentas(ventas);
  if (fechas.length > 0) {
    resumenDelDia(ventas, fechas[0]);
    resumenDelDia(ventas, "2099-01-01");
  }
  clientesRecurrentes(ventas); // O(n^2) en v0.1
}

/**
 * Pipeline tipo reporte v1.0 (optimizado, con secciones nuevas).
 * @param {import('./datos.js').Venta[]} ventas
 */
function pipelineV10(ventas) {
  totalVendidoM(ventas);
  unidadesVendidasM(ventas);
  ticketPromedio(ventas);
  ventaMayor(ventas);
  resumenPorCiudad(ventas);
  resumenPorProducto(ventas);
  topProductosPorValor(ventas, 3);
  clientesRecurrentesSet(ventas);
  productoEstrellaPorCiudad(ventas);
  comboRegaloOptimizado(CATALOGO, 87000);
  primerClienteUnico(ventas);
  const { fechas, totales } = totalesPorDia(ventas);
  if (fechas.length >= 7) {
    mejorSemana(totales, 7);
  } else {
    mejorSemana(VENTAS_DIARIAS_SEPTIEMBRE, 7);
  }
  if (fechas.length > 0) {
    resumenDelDia(ventas, fechas[0]);
    resumenDelDia(ventas, "2099-01-01");
  }
}

/**
 * @param {(ventas: import('./datos.js').Venta[]) => void} fn
 * @param {import('./datos.js').Venta[]} ventas
 * @returns {number} ms
 */
function medir(fn, ventas) {
  const ini = process.hrtime.bigint();
  fn(ventas);
  const fin = process.hrtime.bigint();
  return Number(fin - ini) / 1e6;
}

/**
 * @param {number} ms
 * @returns {string}
 */
function fmt(ms) {
  return ms < 1000 ? `${ms.toFixed(2)} ms` : `${(ms / 1000).toFixed(2)} s`;
}

const casos = [10000, 100000];
console.log("# Medición rendimiento v0.1 vs v1.0");
console.log("");
console.log("| Ventas | v0.1 (pipeline con recurrentes O(n^2)) | v1.0 (optimizado, secciones nuevas) | Mejora |");
console.log("|-------:|--------------------------------------:|------------------------------------:|-------:|");

for (const n of casos) {
  const ventas = generarVentas(n);
  // calentar
  pipelineV10(ventas.slice(0, 1000));
  const t01 = medir(pipelineV01, ventas);
  const t10 = medir(pipelineV10, ventas);
  const mejora = t01 / t10;
  console.log(`| ${n} | ${fmt(t01)} | ${fmt(t10)} | ${mejora.toFixed(1)}x |`);
}
