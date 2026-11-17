const Nodo = require("./Nodo");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/**
 * Lista enlazada simple con referencias a cabeza y cola.
 */
class ListaEnlazada {
  /**
   * Crea una lista enlazada vacía.
   */
  constructor() {
    /** @type {Nodo<Atencion> | null} */
    this.cabeza = null;
    /** @type {Nodo<Atencion> | null} */
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

  /**
   * Inserta un dato en la posición indicada (0 = inicio). O(n)
   * @param {number} indice - Posición de inserción.
   * @param {Atencion} dato - Dato a insertar.
   * @returns {boolean} `true` si se insertó, `false` si el índice es inválido.
   */
  insertarEn(indice, dato) {
    if (indice < 0 || indice > this.tamanio) {
      return false;
    }
    if (indice === 0) {
      this.agregarAlInicio(dato);
      return true;
    }
    if (indice === this.tamanio) {
      this.agregarAlFinal(dato);
      return true;
    }

    let anterior = this.cabeza;
    let i = 0;
    while (anterior !== null && i < indice - 1) {
      anterior = anterior.siguiente;
      i += 1;
    }
    if (anterior === null) {
      return false;
    }
    const nuevo = new Nodo(dato);
    nuevo.siguiente = anterior.siguiente;
    anterior.siguiente = nuevo;
    this.tamanio += 1;
    return true;
  }

  /**
   * Busca el primer dato que cumple la condición. O(n)
   * @param {(dato: {fecha: string, motivo: string, veterinario: string, costo: number}) => boolean} condicion
   * @returns {{fecha: string, motivo: string, veterinario: string, costo: number} | null}
   */
  buscar(condicion) {
    let actual = this.cabeza;
    while (actual !== null) {
      if (condicion(actual.dato)) {
        return actual.dato;
      }
      actual = actual.siguiente;
    }
    return null;
  }

  /**
   * Inserta un dato después del primer nodo que cumpla la condición. O(n)
   * Si el nodo encontrado es la cola, actualiza la cola.
   * @param {(dato: {fecha: string, motivo: string, veterinario: string, costo: number}) => boolean} condicion
   * @param {{fecha: string, motivo: string, veterinario: string, costo: number}} dato
   * @returns {boolean} true si insertó, false si no encontró
   */
  insertarDespuesDe(condicion, dato) {
    let actual = this.cabeza;
    while (actual !== null) {
      if (condicion(actual.dato)) {
        const nuevo = new Nodo(dato);
        nuevo.siguiente = actual.siguiente;
        actual.siguiente = nuevo;
        if (actual === this.cola) {
          this.cola = nuevo;
        }
        this.tamanio += 1;
        return true;
      }
      actual = actual.siguiente;
    }
    return false;
  }

  /**
   * Elimina el primer nodo que cumpla la condición y devuelve su dato. O(n)
   * @param {(dato: {fecha: string, motivo: string, veterinario: string, costo: number}) => boolean} condicion
   * @returns {{fecha: string, motivo: string, veterinario: string, costo: number} | null}
   */
  eliminar(condicion) {
    if (this.cabeza === null) {
      return null;
    }

    // Caso: eliminar la cabeza
    if (condicion(this.cabeza.dato)) {
      const eliminado = this.cabeza.dato;
      this.cabeza = this.cabeza.siguiente;
      if (this.cabeza === null) {
        this.cola = null; // era el único nodo
      }
      this.tamanio -= 1;
      return eliminado;
    }

    // Caso: nodo intermedio o cola (se necesita anterior)
    let anterior = this.cabeza;
    let actual = this.cabeza.siguiente;
    while (actual !== null) {
      if (condicion(actual.dato)) {
        const eliminado = actual.dato;
        anterior.siguiente = actual.siguiente;
        if (actual === this.cola) {
          this.cola = anterior; // nueva cola
        }
        this.tamanio -= 1;
        return eliminado;
      }
      anterior = actual;
      actual = actual.siguiente;
    }

    return null;
  }
}

module.exports = ListaEnlazada;
