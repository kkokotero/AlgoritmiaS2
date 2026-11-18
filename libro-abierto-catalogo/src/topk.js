/**
 * Top-K: ranking de libros más prestados.
 * Dos estrategias: ordenamiento completo (Merge Sort) y selección parcial (k pasadas).
 */

const { mergeSort } = require("./ordenamiento");
const { porPrestamosDesc } = require("./comparadores");

/**
 * Devuelve los k libros más prestados ordenando una copia con Merge Sort
 * por préstamos de mayor a menor y tomando los primeros k.
 * Complejidad: O(n log n) por el ordenamiento + O(k) por el corte.
 * @template {{prestamos:number}} T
 * @param {T[]} libros - Catálogo de libros.
 * @param {number} k - Cantidad de libros del ranking.
 * @returns {{resultado: T[], comparaciones: number}} Top k y comparaciones del ordenamiento.
 */
function topPrestados(libros, k) {
  const limite = Math.min(Math.max(0, k), libros.length);
  const ordenado = mergeSort(libros, porPrestamosDesc);
  return {
    resultado: ordenado.arreglo.slice(0, limite),
    comparaciones: ordenado.comparaciones,
  };
}

/**
 * Devuelve los k libros más prestados haciendo k pasadas para buscar
 * el máximo restante (selección parcial, similar a k pasos de Selection Sort).
 * Complejidad: O(k * n) comparaciones en total.
 * @template {{prestamos:number}} T
 * @param {T[]} libros - Catálogo de libros.
 * @param {number} k - Cantidad de libros del ranking.
 * @returns {{resultado: T[], comparaciones: number}} Top k y comparaciones realizadas.
 */
function topPrestadosSeleccion(libros, k) {
  const arr = libros.slice();
  const limite = Math.min(Math.max(0, k), arr.length);
  let comparaciones = 0;

  for (let i = 0; i < limite; i++) {
    let maxIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      comparaciones++;
      if (arr[j].prestamos > arr[maxIdx].prestamos) {
        maxIdx = j;
      }
    }
    if (maxIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[maxIdx];
      arr[maxIdx] = temp;
    }
  }

  return {
    resultado: arr.slice(0, limite),
    comparaciones,
  };
}

module.exports = { topPrestados, topPrestadosSeleccion };
