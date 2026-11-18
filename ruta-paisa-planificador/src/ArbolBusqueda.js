/**
 * Árbol binario de búsqueda (BST) para indexar estaciones por código numérico.
 * Propiedad: códigos menores a la izquierda, mayores a la derecha.
 */

/**
 * Nodo de un árbol binario.
 */
class NodoBinario {
  /**
   * @param {number} codigo - Código numérico de la estación (clave).
   * @param {string} estacion - Nombre de la estación.
   */
  constructor(codigo, estacion) {
    this.codigo = codigo;
    this.estacion = estacion;
    /** @type {NodoBinario | null} */
    this.izquierdo = null;
    /** @type {NodoBinario | null} */
    this.derecho = null;
  }
}

/**
 * Árbol binario de búsqueda de estaciones.
 */
class ArbolBusqueda {
  constructor() {
    /** @type {NodoBinario | null} */
    this.raiz = null;
  }

  /**
   * Inserta una estación por su código.
   * Si el código ya existe, no se inserta un nuevo nodo y se mantiene
   * la estación registrada originalmente (se ignora el duplicado).
   * @param {number} codigo - Código numérico de la estación.
   * @param {string} estacion - Nombre de la estación.
   * @returns {void}
   */
  insertar(codigo, estacion) {
    const nuevo = new NodoBinario(codigo, estacion);
    if (this.raiz === null) {
      this.raiz = nuevo;
      return;
    }

    let actual = this.raiz;
    while (actual !== null) {
      if (codigo === actual.codigo) {
        // Código repetido: se ignora (se conserva el primero)
        return;
      } else if (codigo < actual.codigo) {
        if (actual.izquierdo === null) {
          actual.izquierdo = nuevo;
          return;
        }
        actual = actual.izquierdo;
      } else {
        if (actual.derecho === null) {
          actual.derecho = nuevo;
          return;
        }
        actual = actual.derecho;
      }
    }
  }

  /**
   * Busca una estación por código.
   * @param {number} codigo - Código a buscar.
   * @returns {{estacion: string, comparaciones: number} | null} Estación y comparaciones, o null si no existe.
   */
  buscar(codigo) {
    let actual = this.raiz;
    let comparaciones = 0;

    while (actual !== null) {
      comparaciones++;
      if (codigo === actual.codigo) {
        return { estacion: actual.estacion, comparaciones };
      } else if (codigo < actual.codigo) {
        actual = actual.izquierdo;
      } else {
        actual = actual.derecho;
      }
    }

    return null;
  }

  /**
   * Recorrido inorden (izquierdo, raíz, derecho).
   * @param {(nodo: NodoBinario) => void} callback - Función a ejecutar por nodo.
   * @returns {void}
   */
  inorden(callback) {
    /**
     * @param {NodoBinario | null} nodo
     */
    const recorrer = (nodo) => {
      if (nodo === null) return;
      recorrer(nodo.izquierdo);
      callback(nodo);
      recorrer(nodo.derecho);
    };
    recorrer(this.raiz);
  }

  /**
   * Recorrido preorden (raíz, izquierdo, derecho).
   * @param {(nodo: NodoBinario) => void} callback - Función a ejecutar por nodo.
   * @returns {void}
   */
  preorden(callback) {
    /**
     * @param {NodoBinario | null} nodo
     */
    const recorrer = (nodo) => {
      if (nodo === null) return;
      callback(nodo);
      recorrer(nodo.izquierdo);
      recorrer(nodo.derecho);
    };
    recorrer(this.raiz);
  }

  /**
   * Recorrido postorden (izquierdo, derecho, raíz).
   * @param {(nodo: NodoBinario) => void} callback - Función a ejecutar por nodo.
   * @returns {void}
   */
  postorden(callback) {
    /**
     * @param {NodoBinario | null} nodo
     */
    const recorrer = (nodo) => {
      if (nodo === null) return;
      recorrer(nodo.izquierdo);
      recorrer(nodo.derecho);
      callback(nodo);
    };
    recorrer(this.raiz);
  }

  /**
   * Calcula la altura del árbol en número de aristas (recursivo).
   * Árbol vacío: -1. Hoja: 0.
   * @returns {number}
   */
  altura() {
    /**
     * @param {NodoBinario | null} nodo
     * @returns {number}
     */
    const calcular = (nodo) => {
      if (nodo === null) return -1;
      const altIzq = calcular(nodo.izquierdo);
      const altDer = calcular(nodo.derecho);
      return 1 + (altIzq > altDer ? altIzq : altDer);
    };
    return calcular(this.raiz);
  }

  /**
   * Cuenta las hojas del árbol (nodos sin hijos), recursivo.
   * @returns {number}
   */
  contarHojas() {
    /**
     * @param {NodoBinario | null} nodo
     * @returns {number}
     */
    const contar = (nodo) => {
      if (nodo === null) return 0;
      if (nodo.izquierdo === null && nodo.derecho === null) return 1;
      return contar(nodo.izquierdo) + contar(nodo.derecho);
    };
    return contar(this.raiz);
  }

  /**
   * Cuenta el total de nodos del árbol.
   * @returns {number}
   */
  contarNodos() {
    /**
     * @param {NodoBinario | null} nodo
     * @returns {number}
     */
    const contar = (nodo) => {
      if (nodo === null) return 0;
      return 1 + contar(nodo.izquierdo) + contar(nodo.derecho);
    };
    return contar(this.raiz);
  }
}

if (require.main === module) {
  const arbol = new ArbolBusqueda();

  /** @type {[number, string][]} */
  const estaciones = [
    [50, "San Antonio"],
    [30, "Caribe"],
    [70, "Poblado"],
    [20, "Bello"],
    [40, "Hospital"],
    [60, "Exposiciones"],
    [80, "Itagüí"],
    [10, "Niquía"],
    [25, "Acevedo"],
    [35, "Universidad"],
    [45, "Parque Berrío"],
    [52, "Cisneros"],
    [56, "Estadio"],
    [65, "Industriales"],
    [90, "La Estrella"],
    [27, "Andalucía"],
    [29, "Santo Domingo"],
    [54, "Suramericana"],
    [58, "Floresta"],
    [59, "San Javier"],
  ];

  for (const [codigo, nombre] of estaciones) {
    arbol.insertar(codigo, nombre);
  }

  console.log("=== Búsquedas en el ABB (20 estaciones insertadas) ===");
  /** @type {[number, string, string][]} */
  const consultas = [
    [50, "San Antonio", "raíz"],
    [59, "San Javier", "hoja profunda"],
    [10, "Niquía", "hoja"],
    [40, "Hospital", "intermedia"],
    [33, "(inexistente)", "no existe"],
  ];

  for (const [codigo, etiqueta, nota] of consultas) {
    const res = arbol.buscar(codigo);
    if (res === null) {
      console.log(`buscar(${codigo}) [${etiqueta}, ${nota}] -> null`);
    } else {
      console.log(`buscar(${codigo}) [${etiqueta}, ${nota}] -> estación: ${res.estacion}, comparaciones: ${res.comparaciones}`);
    }
  }
}

module.exports = { NodoBinario, ArbolBusqueda };
