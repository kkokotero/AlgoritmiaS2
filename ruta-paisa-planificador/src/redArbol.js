/**
 * Construcción y funciones recursivas del árbol general de la red Ruta Paisa.
 * Ejecutar: node src/red.js
 */

const NodoArbol = require("./NodoArbol");

/**
 * Imprime el árbol con sangría según el nivel.
 * @param {NodoArbol} nodo - Nodo raíz del subárbol a imprimir.
 * @param {number} [nivel=0] - Nivel de profundidad (0 = raíz).
 * @returns {void}
 */
function imprimirArbol(nodo, nivel) {
  const n = nivel === undefined ? 0 : nivel;
  const sangria = "  ".repeat(n);
  const prefijo = n === 0 ? "" : "- ";
  console.log(`${sangria}${prefijo}${nodo.valor}`);
  for (let i = 0; i < nodo.hijos.length; i++) {
    imprimirArbol(nodo.hijos[i], n + 1);
  }
}

/**
 * Cuenta el total de nodos del árbol (recursivo).
 * @param {NodoArbol} nodo - Nodo raíz del subárbol.
 * @returns {number} Total de nodos.
 */
function contarNodos(nodo) {
  let total = 1;
  for (let i = 0; i < nodo.hijos.length; i++) {
    total += contarNodos(nodo.hijos[i]);
  }
  return total;
}

/**
 * Cuenta las hojas del árbol (nodos sin hijos), recursivo.
 * @param {NodoArbol} nodo - Nodo raíz del subárbol.
 * @returns {number} Número de hojas.
 */
function contarHojas(nodo) {
  if (nodo.hijos.length === 0) {
    return 1;
  }
  let hojas = 0;
  for (let i = 0; i < nodo.hijos.length; i++) {
    hojas += contarHojas(nodo.hijos[i]);
  }
  return hojas;
}

/**
 * Calcula la altura del árbol en número de aristas (recursivo).
 * Una hoja tiene altura 0.
 * @param {NodoArbol} nodo - Nodo raíz del subárbol.
 * @returns {number} Altura.
 */
function altura(nodo) {
  if (nodo.hijos.length === 0) {
    return 0;
  }
  let maxAlturaHijo = 0;
  for (let i = 0; i < nodo.hijos.length; i++) {
    const h = altura(nodo.hijos[i]);
    if (h > maxAlturaHijo) {
      maxAlturaHijo = h;
    }
  }
  return 1 + maxAlturaHijo;
}

/**
 * Crea un nodo de estación con su nombre e id.
 * @param {string} nombre
 * @param {number} id
 * @returns {NodoArbol}
 */
function estacion(nombre, id) {
  return new NodoArbol(`${nombre} (${id})`);
}

/**
 * Construye el árbol general de la red piloto Ruta Paisa.
 * @returns {NodoArbol} Raíz del árbol.
 */
function construirRed() {
  const raiz = new NodoArbol("Red Ruta Paisa");

  // Línea A
  const lineaA = new NodoArbol("Línea A");
  raiz.agregarHijo(lineaA);
  const estacionesA = [
    estacion("Niquía", 10),
    estacion("Bello", 20),
    estacion("Caribe", 30),
    estacion("Universidad", 35),
    estacion("Hospital", 40),
    estacion("Parque Berrío", 45),
    estacion("San Antonio", 50),
    estacion("Exposiciones", 60),
    estacion("Industriales", 65),
    estacion("Poblado", 70),
    estacion("Itagüí", 80),
    estacion("La Estrella", 90),
  ];
  for (let i = 0; i < estacionesA.length; i++) {
    lineaA.agregarHijo(estacionesA[i]);
  }

  // Línea B
  const lineaB = new NodoArbol("Línea B");
  raiz.agregarHijo(lineaB);
  const estacionesB = [
    estacion("San Antonio", 50),
    estacion("Cisneros", 52),
    estacion("Suramericana", 54),
    estacion("Estadio", 56),
    estacion("Floresta", 58),
    estacion("San Javier", 59),
  ];
  for (let i = 0; i < estacionesB.length; i++) {
    lineaB.agregarHijo(estacionesB[i]);
  }

  // Línea K
  const lineaK = new NodoArbol("Línea K");
  raiz.agregarHijo(lineaK);
  const estacionesK = [
    estacion("Caribe", 30),
    estacion("Acevedo", 25),
    estacion("Andalucía", 27),
    estacion("Santo Domingo", 29),
  ];
  for (let i = 0; i < estacionesK.length; i++) {
    lineaK.agregarHijo(estacionesK[i]);
  }

  // Servicios (hijos de estaciones específicas)
  // San Antonio (aparición en Línea A): Bicicletas públicas y Ascensor
  const sanAntonioLineaA = estacionesA[6];
  sanAntonioLineaA.agregarHijo(new NodoArbol("Bicicletas públicas"));
  sanAntonioLineaA.agregarHijo(new NodoArbol("Ascensor"));

  // Poblado (Línea A): Parqueadero
  const pobladoLineaA = estacionesA[9];
  pobladoLineaA.agregarHijo(new NodoArbol("Parqueadero"));

  return raiz;
}

if (require.main === module) {
  const red = construirRed();
  console.log("=== Árbol de la red Ruta Paisa ===");
  imprimirArbol(red);

  console.log("\n=== Métricas recursivas ===");
  console.log(`Total de nodos (contarNodos): ${contarNodos(red)}`);
  console.log(`Total de hojas (contarHojas): ${contarHojas(red)}`);
  console.log(`Altura del árbol (altura, en aristas): ${altura(red)}`);
}

module.exports = {
  NodoArbol,
  imprimirArbol,
  contarNodos,
  contarHojas,
  altura,
  construirRed,
};
