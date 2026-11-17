/**
 * @template T
 * Nodo de una estructura enlazada.
 */
class Nodo {
  /**
   * @param {T} dato - Dato almacenado en el nodo.
   */
  constructor(dato) {
    /** @type {T} */
    this.dato = dato;
    /** @type {Nodo<T> | null} */
    this.siguiente = null;
  }
}

module.exports = Nodo;
