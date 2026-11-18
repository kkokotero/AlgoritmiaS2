/**
 * Laboratorio de rendimiento: comparación de algoritmos de ordenamiento.
 * Ejecuta Bubble, Selection, Insertion y sort nativo con 500, 1000, 2000 y 4000 libros
 * en cuatro estados (aleatorio, ordenado, invertido, casi ordenado).
 * Ejecutar: node src/laboratorio.js
 */

const { generarCatalogo, casiOrdenado } = require("./generador");
const { bubbleSort, selectionSort, insertionSort } = require("./ordenamiento");

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
 * Mide el tiempo de Array.prototype.sort como referencia.
 * @param {Libro[]} datos
 * @param {(a:Libro,b:Libro)=>number} comparar
 * @returns {{arreglo: Libro[], tiempoMs: number, ordenado: boolean}}
 */
function medirSortNativo(datos, comparar) {
  const copia = datos.slice();
  const t0 = process.hrtime.bigint();
  copia.sort(comparar);
  const t1 = process.hrtime.bigint();
  const tiempoMs = Number(t1 - t0) / 1e6;
  return { arreglo: copia, tiempoMs, ordenado: estaOrdenado(copia) };
}

/**
 * Ejecuta un algoritmo y devuelve métricas.
 * @param {(arr:Libro[], cmp:(a:Libro,b:Libro)=>number)=>{arreglo:Libro[],comparaciones:number,intercambios:number,desplazamientos:number,pasadas:number}} algFn
 * @param {Libro[]} datos
 * @param {(a:Libro,b:Libro)=>number} comparar
 * @returns {{comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number, tiempoMs:number, ordenado:boolean}}
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
    pasadas: res.pasadas,
    tiempoMs,
    ordenado: estaOrdenado(res.arreglo),
  };
}

/**
 * Genera los datos para un estado dado.
 * @param {number} n
 * @param {string} estado
 * @returns {Libro[]}
 */
function generarEstado(n, estado) {
  if (estado === "Aleatorio") {
    return generarCatalogo(n);
  }
  if (estado === "Ordenado") {
    return generarCatalogo(n).sort((a, b) => a.anio - b.anio);
  }
  if (estado === "Invertido") {
    return generarCatalogo(n).sort((a, b) => b.anio - a.anio);
  }
  if (estado === "Casi ordenado") {
    return casiOrdenado(n, 20);
  }
  return generarCatalogo(n);
}

/**
 * Ejecuta el laboratorio completo.
 * @returns {{filas: any[], resumenCrecimiento: any[]}}
 */
function ejecutarLaboratorio() {
  const tamanos = [500, 1000, 2000, 4000];
  const estados = ["Aleatorio", "Ordenado", "Invertido", "Casi ordenado"];
  const algoritmos = [
    { nombre: "Bubble Sort", fn: bubbleSort },
    { nombre: "Selection Sort", fn: selectionSort },
    { nombre: "Insertion Sort", fn: insertionSort },
  ];

  /** @type {any[]} */
  const filas = [];
  /** @type {Record<string, Record<string, Record<number, number>>>} */
  const tiempos = {};

  for (const n of tamanos) {
    for (const estado of estados) {
      const datos = generarEstado(n, estado);

      for (const alg of algoritmos) {
        const m = medirAlgoritmo(alg.fn, datos, compararPorAnio);
        const verificacion = m.ordenado ? "OK" : "FALLA";
        filas.push({
          n,
          estado,
          algoritmo: alg.nombre,
          comparaciones: m.comparaciones,
          intercambios: m.intercambios,
          desplazamientos: m.desplazamientos,
          "tiempo (ms)": Number(m.tiempoMs.toFixed(3)),
          verificacion,
        });
        if (!tiempos[alg.nombre]) tiempos[alg.nombre] = {};
        if (!tiempos[alg.nombre][estado]) tiempos[alg.nombre][estado] = {};
        tiempos[alg.nombre][estado][n] = m.tiempoMs;
      }

      // sort nativo como referencia de tiempo
      const s = medirSortNativo(datos, compararPorAnio);
      const verificacionSort = s.ordenado ? "OK" : "FALLA";
      filas.push({
        n,
        estado,
        algoritmo: "sort (nativo)",
        comparaciones: "-",
        intercambios: "-",
        desplazamientos: "-",
        "tiempo (ms)": Number(s.tiempoMs.toFixed(3)),
        verificacion: verificacionSort,
      });
      if (!tiempos["sort (nativo)"]) tiempos["sort (nativo)"] = {};
      if (!tiempos["sort (nativo)"][estado]) tiempos["sort (nativo)"][estado] = {};
      tiempos["sort (nativo)"][estado][n] = s.tiempoMs;
    }
  }

  // Resumen de crecimiento al duplicar n
  /** @type {any[]} */
  const resumenCrecimiento = [];
  const pares = [
    [500, 1000],
    [1000, 2000],
    [2000, 4000],
  ];
  const nombres = ["Bubble Sort", "Selection Sort", "Insertion Sort", "sort (nativo)"];
  for (const estado of estados) {
    for (const nombre of nombres) {
      for (const [n1, n2] of pares) {
        const t1 = tiempos[nombre] && tiempos[nombre][estado] ? tiempos[nombre][estado][n1] : undefined;
        const t2 = tiempos[nombre] && tiempos[nombre][estado] ? tiempos[nombre][estado][n2] : undefined;
        if (t1 !== undefined && t2 !== undefined) {
          const razon = t1 > 0 ? t2 / t1 : null;
          resumenCrecimiento.push({
            algoritmo: nombre,
            estado,
            de: n1,
            a: n2,
            "t1 (ms)": Number(t1.toFixed(3)),
            "t2 (ms)": Number(t2.toFixed(3)),
            "razón (t2/t1)": razon !== null ? Number(razon.toFixed(2)) : "-",
          });
        }
      }
    }
  }

  return { filas, resumenCrecimiento };
}

function main() {
  console.log("=== Laboratorio de rendimiento - Catálogo Libro Abierto v0.2 ===");
  console.log("Algoritmos: Bubble Sort, Selection Sort, Insertion Sort y sort nativo (referencia)");
  console.log("Tamaños: 500, 1000, 2000, 4000 libros | Estados: Aleatorio, Ordenado, Invertido, Casi ordenado\n");

  const { filas, resumenCrecimiento } = ejecutarLaboratorio();

  console.log("--- Tabla de resultados (comparaciones, intercambios y tiempo) ---");
  console.table(filas);

  const fallas = filas.filter((f) => f.verificacion === "FALLA");
  if (fallas.length === 0) {
    console.log("Verificación automática: sin resultados FALLA (todos los algoritmos ordenan correctamente).\n");
  } else {
    console.log(`Verificación automática: ${fallas.length} resultado(s) con FALLA.\n`);
  }

  console.log("--- Crecimiento del tiempo al duplicar n (t2/t1) ---");
  console.table(resumenCrecimiento);

  console.log("Nota: para algoritmos O(n²) se espera que al duplicar n el tiempo crezca ~4 veces (salvo casos favorables como datos ordenados/casi ordenados).");
}

if (require.main === module) {
  main();
}

module.exports = { ejecutarLaboratorio, estaOrdenado, compararPorAnio };
