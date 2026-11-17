/**
 * Catálogo de productos de Café Origen para campaña de tarjetas regalo.
 *
 * @typedef {Object} ProductoCatalogo
 * @property {string} producto - Nombre del producto.
 * @property {number} precio - Precio en pesos colombianos.
 */

/** @type {ProductoCatalogo[]} */
const CATALOGO = [
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Filtros de papel x100", precio: 18000 },
  { producto: "Taza de cerámica", precio: 35000 },
  { producto: "Origen Huila 1 kg", precio: 79000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 },
];

/**
 * Busca dos productos distintos cuya suma sea el valor (fuerza bruta, O(n^2)).
 * Prueba todos los pares posibles.
 *
 * @param {ProductoCatalogo[]} catalogo - Catálogo de productos.
 * @param {number} valor - Valor objetivo de la tarjeta.
 * @returns {[ProductoCatalogo, ProductoCatalogo] | null} Par encontrado o null.
 */
function comboRegalo(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) {
        return [catalogo[i], catalogo[j]];
      }
    }
  }
  return null;
}

/**
 * Busca dos productos distintos cuya suma sea el valor usando complemento (O(n)).
 * Recorre el catálogo una sola vez y guarda precios ya vistos en un Map.
 *
 * @param {ProductoCatalogo[]} catalogo - Catálogo de productos.
 * @param {number} valor - Valor objetivo de la tarjeta.
 * @returns {[ProductoCatalogo, ProductoCatalogo] | null} Par encontrado o null.
 */
function comboRegaloOptimizado(catalogo, valor) {
  /** @type {Map<number, ProductoCatalogo>} */
  const vistos = new Map();

  for (const producto of catalogo) {
    const complemento = valor - producto.precio;
    if (vistos.has(complemento)) {
      const anterior = vistos.get(complemento);
      if (anterior) {
        return [anterior, producto];
      }
    }
    if (!vistos.has(producto.precio)) {
      vistos.set(producto.precio, producto);
    }
  }

  return null;
}

module.exports = {
  CATALOGO,
  comboRegalo,
  comboRegaloOptimizado,
};
