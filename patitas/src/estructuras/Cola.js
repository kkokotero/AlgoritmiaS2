const Nodo = require("./Nodo");

/**
 * @template T
 * Cola (FIFO) basada en nodos con referencias a frente y final.
 */
class Cola {
  /**
   * Crea una cola vacía.
   */
  constructor() {
    /** @type {Nodo<T> | null} */
    this.frente = null;
    /** @type {Nodo<T> | null} */
    this.final = null;
    /** @type {number} */
    this._tamanio = 0;
  }

  /**
   * Indica si la cola está vacía.
   * @returns {boolean} `true` si no hay elementos.
   */
  estaVacia() {
    return this._tamanio === 0;
  }

  /**
   * Devuelve la cantidad de elementos en la cola.
   * @returns {number} Tamaño de la cola.
   */
  tamanio() {
    return this._tamanio;
  }

  /**
   * Agrega un elemento al final de la cola. O(1)
   * @param {T} dato - Dato a encolar.
   * @returns {void}
   */
  encolar(dato) {
    const nuevo = new Nodo(dato);
    if (this.estaVacia()) {
      this.frente = nuevo;
      this.final = nuevo;
    } else {
      if (this.final) {
        this.final.siguiente = nuevo;
      }
      this.final = nuevo;
    }
    this._tamanio += 1;
  }

  /**
   * Retira y devuelve el elemento del frente de la cola. O(1)
   * @returns {T | null} Dato del frente o `null` si la cola está vacía.
   */
  desencolar() {
    if (this.estaVacia() || this.frente === null) {
      return null;
    }
    const dato = this.frente.dato;
    this.frente = this.frente.siguiente;
    if (this.frente === null) {
      this.final = null;
    }
    this._tamanio -= 1;
    return dato;
  }

  /**
   * Devuelve el dato del frente sin retirarlo. O(1)
   * @returns {T | null} Dato del frente o `null` si la cola está vacía.
   */
  verFrente() {
    if (this.estaVacia() || this.frente === null) {
      return null;
    }
    return this.frente.dato;
  }
}

module.exports = Cola;
