/**
 * Prueba Día 1: creación de nodos, enlace manual y recorridos (sin índices/arreglos).
 * Ejecutar desde `patitas/`: `node pruebas/nodos.js`
 */

const Nodo = require("../src/Nodo");

// Atenciones de Lola (gata, 4 años) en orden cronológico
/** @type {{fecha: string, motivo: string, veterinario: string, costo: number}} */
const atencion1 = {
  fecha: "02/02",
  motivo: "Vacunación",
  veterinario: "Dra. Ríos",
  costo: 85000,
};

/** @type {{fecha: string, motivo: string, veterinario: string, costo: number}} */
const atencion2 = {
  fecha: "15/03",
  motivo: "Control de peso",
  veterinario: "Dr. Gómez",
  costo: 40000,
};

/** @type {{fecha: string, motivo: string, veterinario: string, costo: number}} */
const atencion3 = {
  fecha: "20/05",
  motivo: "Limpieza dental",
  veterinario: "Dra. Ríos",
  costo: 150000,
};

// Crear nodos y enlazarlos manualmente
const nodo1 = new Nodo(atencion1);
const nodo2 = new Nodo(atencion2);
const nodo3 = new Nodo(atencion3);

nodo1.siguiente = nodo2;
nodo2.siguiente = nodo3;

/** @type {Nodo | null} */
const cabeza = nodo1;

// Recorrido 1: imprimir cada atención
console.log("=== Historial de atenciones (Lola) ===");
let actual = cabeza;
while (actual !== null) {
  const { fecha, motivo, veterinario, costo } = actual.dato;
  console.log(`${fecha} - ${motivo} - ${veterinario} - $${costo}`);
  actual = actual.siguiente;
}

// Recorrido 2: calcular costo total
let actualCosto = cabeza;
let costoTotal = 0;
while (actualCosto !== null) {
  costoTotal += actualCosto.dato.costo;
  actualCosto = actualCosto.siguiente;
}

console.log(`\nCosto total del historial: $${costoTotal}`);
