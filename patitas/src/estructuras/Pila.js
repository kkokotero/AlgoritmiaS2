/**
 * @template T
 * Pila (LIFO) implementada con un arreglo.
 * Se elige arreglo porque `push` y `pop` operan sobre el final en O(1) amortizado
 * (sin desplazamientos ni nodos adicionales), ofreciendo una implementación simple
 * y eficiente para el tope. Todas las operaciones expuestas son O(1).
 */
class Pila {
  /**
   * Crea una pila vacía.
   */
  constructor() {
    /** @type {T[]} */
    this._elementos = [];
  }

  /**
   * Apila un elemento en el tope. O(1)
   * @param {T} dato - Elemento a apilar.
   * @returns {void}
   */
  apilar(dato) {
    this._elementos.push(dato);
  }

  /**
   * Desapila y devuelve el elemento del tope. O(1)
   * @returns {T | null} Elemento del tope o `null` si la pila está vacía.
   */
  desapilar() {
    if (this.estaVacia()) {
      return null;
    }
    const dato = this._elementos.pop();
    return dato === undefined ? null : dato;
  }

  /**
   * Devuelve el elemento del tope sin retirarlo. O(1)
   * @returns {T | null} Elemento del tope o `null` si la pila está vacía.
   */
  verTope() {
    if (this.estaVacia()) {
      return null;
    }
    return this._elementos[this._elementos.length - 1];
  }

  /**
   * Indica si la pila está vacía. O(1)
   * @returns {boolean} `true` si no hay elementos.
   */
  estaVacia() {
    return this._elementos.length === 0;
  }

  /**
   * Devuelve la cantidad de elementos. O(1)
   * @returns {number} Tamaño de la pila.
   */
  tamanio() {
    return this._elementos.length;
  }

  /**
   * Vacía la pila. O(1) (reasigna la referencia interna)
   * @returns {void}
   */
  vaciar() {
    this._elementos = [];
  }

  /**
   * Devuelve una representación de los elementos (base -> tope) para trazas.
   * @returns {T[]} Copia de los elementos.
   */
  aArreglo() {
    return [...this._elementos];
  }
}

module.exports = Pila;
