const Nodo = require("./Nodo");

/**
 * Lista enlazada simple con referencias a cabeza y cola.
 */
class ListaEnlazada {
  constructor() {
    /** @type {Nodo | null} */
    this.cabeza = null;
    /** @type {Nodo | null} */
    this.cola = null;
    /** @type {number} */
    this.tamanio = 0;
  }

  /**
   * Indica si la lista no tiene nodos.
   * @returns {boolean}
   */
  estaVacia() {
    return this.tamanio === 0;
  }

  /**
   * Devuelve la cantidad de nodos.
   * @returns {number}
   */
  obtenerTamanio() {
    return this.tamanio;
  }

  /**
   * Agrega un dato al final de la lista. O(1)
   * @param {{fecha: string, motivo: string, veterinario: string, costo: number}} dato
   * @returns {void}
   */
  agregarAlFinal(dato) {
    const nuevo = new Nodo(dato);
    if (this.estaVacia()) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      if (this.cola) {
        this.cola.siguiente = nuevo;
      }
      this.cola = nuevo;
    }
    this.tamanio += 1;
  }

  /**
   * Agrega un dato al inicio de la lista. O(1)
   * @param {{fecha: string, motivo: string, veterinario: string, costo: number}} dato
   * @returns {void}
   */
  agregarAlInicio(dato) {
    const nuevo = new Nodo(dato);
    if (this.estaVacia()) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      nuevo.siguiente = this.cabeza;
      this.cabeza = nuevo;
    }
    this.tamanio += 1;
  }

  /**
   * Ejecuta un callback por cada dato de la lista.
   * @param {(dato: {fecha: string, motivo: string, veterinario: string, costo: number}) => void} callback
   * @returns {void}
   */
  recorrer(callback) {
    let actual = this.cabeza;
    while (actual !== null) {
      callback(actual.dato);
      actual = actual.siguiente;
    }
  }

  /**
   * Devuelve los datos en un arreglo en orden.
   * @returns {{fecha: string, motivo: string, veterinario: string, costo: number}[]}
   */
  aArreglo() {
    /** @type {{fecha: string, motivo: string, veterinario: string, costo: number}[]} */
    const datos = [];
    this.recorrer((dato) => datos.push(dato));
    return datos;
  }
}

module.exports = ListaEnlazada;
