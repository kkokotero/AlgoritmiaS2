/**
 * Ventana deslizante y dos punteros para análisis de Café Origen.
 */

/**
 * @typedef {Object} ResultadoSemana
 * @property {number} total - Suma máxima de k días.
 * @property {number} inicio - Índice (0-based) del día en que inicia la semana.
 */

/**
 * Mejor semana por fuerza bruta: suma cada bloque de k días desde cero.
 * Complejidad: O(n*k) tiempo, O(1) espacio auxiliar.
 *
 * @param {number[]} dias - Totales diarios.
 * @param {number} k - Tamaño de la ventana (días).
 * @returns {ResultadoSemana | null} Mejor ventana o null si k es inválido.
 */
function mejorSemanaBruta(dias, k) {
  if (!Array.isArray(dias) || k <= 0 || k > dias.length) {
    return null;
  }

  let maxTotal = -Infinity;
  let inicioMax = 0;

  for (let i = 0; i <= dias.length - k; i++) {
    let suma = 0;
    for (let j = i; j < i + k; j++) {
      suma += dias[j];
    }
    if (suma > maxTotal) {
      maxTotal = suma;
      inicioMax = i;
    }
  }

  return { total: maxTotal, inicio: inicioMax };
}

/**
 * Mejor semana con ventana deslizante de tamaño fijo.
 * Complejidad: O(n) tiempo, O(1) espacio auxiliar.
 *
 * @param {number[]} dias - Totales diarios.
 * @param {number} k - Tamaño de la ventana (días).
 * @returns {ResultadoSemana | null} Mejor ventana o null si k es inválido.
 */
function mejorSemana(dias, k) {
  if (!Array.isArray(dias) || k <= 0 || k > dias.length) {
    return null;
  }

  let sumaVentana = 0;
  for (let i = 0; i < k; i++) {
    sumaVentana += dias[i];
  }

  let maxTotal = sumaVentana;
  let inicioMax = 0;

  for (let i = k; i < dias.length; i++) {
    sumaVentana += dias[i] - dias[i - k];
    if (sumaVentana > maxTotal) {
      maxTotal = sumaVentana;
      inicioMax = i - k + 1;
    }
  }

  return { total: maxTotal, inicio: inicioMax };
}

/**
 * @typedef {import('./catalogo.js').ProductoCatalogo} ProductoCatalogo
 */

/**
 * Encuentra dos productos cuya suma sea la mayor posible sin superar el presupuesto.
 * Usa dos punteros sobre los precios ordenados de menor a mayor.
 * Complejidad: O(n log n) por ordenamiento + O(n) recorrido = O(n log n) tiempo, O(n) espacio.
 *
 * @param {ProductoCatalogo[]} productos - Catálogo de productos.
 * @param {number} presupuesto - Presupuesto máximo.
 * @returns {{ productos: [ProductoCatalogo, ProductoCatalogo], total: number } | null}
 */
function parMasCercano(productos, presupuesto) {
  if (!Array.isArray(productos) || productos.length < 2) {
    return null;
  }

  const ordenados = [...productos].sort((a, b) => a.precio - b.precio);
  let izquierda = 0;
  let derecha = ordenados.length - 1;
  /** @type {{ productos: [ProductoCatalogo, ProductoCatalogo], total: number } | null} */
  let mejor = null;

  while (izquierda < derecha) {
    const suma = ordenados[izquierda].precio + ordenados[derecha].precio;

    if (suma <= presupuesto) {
      if (!mejor || suma > mejor.total) {
        mejor = {
          productos: [ordenados[izquierda], ordenados[derecha]],
          total: suma,
        };
      }
      izquierda++;
    } else {
      derecha--;
    }
  }

  return mejor;
}

module.exports = {
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano,
};
