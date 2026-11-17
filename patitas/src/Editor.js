const Pila = require("./Pila");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 * @typedef {{tipo: "agregar", mascota: string, atencion: Atencion} | {tipo: "eliminar", mascota: string, atencion: Atencion, indice: number}} Accion
 */

/**
 * Editor con deshacer/rehacer sobre un RegistroClinico usando dos pilas.
 */
class Editor {
  /**
   * @param {import("./RegistroClinico")} registro - Registro clínico a editar.
   */
  constructor(registro) {
    /** @type {import("./RegistroClinico")} */
    this.registro = registro;
    /** @type {Pila<Accion>} */
    this.pilaDeshacer = new Pila();
    /** @type {Pila<Accion>} */
    this.pilaRehacer = new Pila();
  }

  /**
   * Agrega una atención al historial de una mascota.
   * @param {string} mascota - Nombre de la mascota.
   * @param {Atencion} atencion - Atención a agregar.
   * @returns {void}
   */
  agregar(mascota, atencion) {
    this.registro.registrarAtencion(mascota, atencion);
    this.pilaDeshacer.apilar({ tipo: "agregar", mascota, atencion });
    this.pilaRehacer.vaciar();
  }

  /**
   * Elimina la primera atención que cumpla la condición.
   * @param {string} mascota - Nombre de la mascota.
   * @param {(dato: Atencion) => boolean} condicion - Condición de eliminación.
   * @returns {Atencion | null} Atención eliminada o `null` si no se encontró.
   */
  eliminar(mascota, condicion) {
    const historial = this.registro.obtenerHistorial(mascota);
    if (!historial) {
      return null;
    }

    const arreglo = historial.aArreglo();
    const indice = arreglo.findIndex(condicion);
    if (indice === -1) {
      return null;
    }

    const eliminado = historial.eliminar(condicion);
    if (eliminado) {
      this.pilaDeshacer.apilar({ tipo: "eliminar", mascota, atencion: eliminado, indice });
      this.pilaRehacer.vaciar();
    }
    return eliminado;
  }

  /**
   * Deshace la última acción. O(1) respecto a pilas (la operación inversa puede ser O(n)).
   * @returns {boolean} `true` si se deshizo una acción.
   */
  deshacer() {
    const accion = this.pilaDeshacer.desapilar();
    if (!accion) {
      return false;
    }

    if (accion.tipo === "agregar") {
      const historial = this.registro.obtenerHistorial(accion.mascota);
      if (historial) {
        historial.eliminar((d) => d === accion.atencion);
      }
    } else if (accion.tipo === "eliminar") {
      if (!this.registro.obtenerHistorial(accion.mascota)) {
        this.registro.historiales.set(accion.mascota, new (require("./ListaEnlazada"))());
      }
      const historial = this.registro.obtenerHistorial(accion.mascota);
      if (historial) {
        historial.insertarEn(accion.indice, accion.atencion);
      }
    }

    this.pilaRehacer.apilar(accion);
    return true;
  }

  /**
   * Rehace la última acción deshecha. O(1) respecto a pilas.
   * @returns {boolean} `true` si se rehizo una acción.
   */
  rehacer() {
    const accion = this.pilaRehacer.desapilar();
    if (!accion) {
      return false;
    }

    if (accion.tipo === "agregar") {
      this.registro.registrarAtencion(accion.mascota, accion.atencion);
    } else if (accion.tipo === "eliminar") {
      const historial = this.registro.obtenerHistorial(accion.mascota);
      if (historial) {
        historial.eliminar((d) => d === accion.atencion);
      }
    }

    this.pilaDeshacer.apilar(accion);
    return true;
  }

  /**
   * Devuelve el estado de las pilas para trazas.
   * @returns {{ deshacer: string[], rehacer: string[] }}
   */
  estadoPilas() {
    const etiqueta = (/** @type {Accion} */ a) =>
      a.tipo === "agregar"
        ? `agregar(${a.mascota}:${a.atencion.fecha})`
        : `eliminar(${a.mascota}:${a.atencion.fecha}@${a.indice})`;
    return {
      deshacer: this.pilaDeshacer.aArreglo().map(etiqueta),
      rehacer: this.pilaRehacer.aArreglo().map(etiqueta),
    };
  }
}

module.exports = Editor;
