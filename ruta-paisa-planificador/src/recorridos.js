/**
 * Verificación de recorridos (inorden, preorden, postorden), altura y reconstrucción.
 * Ejecutar: node src/recorridos.js
 */

const { ArbolBusqueda } = require("./ArbolBusqueda");

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

/**
 * Construye el ABB original insertando en el orden dado.
 * @returns {ArbolBusqueda}
 */
function construirOriginal() {
  const arbol = new ArbolBusqueda();
  for (const [codigo, nombre] of estaciones) {
    arbol.insertar(codigo, nombre);
  }
  return arbol;
}

/**
 * Compara la estructura de dos árboles binarios (forma y códigos).
 * @param {import("./ArbolBusqueda").NodoBinario | null} a
 * @param {import("./ArbolBusqueda").NodoBinario | null} b
 * @returns {boolean}
 */
function mismaFormaNodos(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.codigo !== b.codigo) return false;
  return mismaFormaNodos(a.izquierdo, b.izquierdo) && mismaFormaNodos(a.derecho, b.derecho);
}

const original = construirOriginal();

/** @type {number[]} */
const inordenCodigos = [];
original.inorden((n) => inordenCodigos.push(n.codigo));

/** @type {number[]} */
const preordenCodigos = [];
original.preorden((n) => preordenCodigos.push(n.codigo));

/** @type {number[]} */
const postordenCodigos = [];
original.postorden((n) => postordenCodigos.push(n.codigo));

console.log("=== Recorridos del índice (ABB de estaciones) ===");
console.log(`Inorden  (${inordenCodigos.length}): ${inordenCodigos.join(", ")}`);
console.log(`Preorden (${preordenCodigos.length}): ${preordenCodigos.join(", ")}`);
console.log(`Postorden(${postordenCodigos.length}): ${postordenCodigos.join(", ")}`);

// Verificación inorden ascendente 10 a 90
const ascendente = inordenCodigos.every((c, i) => i === 0 || c > inordenCodigos[i - 1]);
console.log(`\n¿Inorden produce los 20 códigos en orden ascendente (10 a 90)? ${ascendente && inordenCodigos[0] === 10 && inordenCodigos[19] === 90 ? "Sí" : "No"}`);

// Exportar preorden y reconstruir árbol idéntico
const exportacion = preordenCodigos.slice();
const reconstruido = new ArbolBusqueda();
for (const codigo of exportacion) {
  const est = estaciones.find((e) => e[0] === codigo);
  reconstruido.insertar(codigo, est ? est[1] : String(codigo));
}
const mismaForma = mismaFormaNodos(original.raiz, reconstruido.raiz);
/** @type {number[]} */
const preRecon = [];
/** @type {number[]} */
const inRecon = [];
reconstruido.preorden((n) => preRecon.push(n.codigo));
reconstruido.inorden((n) => inRecon.push(n.codigo));
console.log("\n=== Reconstrucción desde preorden (exportación) ===");
console.log(`Exportación preorden: [${exportacion.join(", ")}]`);
console.log(`¿Árbol reconstruido tiene exactamente la misma forma que el original? ${mismaForma ? "Sí" : "No"}`);
console.log(`¿Preorden original == preorden reconstruido? ${JSON.stringify(preordenCodigos) === JSON.stringify(preRecon) ? "Sí" : "No"}`);
console.log(`¿Inorden original == inorden reconstruido? ${JSON.stringify(inordenCodigos) === JSON.stringify(inRecon) ? "Sí" : "No"}`);

// Postorden para contar nodos
let cuentaPostorden = 0;
original.postorden(() => {
  cuentaPostorden++;
});
console.log("\n=== Postorden para conteo (y liberación segura) ===");
console.log(`Nodos contados con recorrido postorden: ${cuentaPostorden}`);
console.log(`Nodos contados con contarNodos(): ${original.contarNodos()}`);
console.log("Explicación: postorden procesa primero los subárboles izquierdo y derecho y al final la raíz;");

// Altura y hojas
const alt = original.altura();
const hojas = original.contarHojas();
const n = original.contarNodos();
const minAltura = Math.floor(Math.log2(n)); // en aristas, árbol binario lo más balanceado posible
console.log("\n=== Altura y hojas ===");
console.log(`Altura del árbol (en aristas): ${alt}`);
console.log(`Número de hojas: ${hojas}`);
console.log(`Número de nodos (n): ${n}`);
console.log(`Altura mínima posible para ${n} nodos (árbol lo más balanceado): floor(log2(${n})) = ${minAltura} aristas`);
console.log(`Comparación: altura real ${alt} > mínima teórica ${minAltura} (el árbol está desbalanceado por el orden de inserción).`);
