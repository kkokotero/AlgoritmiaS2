/**
 * Mediciones, trazas y experimentos de Quick Sort (Semana 3, Día 3).
 * Ejecutar: node src/medirQuickSort.js
 */

const { generarCatalogo } = require("./generador");
const {
  particion,
  quickSort,
  quickSortAleatorio,
  mergeSort,
} = require("./ordenamiento");
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

console.log("=== 1. Traza de la primera partición (Lomuto, pivote = último elemento) ===");
const base = [2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002];
const arrTraza = base.slice();
const contTraza = { comparaciones: 0, intercambios: 0 };
const pivote = arrTraza[arrTraza.length - 1];
console.log(`Arreglo inicial: ${fmt(base)}`);
console.log(`Pivote (último elemento): ${pivote}`);
console.log("| Paso (j) | arr[j] | ¿arr[j] <= pivote? | i | Arreglo tras paso | Intercambio |");
console.log("|---:|---:|:---:|---:|---|:---:|");

let i = -1;
const fin = arrTraza.length - 1;
for (let j = 0; j < fin; j++) {
  contTraza.comparaciones++;
  const val = arrTraza[j];
  const condicion = val <= pivote;
  let intercambio = "no";
  if (condicion) {
    i++;
    if (i !== j) {
      const temp = arrTraza[i];
      arrTraza[i] = arrTraza[j];
      arrTraza[j] = temp;
      contTraza.intercambios++;
      intercambio = `sí (swap ${i}↔${j})`;
    }
  }
  console.log(`| ${j} | ${val} | ${condicion ? "sí" : "no"} | ${i} | ${fmt(arrTraza.slice())} | ${intercambio} |`);
}
const posPivote = i + 1;
if (posPivote !== fin) {
  const temp = arrTraza[posPivote];
  arrTraza[posPivote] = arrTraza[fin];
  arrTraza[fin] = temp;
  contTraza.intercambios++;
  console.log(`Colocar pivote: swap posición ${posPivote} ↔ ${fin}`);
} else {
  console.log(`Colocar pivote: ya en posición correcta (${posPivote})`);
}
console.log(`Resultado tras 1ª partición: ${fmt(arrTraza)}`);
console.log(`Índice final del pivote: ${posPivote}, comparaciones: ${contTraza.comparaciones}, intercambios: ${contTraza.intercambios}`);
const izq = arrTraza.slice(0, posPivote);
const der = arrTraza.slice(posPivote + 1);
console.log(`Subarreglos: izquierda=${fmt(izq)} (<= ${pivote}), pivote=[${pivote}], derecha=${fmt(der)} (> ${pivote})\n`);

console.log("=== 2. Mediciones con 10.000 libros: aleatorio vs ordenado (pivote fijo = último) ===");
/** @param {{anio:number}[]} arr @returns {boolean} */
function estaOrdenado(arr) {
  for (let k = 1; k < arr.length; k++) if (arr[k - 1].anio > arr[k].anio) return false;
  return true;
}
const n = 10000;
const aleatorio10k = generarCatalogo(n);
const ordenado10k = mergeSort(generarCatalogo(n), (a, b) => a.anio - b.anio).arreglo;

console.log("Caso A: 10.000 libros ALEATORIOS, Quick Sort pivote fijo (último elemento)");
const tA0 = process.hrtime.bigint();
const rA = quickSort(aleatorio10k, (a, b) => a.anio - b.anio);
const tA1 = process.hrtime.bigint();
console.log(`  Comparaciones: ${rA.comparaciones}, Intercambios: ${rA.intercambios}, Tiempo: ${(Number(tA1 - tA0) / 1e6).toFixed(3)} ms, ¿Ordenado?: ${estaOrdenado(rA.arreglo) ? "Sí" : "No"}`);

