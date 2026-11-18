/**
 * Grafo no dirigido con lista de adyacencia.
 * Cada estación se identifica por su código numérico.
 */
class Grafo {
  constructor() {
    /** @type {Map<number, number[]>} */
    this.adyacencia = new Map();
  }

  /**
   * Agrega una estación (vértice) si no existe.
   * @param {number} codigo - Código de la estación.
   * @returns {void}
   */
  agregarEstacion(codigo) {
    if (!this.adyacencia.has(codigo)) {
      this.adyacencia.set(codigo, []);
    }
  }

  /**
   * Conecta dos estaciones en ambos sentidos (arista no dirigida).
   * No duplica vecinos si la conexión ya existe.
   * @param {number} a - Código de la primera estación.
   * @param {number} b - Código de la segunda estación.
   * @returns {void}
   */
  conectar(a, b) {
    this.agregarEstacion(a);
    this.agregarEstacion(b);

    const vecinosA = this.adyacencia.get(a);
    const vecinosB = this.adyacencia.get(b);
    if (!vecinosA || !vecinosB) return;

    if (vecinosA.indexOf(b) === -1) {
      vecinosA.push(b);
    }
    if (vecinosB.indexOf(a) === -1) {
      vecinosB.push(a);
    }
  }

  /**
   * Devuelve los vecinos (adyacentes) de una estación.
   * @param {number} codigo - Código de la estación.
   * @returns {number[]} Arreglo de códigos vecinos.
   */
  vecinos(codigo) {
    const lista = this.adyacencia.get(codigo);
    return lista ? lista.slice() : [];
  }

  /**
   * Devuelve el grado de una estación (número de vecinos).
   * @param {number} codigo - Código de la estación.
   * @returns {number} Grado del vértice.
   */
  grado(codigo) {
    const lista = this.adyacencia.get(codigo);
    return lista ? lista.length : 0;
  }

  /**
   * Número de estaciones (vértices).
   * @returns {number}
   */
  numeroEstaciones() {
    return this.adyacencia.size;
  }

  /**
   * Número de conexiones (aristas) en el grafo no dirigido.
   * @returns {number}
   */
  numeroConexiones() {
    let sumaGrados = 0;
    for (const lista of this.adyacencia.values()) {
      sumaGrados += lista.length;
    }
    return sumaGrados / 2;
  }
}

module.exports = Grafo;
