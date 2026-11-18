/**
 * Nodo de un árbol general.
 * Contiene un valor y un arreglo de hijos.
 */
class NodoArbol {
  /**
   * @param {any} valor - Valor almacenado en el nodo.
   */
  constructor(valor) {
    this.valor = valor;
    /** @type {NodoArbol[]} */
    this.hijos = [];
  }

  /**
   * Agrega un nodo hijo a este nodo.
   * @param {NodoArbol} nodo - Nodo hijo a agregar.
   * @returns {NodoArbol} El nodo agregado.
   */
  agregarHijo(nodo) {
    this.hijos.push(nodo);
    return nodo;
  }
}

module.exports = NodoArbol;
