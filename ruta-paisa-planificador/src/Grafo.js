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
   * No duplica vecinos si la conexión ya existe. Guarda la línea de la conexión.
   * @param {number} a - Código de la primera estación.
   * @param {number} b - Código de la segunda estación.
   * @param {string | null} [linea=null] - Línea a la que pertenece la conexión.
   * @returns {void}
   */
  conectar(a, b, linea = null) {
    this.agregarEstacion(a);
    this.agregarEstacion(b);

    const vecinosA = this.adyacencia.get(a);
    const vecinosB = this.adyacencia.get(b);
    if (!vecinosA || !vecinosB) return;

    let existeAB = false;
    for (const v of vecinosA) {
      if (v.codigo === b) { existeAB = true; break; }
    }
    if (!existeAB) {
      vecinosA.push({ codigo: b, linea: linea });
    }

    let existeBA = false;
    for (const v of vecinosB) {
      if (v.codigo === a) { existeBA = true; break; }
    }
    if (!existeBA) {
      vecinosB.push({ codigo: a, linea: linea });
    }
  }

  /**
   * Devuelve los vecinos (adyacentes) de una estación como códigos.
   * @param {number} codigo - Código de la estación.
   * @returns {number[]} Arreglo de códigos vecinos.
   */
  vecinos(codigo) {
    const lista = this.adyacencia.get(codigo);
    if (!lista) return [];
    const res = [];
    for (const v of lista) res.push(v.codigo);
    return res;
  }

  /**
   * Devuelve los vecinos con la línea de cada conexión.
   * @param {number} codigo - Código de la estación.
   * @returns {{codigo:number, linea:string|null}[]} Vecinos con línea.
   */
  vecinosConLinea(codigo) {
    const lista = this.adyacencia.get(codigo);
    if (!lista) return [];
    return lista.map((v) => ({ codigo: v.codigo, linea: v.linea }));
  }

  /**
   * Obtiene la línea de la conexión directa entre a y b, si existe.
   * @param {number} a
   * @param {number} b
   * @returns {string|null}
   */
  obtenerLineaConexion(a, b) {
    const lista = this.adyacencia.get(a);
    if (!lista) return null;
    for (const v of lista) {
      if (v.codigo === b) return v.linea;
    }
    return null;
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

  /**
   * Recorrido en profundidad (DFS) recursivo.
   * Devuelve las estaciones alcanzables desde inicio sin pasar por estaciones cerradas.
   * @param {number} inicio - Código de la estación inicial.
   * @param {Set<number>} [cerradas] - Conjunto de estaciones cerradas (no transitables).
   * @returns {number[]} Estaciones alcanzables en orden de visita.
   */
  dfs(inicio, cerradas) {
    const cerr = cerradas || new Set();
    /** @type {Set<number>} */
    const visitados = new Set();
    /** @type {number[]} */
    const resultado = [];

    if (!this.adyacencia.has(inicio) || cerr.has(inicio)) {
      return resultado;
    }

    const visitar = (actual) => {
      visitados.add(actual);
      resultado.push(actual);
      const ady = this.adyacencia.get(actual) || [];
      for (const v of ady) {
        const vecino = v.codigo;
        if (!visitados.has(vecino) && !cerr.has(vecino)) {
          visitar(vecino);
        }
      }
    };

    visitar(inicio);
    return resultado;
  }

  /**
   * Recorrido en profundidad (DFS) iterativo con pila explícita.
   * Devuelve las estaciones alcanzables desde inicio sin pasar por estaciones cerradas.
   * @param {number} inicio - Código de la estación inicial.
   * @param {Set<number>} [cerradas] - Conjunto de estaciones cerradas (no transitables).
   * @returns {number[]} Estaciones alcanzables.
   */
  dfsIterativo(inicio, cerradas) {
    const cerr = cerradas || new Set();
    /** @type {Set<number>} */
    const visitados = new Set();
    /** @type {number[]} */
    const resultado = [];

    if (!this.adyacencia.has(inicio) || cerr.has(inicio)) {
      return resultado;
    }

    /** @type {number[]} */
    const pila = [inicio];
    while (pila.length > 0) {
      const actual = pila.pop();
      if (actual === undefined) continue;
      if (visitados.has(actual) || cerr.has(actual)) continue;
      visitados.add(actual);
      resultado.push(actual);
      const ady = this.adyacencia.get(actual) || [];
      // Apilar en orden inverso para visitar en el mismo orden que la lista de adyacencia
      for (let i = ady.length - 1; i >= 0; i--) {
        const vecino = ady[i].codigo;
        if (!visitados.has(vecino) && !cerr.has(vecino)) {
          pila.push(vecino);
        }
      }
    }

    return resultado;
  }

  /**
   * Obtiene los componentes conectados considerando estaciones cerradas.
   * Cada componente es un grupo de estaciones conectadas entre sí (excluye cerradas).
   * @param {Set<number>} [cerradas] - Conjunto de estaciones cerradas.
   * @returns {number[][]} Arreglo de componentes (cada uno es un arreglo de códigos).
   */
  componentes(cerradas) {
    const cerr = cerradas || new Set();
    /** @type {Set<number>} */
    const visitadosGlobal = new Set();
    /** @type {number[][]} */
    const grupos = [];

    for (const codigo of this.adyacencia.keys()) {
      if (cerr.has(codigo) || visitadosGlobal.has(codigo)) continue;

      // DFS para obtener el componente desde este nodo
      /** @type {number[]} */
      const componente = [];
      /** @type {number[]} */
      const pila = [codigo];
      /** @type {Set<number>} */
      const visitadosComp = new Set();

      while (pila.length > 0) {
        const actual = pila.pop();
        if (actual === undefined) continue;
        if (visitadosComp.has(actual) || cerr.has(actual)) continue;
        visitadosComp.add(actual);
        visitadosGlobal.add(actual);
        componente.push(actual);
        const ady = this.adyacencia.get(actual) || [];
        for (const v of ady) {
          const vecino = v.codigo;
          if (!visitadosComp.has(vecino) && !cerr.has(vecino)) {
            pila.push(vecino);
          }
        }
      }

      if (componente.length > 0) {
        grupos.push(componente);
      }
    }

    return grupos;
  }

  /**
   * Recorrido en anchura (BFS) para encontrar la ruta con menor número de tramos.
   * @param {number} origen - Código de estación origen.
   * @param {number} destino - Código de estación destino.
   * @param {Set<number>} [cerradas] - Estaciones cerradas (no transitables).
   * @returns {number[] | null} Camino de códigos desde origen a destino, o null si no existe.
   */
  bfs(origen, destino, cerradas) {
    const cerr = cerradas || new Set();

    if (!this.adyacencia.has(origen) || !this.adyacencia.has(destino)) return null;
    if (cerr.has(origen) || cerr.has(destino)) return null;
    if (origen === destino) return [origen];

    /** @type {Set<number>} */
    const visitados = new Set([origen]);
    /** @type {Map<number, number>} */
    const padre = new Map();
    /** @type {number[]} */
    const cola = [origen];
    let cabeza = 0;
    let encontrado = false;

    while (cabeza < cola.length) {
      const actual = cola[cabeza++];
      const ady = this.adyacencia.get(actual) || [];
      for (const v of ady) {
        const vecino = v.codigo;
        if (visitados.has(vecino) || cerr.has(vecino)) continue;
        visitados.add(vecino);
        padre.set(vecino, actual);
        if (vecino === destino) {
          encontrado = true;
          break;
        }
        cola.push(vecino);
      }
      if (encontrado) break;
    }

    if (!encontrado) return null;

    // Reconstruir camino desde destino hacia origen
    /** @type {number[]} */
    const camino = [];
    let actual = destino;
    while (actual !== undefined) {
      camino.push(actual);
      if (actual === origen) break;
      const p = padre.get(actual);
      if (p === undefined) break;
      actual = p;
    }
    camino.reverse();
    return camino;
  }
}

module.exports = Grafo;
