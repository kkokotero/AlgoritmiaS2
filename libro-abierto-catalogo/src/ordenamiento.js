/**
 * Algoritmos de ordenamiento: Bubble, Selection, Insertion y Merge Sort.
 * Todos reciben (arreglo, comparar) y devuelven contadores.
 * comparar(a, b) debe retornar < 0 si a < b, 0 si iguales, > 0 si a > b.
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

/**
 * Mezcla dos arreglos ya ordenados en uno solo ordenado.
 * Usa dos índices y no emplea sort. Mantiene estabilidad (<= toma de izquierda si son iguales).
 * @template T
 * @param {T[]} izquierda - Arreglo ordenado.
 * @param {T[]} derecha - Arreglo ordenado.
 * @param {(a:T,b:T)=>number} comparar - Comparador.
 * @param {{comparaciones:number, desplazamientos:number}} [contadores] - Contadores opcionales.
 * @returns {T[]} Arreglo mezclado y ordenado.
 */
function mezclar(izquierda, derecha, comparar, contadores) {
  const cont = contadores || { comparaciones: 0, desplazamientos: 0 };
  /** @type {T[]} */
  const resultado = [];
  let i = 0;
  let j = 0;

  while (i < izquierda.length && j < derecha.length) {
    cont.comparaciones++;
    if (comparar(izquierda[i], derecha[j]) <= 0) {
      resultado.push(izquierda[i]);
      cont.desplazamientos++;
      i++;
    } else {
      resultado.push(derecha[j]);
      cont.desplazamientos++;
      j++;
    }
  }

  while (i < izquierda.length) {
    resultado.push(izquierda[i]);
    cont.desplazamientos++;
    i++;
  }

  while (j < derecha.length) {
    resultado.push(derecha[j]);
    cont.desplazamientos++;
    j++;
  }

  return resultado;
}

/**
 * Implementación recursiva interna de Merge Sort.
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @param {{comparaciones:number, desplazamientos:number}} contadores
 * @returns {T[]}
 */
function mergeSortRec(arreglo, comparar, contadores) {
  if (arreglo.length <= 1) {
    return arreglo.slice();
  }
  const medio = Math.floor(arreglo.length / 2);
  const izquierda = arreglo.slice(0, medio);
  const derecha = arreglo.slice(medio);
  const izqOrdenada = mergeSortRec(izquierda, comparar, contadores);
  const derOrdenada = mergeSortRec(derecha, comparar, contadores);
  return mezclar(izqOrdenada, derOrdenada, comparar, contadores);
}

/**
 * Merge Sort recursivo (divide y vencerás, estable).
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @returns {{arreglo:T[], comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number}}
 */
function mergeSort(arreglo, comparar) {
  const contadores = { comparaciones: 0, desplazamientos: 0 };
  const resultado = mergeSortRec(arreglo, comparar, contadores);
  return {
    arreglo: resultado,
    comparaciones: contadores.comparaciones,
    intercambios: 0,
    desplazamientos: contadores.desplazamientos,
    pasadas: 0,
  };
}

const comparadores = require("./comparadores");

module.exports = { bubbleSort, selectionSort, insertionSort, mezclar, mergeSort, ...comparadores };
