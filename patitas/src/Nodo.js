/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/**
 * Nodo de una lista enlazada que representa una atención clínica.
 */
class Nodo {
  /**
   * @param {Atencion} dato - Atención clínica almacenada en el nodo.
   */
  constructor(dato) {
    /** @type {Atencion} */
    this.dato = dato;
    /** @type {Nodo | null} */
    this.siguiente = null;
  }
}

module.exports = Nodo;
