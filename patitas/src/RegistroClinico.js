const ListaEnlazada = require("./ListaEnlazada");

/**
 * Registro clínico que mantiene un historial por mascota.
 */
class RegistroClinico {
  constructor() {
    /** @type {Map<string, ListaEnlazada>} */
    this.historiales = new Map();
  }

  /**
   * Registra una atención para una mascota, creando el historial si no existe.
   * @param {string} mascota
   * @param {{fecha: string, motivo: string, veterinario: string, costo: number}} atencion
   * @returns {void}
   */
  registrarAtencion(mascota, atencion) {
    if (!this.historiales.has(mascota)) {
      this.historiales.set(mascota, new ListaEnlazada());
    }
    const historial = this.historiales.get(mascota);
    if (historial) {
      historial.agregarAlFinal(atencion);
    }
  }

  /**
   * Obtiene el historial de una mascota.
   * @param {string} mascota
   * @returns {ListaEnlazada | undefined}
   */
  obtenerHistorial(mascota) {
    return this.historiales.get(mascota);
  }

  /**
   * Lista los nombres de mascotas registradas en orden de inserción.
   * @returns {string[]}
   */
  mascotas() {
    return [...this.historiales.keys()];
  }
}

module.exports = RegistroClinico;
