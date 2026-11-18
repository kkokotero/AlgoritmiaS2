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

module.exports = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mezclar,
  mergeSort,
  particion,
  quickSort,
  quickSortAleatorio,
  ...comparadores,
};

/**
 * Partición de Lomuto: pivote = último elemento (arreglo[fin]).
 * Reordena en el lugar y devuelve el índice final del pivote.
 * @template T
 * @param {T[]} arreglo
 * @param {number} inicio
 * @param {number} fin
 * @param {(a:T,b:T)=>number} comparar
 * @param {{comparaciones:number, intercambios:number}} contadores
 * @returns {number}
 */
function particion(arreglo, inicio, fin, comparar, contadores) {
  const pivote = arreglo[fin];
  let i = inicio - 1;
  for (let j = inicio; j < fin; j++) {
    contadores.comparaciones++;
    if (comparar(arreglo[j], pivote) <= 0) {
      i++;
      if (i !== j) {
        const temp = arreglo[i];
        arreglo[i] = arreglo[j];
        arreglo[j] = temp;
        contadores.intercambios++;
      }
    }
  }
  const posPivote = i + 1;
  if (posPivote !== fin) {
    const temp = arreglo[posPivote];
    arreglo[posPivote] = arreglo[fin];
    arreglo[fin] = temp;
    contadores.intercambios++;
  }
  return posPivote;
}

/**
 * Quick Sort recursivo (pivote fijo: último elemento). Recurre en el lado menor
 * e itera en el mayor para limitar la profundidad de pila a O(log n).
 * @template T
 * @param {T[]} arreglo
 * @param {number} inicio
 * @param {number} fin
 * @param {(a:T,b:T)=>number} comparar
 * @param {{comparaciones:number, intercambios:number}} contadores
 */
function quickSortRec(arreglo, inicio, fin, comparar, contadores) {
  let lo = inicio;
  let hi = fin;
  while (lo < hi) {
    const p = particion(arreglo, lo, hi, comparar, contadores);
    // Recurse on smaller partition, iterate on larger
    if (p - lo < hi - p) {
      quickSortRec(arreglo, lo, p - 1, comparar, contadores);
      lo = p + 1;
    } else {
      quickSortRec(arreglo, p + 1, hi, comparar, contadores);
      hi = p - 1;
    }
  }
}

/**
 * Quick Sort con pivote fijo (último elemento). Trabaja sobre una copia.
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @returns {{arreglo:T[], comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number}}
 */
function quickSort(arreglo, comparar) {
  const arr = arreglo.slice();
  const contadores = { comparaciones: 0, intercambios: 0 };
  if (arr.length > 1) {
    quickSortRec(arr, 0, arr.length - 1, comparar, contadores);
  }
  return {
    arreglo: arr,
    comparaciones: contadores.comparaciones,
    intercambios: contadores.intercambios,
    desplazamientos: 0,
    pasadas: 0,
  };
}

/**
 * Quick Sort recursivo con pivote aleatorio.
 * @template T
 * @param {T[]} arreglo
 * @param {number} inicio
 * @param {number} fin
 * @param {(a:T,b:T)=>number} comparar
 * @param {{comparaciones:number, intercambios:number}} contadores
 */
function quickSortAleatorioRec(arreglo, inicio, fin, comparar, contadores) {
  let lo = inicio;
  let hi = fin;
  while (lo < hi) {
    const aleatorio = lo + Math.floor(Math.random() * (hi - lo + 1));
    if (aleatorio !== hi) {
      const tmp = arreglo[aleatorio];
      arreglo[aleatorio] = arreglo[hi];
      arreglo[hi] = tmp;
      contadores.intercambios++;
    }
    const p = particion(arreglo, lo, hi, comparar, contadores);
    if (p - lo < hi - p) {
      quickSortAleatorioRec(arreglo, lo, p - 1, comparar, contadores);
      lo = p + 1;
    } else {
      quickSortAleatorioRec(arreglo, p + 1, hi, comparar, contadores);
      hi = p - 1;
    }
  }
}

/**
 * Quick Sort con pivote aleatorio. Trabaja sobre una copia.
 * @template T
 * @param {T[]} arreglo
 * @param {(a:T,b:T)=>number} comparar
 * @returns {{arreglo:T[], comparaciones:number, intercambios:number, desplazamientos:number, pasadas:number}}
 */
function quickSortAleatorio(arreglo, comparar) {
  const arr = arreglo.slice();
  const contadores = { comparaciones: 0, intercambios: 0 };
  if (arr.length > 1) {
    quickSortAleatorioRec(arr, 0, arr.length - 1, comparar, contadores);
  }
  return {
    arreglo: arr,
    comparaciones: contadores.comparaciones,
    intercambios: contadores.intercambios,
    desplazamientos: 0,
    pasadas: 0,
  };
}
