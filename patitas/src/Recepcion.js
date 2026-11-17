const Cola = require("./Cola");

/**
 * @typedef {{hora: string, mascota: string, tipo: "Urgencia" | "General", motivo: string}} TurnoLlegada
 */

/**
 * Recepción con dos colas de prioridad: urgencias y generales.
 */
class Recepcion {
  constructor() {
    /** @type {Cola<TurnoLlegada>} */
    this.urgencias = new Cola();
    /** @type {Cola<TurnoLlegada>} */
    this.generales = new Cola();
  }

  /**
   * Registra la llegada de un turno en la cola correspondiente.
   * @param {TurnoLlegada} turno - Turno de llegada.
   * @returns {void}
   */
  registrarLlegada(turno) {
    if (turno.tipo === "Urgencia") {
      this.urgencias.encolar(turno);
    } else {
      this.generales.encolar(turno);
    }
  }

  /**
   * Llama al siguiente turno a atender (prioridad: urgencias, luego generales).
   * @returns {TurnoLlegada | null} Siguiente turno o `null` si no hay nadie esperando.
   */
  llamarSiguiente() {
    if (!this.urgencias.estaVacia()) {
      return this.urgencias.desencolar();
    }
    if (!this.generales.estaVacia()) {
      return this.generales.desencolar();
    }
    return null;
  }

  /**
   * Intenta llamar al siguiente con validación de seguridad.
   * Si la sala/cola de espera está vacía, muestra un mensaje y no falla.
   * @returns {TurnoLlegada | null} Siguiente turno o `null` si no hay nadie esperando.
   */
  llamarSiguienteSeguro() {
    if (!this.hayEsperando()) {
      console.log("Aviso: no hay mascotas en espera (sala vacía). No se puede llamar al siguiente.");
      return null;
    }
    return this.llamarSiguiente();
  }

  /**
   * Indica si hay turnos esperando en alguna cola.
   * @returns {boolean} `true` si hay alguien esperando.
   */
  hayEsperando() {
    return !this.urgencias.estaVacia() || !this.generales.estaVacia();
  }
}

module.exports = Recepcion;
