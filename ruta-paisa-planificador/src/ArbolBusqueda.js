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
