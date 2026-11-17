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


  /**
   * Calcula el tamaño de forma recursiva (usa auxiliar que recibe un nodo).
   * @returns {number} Cantidad de nodos.
   */
  tamanioRecursivo() {
    return this._tamanioNodo(this.cabeza);
  }

  /**
   * Auxiliar recursivo para contar nodos.
   * @param {Nodo<Atencion> | null} nodo - Nodo actual.
   * @returns {number} Cantidad de nodos desde este nodo.
   */
  _tamanioNodo(nodo) {
    if (nodo === null) {
      return 0;
    }
    return 1 + this._tamanioNodo(nodo.siguiente);
  }

  /**
   * Calcula el costo total de forma recursiva.
   * @returns {number} Suma de costos.
   */
  costoTotalRecursivo() {
    return this._costoNodo(this.cabeza);
  }

  /**
   * Auxiliar recursivo para sumar costos.
   * @param {Nodo<Atencion> | null} nodo - Nodo actual.
   * @returns {number} Suma de costos desde este nodo.
   */
  _costoNodo(nodo) {
    if (nodo === null) {
      return 0;
    }
    return nodo.dato.costo + this._costoNodo(nodo.siguiente);
  }

  /**
   * Busca el primer dato que cumple la condición de forma recursiva.
   * @param {(dato: Atencion) => boolean} condicion - Condición de búsqueda.
   * @returns {Atencion | null} Dato encontrado o null.
   */
  buscarRecursivo(condicion) {
    return this._buscarNodo(this.cabeza, condicion);
  }

  /**
   * Auxiliar recursivo para buscar.
   * @param {Nodo<Atencion> | null} nodo - Nodo actual.
   * @param {(dato: Atencion) => boolean} condicion - Condición de búsqueda.
   * @returns {Atencion | null} Dato encontrado o null.
   */
  _buscarNodo(nodo, condicion) {
    if (nodo === null) {
      return null;
    }
    if (condicion(nodo.dato)) {
      return nodo.dato;
    }
    return this._buscarNodo(nodo.siguiente, condicion);
  }

  /**
   * Imprime el historial en orden inverso (más reciente a más antigua) sin arreglos ni pilas explícitas.
   * @returns {void}
   */
  imprimirAlReves() {
    this._imprimirNodoAlReves(this.cabeza);
  }

  /**
   * Auxiliar recursivo: desciende hasta el final y imprime al retornar.
   * @param {Nodo<Atencion> | null} nodo - Nodo actual.
   * @returns {void}
   */
  _imprimirNodoAlReves(nodo) {
    if (nodo === null) {
      return;
    }
    this._imprimirNodoAlReves(nodo.siguiente);
    const { fecha, motivo, veterinario, costo } = nodo.dato;
    console.log(`  - ${fecha} | ${motivo} | ${veterinario} | ${costo}`);
  }

}

module.exports = ListaEnlazada;
