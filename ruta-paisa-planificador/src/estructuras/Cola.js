/**
 * Cola (FIFO) implementada con arreglo e índice de cabeza para operaciones O(1) amortizado.
 * Se utiliza en recorridos BFS para explorar por niveles.
 * @template T
 */
class Cola {
  constructor() {
    /** @type {T[]} */
    this._datos = [];
    this._cabeza = 0;
  }

  /**
   * Agrega un elemento al final de la cola.
   * @param {T} elemento
   * @returns {void}
   */
  encolar(elemento) {
    this._datos.push(elemento);
  }

  /**
   * Extrae y devuelve el elemento al frente de la cola.
   * @returns {T | undefined}
   */
  desencolar() {
    if (this.estaVacia()) return undefined;
    const valor = this._datos[this._cabeza];
    this._cabeza++;
    // Compactar ocasionalmente para liberar memoria
    if (this._cabeza > 50 && this._cabeza * 2 > this._datos.length) {
      this._datos = this._datos.slice(this._cabeza);
      this._cabeza = 0;
    }
    return valor;
  }

  /**
   * Indica si la cola está vacía.
   * @returns {boolean}
   */
  estaVacia() {
    return this._cabeza >= this._datos.length;
  }

  /**
   * Número de elementos en la cola.
   * @returns {number}
   */
  tamanio() {
    return this._datos.length - this._cabeza;
  }
}

module.exports = Cola;
