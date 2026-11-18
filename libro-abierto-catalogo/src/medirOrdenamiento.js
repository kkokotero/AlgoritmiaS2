/**
 * Trazas y mediciones comparativas de Bubble Sort, Selection Sort e Insertion Sort.
 * Ejecutar: node src/medirOrdenamiento.js
 */

const { generarCatalogo, casiOrdenado } = require("./generador");
const { bubbleSort, selectionSort, insertionSort } = require("./ordenamiento");

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function compararNumeros(a, b) {
  return a - b;
}

/**
 * @param {{anio:number}} a
 * @param {{anio:number}} b
 * @returns {number}
 */
function compararPorAnio(a, b) {
  return a.anio - b.anio;
}

/**
 * @param {any[]} arr
 * @returns {string}
 */
function fmt(arr) {
  return "[" + arr.join(", ") + "]";
}

console.log("=== Trazas sobre [2006, 1967, 2004, 1924, 1999] (orden ascendente) ===\n");
const arregloBase = [2006, 1967, 2004, 1924, 1999];

const trazaBubble = bubbleSort(arregloBase, compararNumeros, { traza: true });
console.log("Bubble Sort:");
console.log(`Inicial: ${fmt(arregloBase)}`);
for (let i = 0; i < trazaBubble.traza.length; i++) {
  console.log(`Pasada ${i + 1}: ${fmt(trazaBubble.traza[i])}`);
}
console.log(`Comparaciones: ${trazaBubble.comparaciones}, Intercambios: ${trazaBubble.intercambios}, Desplazamientos: ${trazaBubble.desplazamientos}, Pasadas: ${trazaBubble.pasadas}\n`);

const trazaSelection = selectionSort(arregloBase, compararNumeros, { traza: true });
console.log("Selection Sort:");
console.log(`Inicial: ${fmt(arregloBase)}`);
for (let i = 0; i < trazaSelection.traza.length; i++) {
  console.log(`Pasada ${i + 1}: ${fmt(trazaSelection.traza[i])}`);
}
console.log(`Comparaciones: ${trazaSelection.comparaciones}, Intercambios: ${trazaSelection.intercambios}, Desplazamientos: ${trazaSelection.desplazamientos}, Pasadas: ${trazaSelection.pasadas}\n`);

const trazaInsertion = insertionSort(arregloBase, compararNumeros, { traza: true });
console.log("Insertion Sort:");
console.log(`Inicial: ${fmt(arregloBase)}`);
for (let i = 0; i < trazaInsertion.traza.length; i++) {
  console.log(`Pasada ${i + 1}: ${fmt(trazaInsertion.traza[i])}`);
}
console.log(`Comparaciones: ${trazaInsertion.comparaciones}, Intercambios: ${trazaInsertion.intercambios}, Desplazamientos: ${trazaInsertion.desplazamientos}, Pasadas: ${trazaInsertion.pasadas}\n`);

console.log("=== Mediciones con 2.000 libros (4 estados x 3 algoritmos) ===\n");
const n = 2000;

// Preparar estados
const aleatorio = generarCatalogo(n);
const ordenado = generarCatalogo(n).sort((a, b) => a.anio - b.anio);
const invertido = generarCatalogo(n).sort((a, b) => b.anio - a.anio);
const casi = casiOrdenado(n, 20);

const estados = [
  { nombre: "Aleatorio", datos: aleatorio },
  { nombre: "Ordenado", datos: ordenado },
  { nombre: "Invertido", datos: invertido },
  { nombre: "Casi ordenado (20 fuera de lugar al final)", datos: casi },
];

const algoritmos = [
  { nombre: "Bubble Sort", fn: bubbleSort },
  { nombre: "Selection Sort", fn: selectionSort },
  { nombre: "Insertion Sort", fn: insertionSort },
];

/**
 * Verifica que un arreglo de libros esté ordenado por año ascendente.
 * @param {{anio:number}[]} arr
 * @returns {boolean}
 */
function estaOrdenado(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1].anio > arr[i].anio) return false;
  }
  return true;
}

console.log("| Estado | Algoritmo | Comparaciones | Intercambios | Desplazamientos | Pasadas | Tiempo (ms) | ¿Ordenado? |");
console.log("|---|---|---:|---:|---:|---:|---:|:---:|");

for (const estado of estados) {
  for (const alg of algoritmos) {
    const copia = estado.datos.slice();
    const t0 = process.hrtime.bigint();
    const res = alg.fn(copia, compararPorAnio);
    const t1 = process.hrtime.bigint();
    const ms = Number(t1 - t0) / 1e6;
    const ok = estaOrdenado(res.arreglo);
    console.log(`| ${estado.nombre} | ${alg.nombre} | ${res.comparaciones} | ${res.intercambios} | ${res.desplazamientos} | ${res.pasadas} | ${ms.toFixed(3)} | ${ok ? "Sí" : "No"} |`);
  }
}

console.log("\n=== Verificación: todos los estados ordenados correctamente ===");
let todosOk = true;
for (const estado of estados) {
  for (const alg of algoritmos) {
    const res = alg.fn(estado.datos, compararPorAnio);
    if (!estaOrdenado(res.arreglo)) {
      console.log(`FALLA: ${alg.nombre} en estado ${estado.nombre}`);
      todosOk = false;
    }
  }
}
console.log(todosOk ? "Todos los algoritmos ordenan correctamente los cuatro estados." : "Hay fallas.");
