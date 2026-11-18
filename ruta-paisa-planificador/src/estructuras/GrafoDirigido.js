/**
 * Grafo dirigido con lista de adyacencia.
 * Usado para modelar dependencias entre tareas (arista u -> v: u debe terminar antes de v).
 */
class GrafoDirigido {
  constructor() {
    /** @type {Map<string|number, (string|number)[]>} */
    this.adyacencia = new Map();
  }

  /**
   * Agrega un vértice si no existe.
   * @param {string|number} id
   * @returns {void}
   */
  agregarVertice(id) {
    if (!this.adyacencia.has(id)) {
      this.adyacencia.set(id, []);
    }
  }

  /**
   * Agrega una arista dirigida desde -> hasta (solo en un sentido).
   * No duplica la arista si ya existe.
   * @param {string|number} desde
   * @param {string|number} hasta
   * @returns {void}
   */
  agregarArista(desde, hasta) {
    this.agregarVertice(desde);
    this.agregarVertice(hasta);
    const vecinos = this.adyacencia.get(desde);
    if (!vecinos) return;
    let existe = false;
    for (const v of vecinos) {
      if (v === hasta) { existe = true; break; }
    }
    if (!existe) vecinos.push(hasta);
  }

  /**
   * Número de vértices.
   * @returns {number}
   */
  numeroVertices() {
    return this.adyacencia.size;
  }

  /**
   * Número de aristas dirigidas.
   * @returns {number}
   */
  numeroAristas() {
    let total = 0;
    for (const vecinos of this.adyacencia.values()) {
      total += vecinos.length;
    }
    return total;
  }

  /**
   * Detecta si el grafo dirigido tiene ciclos usando DFS con tres estados:
   * "sin_visitar", "en_proceso" (en la pila/recursión actual), "terminada".
   * Si durante el recorrido se llega a un vértice "en_proceso", existe un ciclo.
   * @returns {{hayCiclo: boolean, ciclo: (string|number)[]|null}}
   *   ciclo: arreglo con las tareas que forman el ciclo (incluye el nodo repetido al final),
   *   o null si no hay ciclo.
   */
  tieneCiclo() {
    /** @type {Map<string|number, "sin_visitar"|"en_proceso"|"terminada">} */
    const estado = new Map();
    /** @type {Map<string|number, string|number|null>} */
    const padre = new Map();
    /** @type {(string|number)[]|null} */
    let cicloEncontrado = null;

    for (const v of this.adyacencia.keys()) {
      estado.set(v, "sin_visitar");
      padre.set(v, null);
    }

    /**
     * @param {string|number} actual
     * @returns {boolean} true si encontró ciclo
     */
    const dfs = (actual) => {
      estado.set(actual, "en_proceso");
      const vecinos = this.adyacencia.get(actual) || [];
      for (const vecino of vecinos) {
        const estVecino = estado.get(vecino);
        if (estVecino === "en_proceso") {
          // Se encontró arista de retorno a un nodo en proceso -> ciclo
          cicloEncontrado = this._reconstruirCiclo(padre, vecino, actual);
          return true;
        }
        if (estVecino === "sin_visitar") {
          padre.set(vecino, actual);
          if (dfs(vecino)) return true;
        }
        // si "terminada", no hay ciclo por esa arista
      }
      estado.set(actual, "terminada");
      return false;
    };

    for (const v of this.adyacencia.keys()) {
      if (estado.get(v) === "sin_visitar") {
        if (dfs(v)) {
          return { hayCiclo: true, ciclo: cicloEncontrado };
        }
      }
    }

    return { hayCiclo: false, ciclo: null };
  }

  /**
   * Reconstruye el ciclo desde el nodo donde se cierra (inicioCiclo) hasta 'actual'
   * siguiendo los padres, y lo devuelve en orden del ciclo terminando en inicioCiclo.
   * Normaliza el ciclo para que inicie en el nodo lexicográficamente menor (presentación consistente).
   * @param {Map<string|number, string|number|null>} padre
   * @param {string|number} inicioCiclo - Nodo en proceso alcanzado de nuevo.
   * @param {string|number} actual - Nodo actual desde el que se detectó la arista de retorno.
   * @returns {(string|number)[]}
   */
  _reconstruirCiclo(padre, inicioCiclo, actual) {
    /** @type {(string|number)[]} */
    const camino = [];
    let cur = actual;
    while (cur !== inicioCiclo && cur !== null && cur !== undefined) {
      camino.push(cur);
      const p = padre.get(cur);
      cur = p === undefined ? null : p;
    }
    // camino: [actual, ..., hijo_de_inicioCiclo]; formar inicioCiclo -> ... -> actual -> inicioCiclo
    camino.push(inicioCiclo);
    camino.reverse();
    camino.push(inicioCiclo); // cerrar el ciclo mostrando el retorno

    // Rotar para iniciar en el nodo lexicográficamente menor (ej. T3 → T4 → T5 → T3)
    const unicos = camino.slice(0, -1);
    if (unicos.length > 0) {
      let minIdx = 0;
      for (let i = 1; i < unicos.length; i++) {
        if (String(unicos[i]) < String(unicos[minIdx])) minIdx = i;
      }
      const rot = unicos.slice(minIdx).concat(unicos.slice(0, minIdx));
      rot.push(rot[0]);
      return rot;
    }
    return camino;
  }

  /**
   * Obtiene un orden de ejecución válido (ordenamiento topológico) usando DFS.
   * Se basa en el orden de finalización: al terminar de explorar un vértice se antepone
   * (o se apila y luego se invierte), garantizando que cada tarea aparezca después de sus requisitos.
   * Lanza error si el grafo tiene ciclos.
   * @returns {(string|number)[]} Orden topológico de los vértices.
   */
  ordenDeEjecucion() {
    const { hayCiclo, ciclo } = this.tieneCiclo();
    if (hayCiclo) {
      const detalle = ciclo ? ciclo.join(" → ") : "desconocido";
      throw new Error(`No se puede obtener un orden de ejecución: el grafo tiene un ciclo (${detalle}).`);
    }

    /** @type {Map<string|number, "sin_visitar"|"en_proceso"|"terminada">} */
    const estado = new Map();
    /** @type {(string|number)[]} */
    const pilaFinalizacion = [];

    for (const v of this.adyacencia.keys()) {
      estado.set(v, "sin_visitar");
    }

    /**
     * @param {string|number} actual
     */
    const dfs = (actual) => {
      estado.set(actual, "en_proceso");
      const vecinos = this.adyacencia.get(actual) || [];
      for (const vecino of vecinos) {
        if (estado.get(vecino) === "sin_visitar") {
          dfs(vecino);
        }
      }
      estado.set(actual, "terminada");
      // Al terminar, se registra: el orden inverso de finalización es un orden topológico
      pilaFinalizacion.push(actual);
    };

    for (const v of this.adyacencia.keys()) {
      if (estado.get(v) === "sin_visitar") {
        dfs(v);
      }
    }

    pilaFinalizacion.reverse();
    return pilaFinalizacion;
  }
}

module.exports = GrafoDirigido;