console.log("\nCaso B: 10.000 libros YA ORDENADOS, Quick Sort pivote fijo (último elemento)");
let rB = null;
let tBms = 0;
let errorB = null;
const tB0 = process.hrtime.bigint();
try {
  rB = quickSort(ordenado10k, (a, b) => a.anio - b.anio);
  const tB1 = process.hrtime.bigint();
  tBms = Number(tB1 - tB0) / 1e6;
} catch (e) {
  const tB1 = process.hrtime.bigint();
  tBms = Number(tB1 - tB0) / 1e6;
  errorB = e;
}
if (rB) {
  console.log(`  Comparaciones: ${rB.comparaciones}, Intercambios: ${rB.intercambios}, Tiempo: ${tBms.toFixed(3)} ms, ¿Ordenado?: ${estaOrdenado(rB.arreglo) ? "Sí" : "No"}`);
} else {
  console.log(`  RESULTADO: Falló con error tras ${tBms.toFixed(3)} ms: ${errorB && errorB.message ? errorB.message : String(errorB)}`);
}
console.log("  Explicación: con datos ya ordenados y pivote = último elemento, en cada partición TODOS los elementos son <= pivote,");
console.log("  por lo que el pivote queda en la última posición y se generan subproblemas de tamaño n-1 y 0 (partición totalmente desbalanceada).");
console.log("  Esto produce ~n*(n-1)/2 comparaciones => O(n²) y una profundidad de recursión O(n). Con n=10.000 se requieren ~10.000 llamadas,");
console.log("  que pueden exceder el límite de pila de llamadas de Node/V8 (stack overflow), bloqueando/fallando la ejecución como en el caso reportado.\n");

console.log("=== 3. Versión con pivote aleatorio: repetir medición con datos ordenados (10.000) ===");
const tC0 = process.hrtime.bigint();
const rC = quickSortAleatorio(ordenado10k, (a, b) => a.anio - b.anio);
const tC1 = process.hrtime.bigint();
console.log(`Quick Sort pivote ALEATORIO, 10.000 libros ya ordenados:`);
console.log(`  Comparaciones: ${rC.comparaciones}, Intercambios: ${rC.intercambios}, Tiempo: ${(Number(tC1 - tC0) / 1e6).toFixed(3)} ms, ¿Ordenado?: ${estaOrdenado(rC.arreglo) ? "Sí" : "No"}`);
console.log("  El pivote aleatorio evita el caso patológico: las particiones tienden a ser balanceadas y el comportamiento vuelve a ~O(n log n) en promedio.\n");

console.log("=== 4. Estabilidad de Quick Sort (experimento MiniReto 7) ===");
/** @type {{autor:string,titulo:string,anio:number,prestamos:number}[]} */
const tabla = [
  { autor: "Laura Restrepo", titulo: "Delirio", anio: 2004, prestamos: 201 },
  { autor: "Mario Mendoza", titulo: "Cobro de sangre", anio: 2004, prestamos: 120 },
  { autor: "Laura Restrepo", titulo: "Dulce compañía", anio: 1995, prestamos: 180 },
  { autor: "Mario Mendoza", titulo: "Buda Blues", anio: 2009, prestamos: 95 },
  { autor: "Laura Restrepo", titulo: "La novia oscura", anio: 1999, prestamos: 150 },
];
/** @param {{autor:string,titulo:string}[]} arr */
function fmtTabla(arr) {
  return arr.map((l) => `  ${l.autor} - ${l.titulo}`).join("\n");
}
const ref = mergeSort(tabla, porAutorYTitulo).arreglo;
console.log("Referencia (mergeSort + porAutorYTitulo, estable):");
console.log(fmtTabla(ref));
const paso1q = quickSort(tabla, porTitulo).arreglo;
const paso2q = quickSort(paso1q, porAutor).arreglo;
console.log("\nMétodo del bibliotecario con Quick Sort (pivote fijo): 1º por título, 2º por autor");
console.log(fmtTabla(paso2q));
console.log(`\n¿Conserva orden por título dentro de cada autor? ${fmtTabla(paso2q) === fmtTabla(ref) ? "Sí (estable)" : "No (INESTABLE)"}`);
console.log("Conclusión: Quick Sort (Lomuto, in-place con intercambios de larga distancia) NO es estable: puede reordenar elementos con clave igual.\n");

console.log("=== 5. Comparación Merge Sort vs Quick Sort (resumen) ===");
console.log("| Aspecto | Merge Sort | Quick Sort (pivote fijo, Lomuto) | Quick Sort (pivote aleatorio) |");
console.log("|---|---|---|---|");
console.log("| Mejor caso (tiempo) | O(n log n) | O(n log n) | O(n log n) (esperado) |");
console.log("| Caso promedio (tiempo) | O(n log n) | O(n log n) | O(n log n) |");
console.log("| Peor caso (tiempo) | O(n log n) | O(n²) (p. ej. datos ordenados, pivote último) | O(n²) raro; esperado O(n log n) |");
console.log("| Memoria adicional | O(n) (arreglos auxiliares en mezcla) | O(log n) promedio en pila (O(n) peor caso); partición in-place | O(log n) promedio en pila |");
console.log("| Estabilidad | Estable (<= al mezclar) | No estable | No estable |");
console.log("| Dependencia del estado de datos | Rendimiento garantizado | Muy sensible al pivote/orden inicial | Robusto frente a orden inicial |");
