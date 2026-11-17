/**
 * Nodo de una lista enlazada que representa una atención clínica.
 */
class Nodo {
  /**
   * @param {{fecha: string, motivo: string, veterinario: string, costo: number}} dato - Atención clínica.
   */
  constructor(dato) {
    this.dato = dato;
    /** @type {Nodo | null} */
    this.siguiente = null;
  }
}

module.exports = Nodo;
