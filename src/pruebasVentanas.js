/**
 * Pruebas y comparación de tiempos: ventana deslizante y dos punteros.
 * Ejecutar: node src/pruebasVentanas.js
 */

const { CATALOGO } = require("./catalogo.js");
const { mejorSemanaBruta, mejorSemana, parMasCercano } = require("./ventanas.js");

const ventasDiarias = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370,
];

/**
 * Genera un arreglo de n enteros aleatorios en [min, max].
 * @param {number} n
 * @param {number} [min=100]
 * @param {number} [max=900]
 * @returns {number[]}
 */
function generarDias(n, min = 100, max = 900) {
  /** @type {number[]} */
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return arr;
}

/**
 * @param {{total:number,inicio:number}|null} a
 * @param {{total:number,inicio:number}|null} b
 * @returns {boolean}
 */
function igualesSemana(a, b) {
  if (a === null || b === null) return a === b;
  return a.total === b.total && a.inicio === b.inicio;
}

console.log("=== Mejor semana (septiembre, k=7) ===");
console.time("septiembre-bruta");
const sepBruta = mejorSemanaBruta(ventasDiarias, 7);
console.timeEnd("septiembre-bruta");
console.time("septiembre-ventana");
const sepVentana = mejorSemana(ventasDiarias, 7);
console.timeEnd("septiembre-ventana");
console.log("Bruta:", sepBruta);
console.log("Ventana:", sepVentana);
console.log("Coinciden:", igualesSemana(sepBruta, sepVentana));

console.log("\n=== Tres primeras posiciones de la ventana (k=7) ===");
for (let i = 0; i < 3; i++) {
  const ventana = ventasDiarias.slice(i, i + 7);
  const total = ventana.reduce((s, v) => s + v, 0);
  console.log(
    `Inicio día ${i + 1} (idx ${i}): [${ventana.join(", ")}] -> total ${total}`
  );
}

console.log("\n=== Comparación con 100.000 días aleatorios (k=7) ===");
const dias100k = generarDias(100000);
console.time("100k-bruta");
const rBruta = mejorSemanaBruta(dias100k, 7);
console.timeEnd("100k-bruta");
console.time("100k-ventana");
const rVentana = mejorSemana(dias100k, 7);
console.timeEnd("100k-ventana");
console.log("Coinciden:", igualesSemana(rBruta, rVentana));
console.log("Resultado:", rVentana);

console.log("\n=== Caso borde: k mayor que días ===");
console.log("k=50 sobre 30 días:", mejorSemana(ventasDiarias, 50));

/**
 * @param {{productos:[import('./catalogo.js').ProductoCatalogo,import('./catalogo.js').ProductoCatalogo], total:number}|null} r
 * @returns {string}
 */
function fmtPar(r) {
  if (!r) return "null";
  return `${r.productos[0].producto} ($${r.productos[0].precio}) + ${r.productos[1].producto} ($${r.productos[1].precio}) = $${r.total}`;
}

console.log("\n=== parMasCercano ===");
console.log("Presupuesto 100000:", fmtPar(parMasCercano(CATALOGO, 100000)));
console.log("Presupuesto 140000:", fmtPar(parMasCercano(CATALOGO, 140000)));
console.log("Presupuesto 40000:", fmtPar(parMasCercano(CATALOGO, 40000)));

console.log("\n=== Traza dos punteros (presupuesto 100000) ===");
const ordenados = [...CATALOGO].sort((a, b) => a.precio - b.precio);
console.log("Ordenados:", ordenados.map((p) => `${p.producto}($${p.precio})`).join(", "));
let i = 0;
let j = ordenados.length - 1;
/** @type {{productos:[import('./catalogo.js').ProductoCatalogo,import('./catalogo.js').ProductoCatalogo], total:number}|null} */
let mejor = null;
let paso = 1;
while (i < j) {
  const suma = ordenados[i].precio + ordenados[j].precio;
  let accion = "";
  if (suma <= 100000) {
    if (!mejor || suma > mejor.total) {
      mejor = { productos: [ordenados[i], ordenados[j]], total: suma };
      accion = `<= presupuesto: actualiza mejor=${suma}, mueve izquierda (i++) para buscar suma mayor`;
    } else {
      accion = `<= presupuesto: no mejora, mueve izquierda (i++)`;
    }
    console.log(
      `${paso}. i=${i} (${ordenados[i].producto}), j=${j} (${ordenados[j].producto}), suma=${suma} -> ${accion}`
    );
    i++;
  } else {
    accion = `> presupuesto: excede, mueve derecha (j--) para reducir suma`;
    console.log(
      `${paso}. i=${i} (${ordenados[i].producto}), j=${j} (${ordenados[j].producto}), suma=${suma} -> ${accion}`
    );
    j--;
  }
  paso++;
}
console.log("Resultado:", fmtPar(mejor));
