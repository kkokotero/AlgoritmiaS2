/**
 * Pruebas de combos de regalo y análisis de frecuencias.
 * Ejecutar: node src/combosFrecuencias.js
 */

const { VENTAS } = require("./datos.js");
const { CATALOGO, comboRegalo, comboRegaloOptimizado } = require("./catalogo.js");
const { productoEstrellaPorCiudad, primerClienteUnico } = require("./analitica.js");

/**
 * Formatea un combo de dos productos para mostrar en consola.
 * @param {[import('./catalogo.js').ProductoCatalogo, import('./catalogo.js').ProductoCatalogo] | null} res
 * @returns {string}
 */
function fmtCombo(res) {
  if (!res) return "null";
  return `${res[0].producto} ($${res[0].precio}) + ${res[1].producto} ($${res[1].precio})`;
}

console.log("=== Combo regalo (fuerza bruta) ===");
console.log("87000:", fmtCombo(comboRegalo(CATALOGO, 87000)));
console.log("61000:", fmtCombo(comboRegalo(CATALOGO, 61000)));
console.log("50000:", fmtCombo(comboRegalo(CATALOGO, 50000)));

console.log("\n=== Combo regalo (optimizado con Map) ===");
console.log("87000:", fmtCombo(comboRegaloOptimizado(CATALOGO, 87000)));
console.log("61000:", fmtCombo(comboRegaloOptimizado(CATALOGO, 61000)));
console.log("50000:", fmtCombo(comboRegaloOptimizado(CATALOGO, 50000)));

console.log("\n=== Producto estrella por ciudad (Día 1) ===");
console.log(productoEstrellaPorCiudad(VENTAS));

console.log("\n=== Primer cliente único (Día 1) ===");
console.log(primerClienteUnico(VENTAS));
