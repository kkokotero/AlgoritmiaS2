/**
 * Algoritmos de ordenamiento: Bubble Sort, Selection Sort e Insertion Sort.
 * Todos reciben (arreglo, comparar) y devuelven los mismos contadores.
 * comparar(a, b) debe retornar < 0 si a < b, 0 si iguales, > 0 si a > b.
 */

/**
 * @typedef {{comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number, traza:(any[])[]}} Contadores
 */

/**
 * Bubble Sort (intercambio de adyacentes). Optimizado: se detiene si no hay intercambios.
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @param {{traza?: boolean}} [opciones]
 * @returns {{arreglo:T[], comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number, traza?:T[][]}}
 */
function bubbleSort(arreglo, comparar, opciones) {
  const opts = opciones || {};
  const arr = arreglo.slice();
  let comparaciones = 0;
  let intercambios = 0;
  let desplazamientos = 0;
  let pasadas = 0;
  /** @type {T[][]} */
  const traza = [];

  for (let i = 0; i < arr.length - 1; i++) {
    let huboIntercambio = false;
    pasadas++;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      comparaciones++;
      if (comparar(arr[j], arr[j + 1]) > 0) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        intercambios++;
        huboIntercambio = true;
      }
    }
    if (opts.traza) traza.push(arr.slice());
    if (!huboIntercambio) break;
  }

  const resultado = { arreglo: arr, comparaciones, intercambios, desplazamientos, pasadas };
  if (opts.traza) resultado.traza = traza;
  return resultado;
}

/**
 * Selection Sort (búsqueda del mínimo e intercambio con la posición actual).
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @param {{traza?: boolean}} [opciones]
 * @returns {{arreglo:T[], comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number, traza?:T[][]}}
 */
function selectionSort(arreglo, comparar, opciones) {
  const opts = opciones || {};
  const arr = arreglo.slice();
  let comparaciones = 0;
  let intercambios = 0;
  let desplazamientos = 0;
  let pasadas = 0;
  /** @type {T[][]} */
  const traza = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    pasadas++;
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      comparaciones++;
      if (comparar(arr[j], arr[minIndex]) < 0) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      intercambios++;
    }
    if (opts.traza) traza.push(arr.slice());
  }

  const resultado = { arreglo: arr, comparaciones, intercambios, desplazamientos, pasadas };
  if (opts.traza) resultado.traza = traza;
  return resultado;
}

/**
 * Insertion Sort (inserción por desplazamiento de elementos mayores).
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @param {{traza?: boolean}} [opciones]
 * @returns {{arreglo:T[], comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number, traza?:T[][]}}
 */
function insertionSort(arreglo, comparar, opciones) {
  const opts = opciones || {};
  const arr = arreglo.slice();
  let comparaciones = 0;
  let intercambios = 0;
  let desplazamientos = 0;
  let pasadas = 0;
  /** @type {T[][]} */
  const traza = [];

  for (let i = 1; i < arr.length; i++) {
    pasadas++;
    const actual = arr[i];
    let j = i - 1;
    while (j >= 0) {
      comparaciones++;
      if (comparar(arr[j], actual) > 0) {
        arr[j + 1] = arr[j];
        desplazamientos++;
        j--;
      } else {
        break;
      }
    }
    if (j + 1 !== i) {
      arr[j + 1] = actual;
      desplazamientos++;
    }
    if (opts.traza) traza.push(arr.slice());
  }

  const resultado = { arreglo: arr, comparaciones, intercambios, desplazamientos, pasadas };
  if (opts.traza) resultado.traza = traza;
  return resultado;
}

const comparadores = require("./comparadores");

module.exports = { bubbleSort, selectionSort, insertionSort, ...comparadores };
