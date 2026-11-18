/**
 * Trazas, mediciones y experimentos de Merge Sort (Semana 3, Día 3).
 * Ejecutar: node src/medirMergeSort.js
 */

const { generarCatalogo } = require("./generador");
const { mezclar, mergeSort } = require("./ordenamiento");
const { porAutorYTitulo, porAutor, porTitulo } = require("./comparadores");

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function compararNumeros(a, b) {
  return a - b;
}

/**
 * @param {any[]} arr
 * @returns {string}
 */
function fmt(arr) {
  return "[" + arr.join(", ") + "]";
}

console.log("=== 1. Prueba de mezclar con dos listas de años ordenadas ===");
const listaA = [1924, 1967, 2004, 2006];
const listaB = [1988, 1999, 2002, 2007];
const contMezcla = { comparaciones: 0, desplazamientos: 0 };
const mezclada = mezclar(listaA, listaB, compararNumeros, contMezcla);
console.log(`Izquierda: ${fmt(listaA)}`);
console.log(`Derecha:   ${fmt(listaB)}`);
console.log(`Resultado: ${fmt(mezclada)}`);
console.log(`Comparaciones: ${contMezcla.comparaciones}, Desplazamientos (escrituras): ${contMezcla.desplazamientos}\n`);

/**
 * Merge Sort con captura de árbol de divisiones y mezclas.
 * @param {number[]} arreglo
 * @param {number} profundidad
 * @param {string[]} lineas
 * @param {{comparaciones:number, desplazamientos:number}} contadores
 * @returns {number[]}
 */
function mergeSortArbol(arreglo, profundidad, lineas, contadores) {
  const indent = "  ".repeat(profundidad);
  if (arreglo.length <= 1) {
    lineas.push(`${indent}- Base: ${fmt(arreglo)}`);
    return arreglo.slice();
  }
  const medio = Math.floor(arreglo.length / 2);
  const izq = arreglo.slice(0, medio);
  const der = arreglo.slice(medio);
  lineas.push(`${indent}- Dividir: ${fmt(arreglo)} -> izq=${fmt(izq)}, der=${fmt(der)}`);
  const izqOrd = mergeSortArbol(izq, profundidad + 1, lineas, contadores);
  const derOrd = mergeSortArbol(der, profundidad + 1, lineas, contadores);
  const res = mezclar(izqOrd, derOrd, compararNumeros, contadores);
  lineas.push(`${indent}- Mezclar: ${fmt(izqOrd)} + ${fmt(derOrd)} => ${fmt(res)}`);
  return res;
}

console.log("=== 2. Árbol de divisiones y mezclas: [2006,1967,2004,1924,1999,2007,1988,2002] ===");
const arregloArbol = [2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002];
/** @type {string[]} */
const lineas = [];
const contArbol = { comparaciones: 0, desplazamientos: 0 };
const resultadoArbol = mergeSortArbol(arregloArbol, 0, lineas, contArbol);
for (const l of lineas) console.log(l);
console.log(`Resultado final: ${fmt(resultadoArbol)}`);
console.log(`Comparaciones totales: ${contArbol.comparaciones}, Desplazamientos: ${contArbol.desplazamientos}\n`);

console.log("=== 3. Comparaciones vs n·log₂(n) ===");
console.log("| n | Comparaciones Merge Sort | n·log₂(n) | ¿comparaciones < n·log₂(n)? |");
console.log("|---:|---:|---:|:---:|");
const tamanos = [1000, 10000, 100000];
for (const n of tamanos) {
  const catalogo = generarCatalogo(n);
  const res = mergeSort(catalogo, (a, b) => a.anio - b.anio);
  const nlogn = n * Math.log2(n);
  const cumple = res.comparaciones < nlogn;
  console.log(`| ${n} | ${res.comparaciones} | ${nlogn.toFixed(2)} | ${cumple ? "Sí" : "No"} |`);
}

console.log("\n=== 4. Experimento de estabilidad (MiniReto 7) con Merge Sort ===");
/** @type {{autor:string,titulo:string,anio:number,prestamos:number}[]} */
const tabla = [
  { autor: "Laura Restrepo", titulo: "Delirio", anio: 2004, prestamos: 201 },
  { autor: "Mario Mendoza", titulo: "Cobro de sangre", anio: 2004, prestamos: 120 },
  { autor: "Laura Restrepo", titulo: "Dulce compañía", anio: 1995, prestamos: 180 },
  { autor: "Mario Mendoza", titulo: "Buda Blues", anio: 2009, prestamos: 95 },
  { autor: "Laura Restrepo", titulo: "La novia oscura", anio: 1999, prestamos: 150 },
];
const ref = mergeSort(tabla, porAutorYTitulo).arreglo;
/** @param {{autor:string,titulo:string}[]} arr */
function fmtTabla(arr) {
  return arr.map((l) => `  ${l.autor} - ${l.titulo}`).join("\n");
}
console.log("Referencia porAutorYTitulo:");
console.log(fmtTabla(ref));
const paso1 = mergeSort(tabla, porTitulo).arreglo;
const paso2 = mergeSort(paso1, porAutor).arreglo;
console.log("\nMétodo del bibliotecario (1º por título, 2º por autor) con Merge Sort:");
console.log(fmtTabla(paso2));
const igual = fmtTabla(paso2) === fmtTabla(ref);
console.log(`\n¿Conserva orden por título dentro de cada autor? ${igual ? "Sí (ESTABLE)" : "No (inestable)"}`);

console.log("\n=== 5. Merge Sort vs algoritmos básicos con 4.000 libros (aleatorio) ===");
// Comparación rápida solo aleatorio 4000 (el laboratorio completo está en src/laboratorio.js)
const { bubbleSort, selectionSort, insertionSort } = require("./ordenamiento");
/** @param {{anio:number}[]} arr @returns {boolean} */
function estaOrdenado(arr) {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1].anio > arr[i].anio) return false;
  return true;
}
const datos = generarCatalogo(4000);
const algs = [
  { nombre: "Bubble Sort", fn: (d) => bubbleSort(d, (a,b)=>a.anio-b.anio) },
  { nombre: "Selection Sort", fn: (d) => selectionSort(d, (a,b)=>a.anio-b.anio) },
  { nombre: "Insertion Sort", fn: (d) => insertionSort(d, (a,b)=>a.anio-b.anio) },
  { nombre: "Merge Sort", fn: (d) => mergeSort(d, (a,b)=>a.anio-b.anio) },
];
console.log("| Algoritmo | Comparaciones | Tiempo (ms) | ¿Ordenado? |");
console.log("|---|---:|---:|:---:|");
for (const a of algs) {
  const copia = datos.slice();
  const t0 = process.hrtime.bigint();
  const r = a.fn(copia);
  const t1 = process.hrtime.bigint();
  const ms = Number(t1 - t0) / 1e6;
  console.log(`| ${a.nombre} | ${r.comparaciones} | ${ms.toFixed(3)} | ${estaOrdenado(r.arreglo) ? "Sí" : "No"} |`);
}
