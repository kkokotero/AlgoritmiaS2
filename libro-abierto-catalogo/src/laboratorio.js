/**
 * Laboratorio de rendimiento v1.0 - Catálogo Libro Abierto.
 * Compara cinco algoritmos (Bubble, Selection, Insertion, Merge, Quick aleatorio)
 * con 1.000, 10.000 y 100.000 libros (los básicos solo hasta 10.000).
 * Verifica automáticamente que cada resultado esté ordenado.
 * Ejecutar: node src/laboratorio.js
 */

const { generarCatalogo, casiOrdenado } = require("./generador");
const {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSortAleatorio,
} = require("./ordenamiento");

/**
 * @typedef {Object} Libro
 * @property {string} isbn
 * @property {string} titulo
 * @property {string} autor
 * @property {number} anio
 * @property {number} prestamos
 */

/**
 * Comparador por año ascendente.
 * @param {Libro} a
 * @param {Libro} b
 * @returns {number}
 */
function compararPorAnio(a, b) {
  return a.anio - b.anio;
}

/**
 * Verifica si el arreglo está ordenado por año ascendente.
 * @param {Libro[]} arr
 * @returns {boolean}
 */
function estaOrdenado(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1].anio > arr[i].anio) return false;
  }
  return true;
}

/**
 * Ejecuta un algoritmo y devuelve métricas.
 * @param {(arr:Libro[], cmp:(a:Libro,b:Libro)=>number)=>{arreglo:Libro[],comparaciones:number,intercambios:number,desplazamientos:number,pasadas:number}} algFn
 * @param {Libro[]} datos
 * @param {(a:Libro,b:Libro)=>number} comparar
 * @returns {{comparaciones:number, intercambios:number, desplazamientos:number, tiempoMs:number, ordenado:boolean}}
 */
function medirAlgoritmo(algFn, datos, comparar) {
  const copia = datos.slice();
  const t0 = process.hrtime.bigint();
  const res = algFn(copia, comparar);
  const t1 = process.hrtime.bigint();
  const tiempoMs = Number(t1 - t0) / 1e6;
  return {
    comparaciones: res.comparaciones,
    intercambios: res.intercambios,
    desplazamientos: res.desplazamientos,
    tiempoMs,
    ordenado: estaOrdenado(res.arreglo),
  };
}

/**
 * Genera los datos para un estado dado (sin sort nativo).
 * @param {number} n
 * @param {string} estado
 * @returns {Libro[]}
 */
function generarEstado(n, estado) {
  if (estado === "Aleatorio") {
    return generarCatalogo(n);
  }
  if (estado === "Ordenado") {
    return mergeSort(generarCatalogo(n), compararPorAnio).arreglo;
  }
  if (estado === "Invertido") {
    return mergeSort(generarCatalogo(n), (a, b) => b.anio - a.anio).arreglo;
  }
  if (estado === "Casi ordenado") {
    return casiOrdenado(n, 20);
  }
  return generarCatalogo(n);
}

/**
 * Ejecuta el laboratorio completo.
 * @returns {{filas: any[], todosOk: boolean}}
 */
function ejecutarLaboratorio() {
  const basicos = [
    { nombre: "Bubble Sort", fn: bubbleSort },
    { nombre: "Selection Sort", fn: selectionSort },
    { nombre: "Insertion Sort", fn: insertionSort },
  ];
  const avanzados = [
    { nombre: "Merge Sort", fn: mergeSort },
    { nombre: "Quick Sort (aleatorio)", fn: quickSortAleatorio },
  ];

  // Configuración: básicos hasta 10.000, avanzados hasta 100.000
  /** @type {{n:number, estados:string[], algoritmos:{nombre:string, fn:any}[]}[]} */
  const configuraciones = [
    { n: 1000, estados: ["Aleatorio", "Ordenado", "Invertido", "Casi ordenado"], algoritmos: basicos.concat(avanzados) },
    { n: 10000, estados: ["Aleatorio", "Ordenado", "Invertido", "Casi ordenado"], algoritmos: basicos.concat(avanzados) },
    { n: 100000, estados: ["Aleatorio"], algoritmos: avanzados },
  ];

  /** @type {any[]} */
  const filas = [];
  let todosOk = true;

  for (const cfg of configuraciones) {
    for (const estado of cfg.estados) {
      const datos = generarEstado(cfg.n, estado);
      for (const alg of cfg.algoritmos) {
        const m = medirAlgoritmo(alg.fn, datos, compararPorAnio);
        const verificacion = m.ordenado ? "OK" : "FALLA";
        if (!m.ordenado) todosOk = false;
        filas.push({
          n: cfg.n,
          estado,
          algoritmo: alg.nombre,
          comparaciones: m.comparaciones,
          intercambios: m.intercambios,
          "tiempo (ms)": Number(m.tiempoMs.toFixed(3)),
          verificacion,
        });
      }
    }
  }

  return { filas, todosOk };
}

function main() {
  console.log("=== Laboratorio de rendimiento - Catálogo Libro Abierto v1.0 ===");
  console.log("Cinco algoritmos: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort (aleatorio)");
  console.log("Tamaños: 1.000, 10.000 y 100.000 libros (algoritmos básicos solo hasta 10.000)");
  console.log("Estados: Aleatorio, Ordenado, Invertido, Casi ordenado (100.000 en Aleatorio para avanzados)\n");

  const { filas, todosOk } = ejecutarLaboratorio();

  console.log("--- Tabla de resultados ---");
  console.table(filas);

  console.log("--- Resumen 100.000 libros (Merge Sort y Quick Sort) ---");
  const filas100k = filas.filter((f) => f.n === 100000);
  console.table(filas100k);
  const ambosRapidos = filas100k.every((f) => f["tiempo (ms)"] < 1000 && f.verificacion === "OK");
  console.log(`¿Merge Sort y Quick Sort terminan en < 1000 ms con 100.000 libros? ${ambosRapidos ? "Sí" : "No"}`);

  if (todosOk) {
    console.log("\nVerificación automática: sin resultados FALLA (todos los algoritmos ordenan correctamente).");
  } else {
    console.log("\nVerificación automática: se detectaron resultados FALLA.");
  }
}

if (require.main === module) {
  main();
}

module.exports = { ejecutarLaboratorio, estaOrdenado, compararPorAnio };
