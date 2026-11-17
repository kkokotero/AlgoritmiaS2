/**
 * Pruebas de Cola (FIFO) con turnos de recepción.
 * Ejecutar desde `patitas/`: `node pruebas/cola.js`
 */

// @ts-ignore: módulo built-in de Node.js
const assert = require("assert");
const Cola = require("../src/estructuras/Cola");

/**
 * @typedef {{mascota: string, tutor: string, horaLlegada: string, motivo: string}} Turno
 */

/** @type {Turno[]} */
const turnos = [
  { mascota: "Lola", tutor: "Ana", horaLlegada: "08:00", motivo: "Vacunación" },
  { mascota: "Toby", tutor: "Luis", horaLlegada: "08:15", motivo: "Consulta" },
  { mascota: "Mía", tutor: "Sara", horaLlegada: "08:30", motivo: "Control" },
  { mascota: "Rocky", tutor: "Pedro", horaLlegada: "08:45", motivo: "Baño" },
  { mascota: "Nala", tutor: "Carla", horaLlegada: "09:00", motivo: "Desparasitación" },
];

const cola = new Cola();

// Estado inicial
assert.strictEqual(cola.estaVacia(), true, "cola vacía al inicio");
assert.strictEqual(cola.tamanio(), 0, "tamaño 0 al inicio");
assert.strictEqual(cola.desencolar(), null, "desencolar vacía devuelve null");
assert.strictEqual(cola.frente, null, "frente null tras desencolar vacía");
assert.strictEqual(cola.final, null, "final null tras desencolar vacía");

// Encolar 5 turnos
for (const turno of turnos) {
  cola.encolar(turno);
}

assert.strictEqual(cola.estaVacia(), false, "cola no vacía tras encolar");
assert.strictEqual(cola.tamanio(), 5, "tamaño 5 tras encolar");
assert.ok(cola.verFrente(), "verFrente existe");
assert.strictEqual(/** @type {Turno} */ (cola.verFrente()).mascota, "Lola", "frente es Lola");
assert.ok(cola.final, "final existe");
assert.strictEqual((/** @type {{dato: Turno}} */ (cola.final)).dato.mascota, "Nala", "final es Nala");

// Desencolar en orden FIFO y verificar
/** @type {string[]} */
const atendidos = [];
while (!cola.estaVacia()) {
  const turno = cola.desencolar();
  if (turno) {
    atendidos.push(turno.mascota);
  }
}

assert.deepStrictEqual(atendidos, ["Lola", "Toby", "Mía", "Rocky", "Nala"], "orden FIFO correcto");
assert.strictEqual(cola.estaVacia(), true, "cola vacía al final");
assert.strictEqual(cola.tamanio(), 0, "tamaño 0 al final");
assert.strictEqual(cola.frente, null, "frente null al quedar vacía");
assert.strictEqual(cola.final, null, "final null al quedar vacía");
assert.strictEqual(cola.desencolar(), null, "desencolar vacía final devuelve null");

console.log("OK - Cola FIFO: 5 turnos atendidos en orden de llegada");
console.log("Atendidos:", atendidos.join(", "));

/**
 * Medición comparativa: Cola (nodos) vs Arreglo (push/shift) con 100.000 turnos.
 * @returns {void}
 */
function medirComparacion() {
  const n = 100000;

  // Cola basada en nodos
  const colaNodos = new Cola();
  console.time("Nodos - encolar 100000");
  for (let i = 0; i < n; i++) {
    colaNodos.encolar({ mascota: `M${i}`, tutor: `T${i}`, horaLlegada: "00:00", motivo: "x" });
  }
  console.timeEnd("Nodos - encolar 100000");

  console.time("Nodos - desencolar 100000");
  for (let i = 0; i < n; i++) {
    colaNodos.desencolar();
  }
  console.timeEnd("Nodos - desencolar 100000");

  // Arreglo con push/shift
  /** @type {Turno[]} */
  const arreglo = [];
  console.time("Arreglo - push 100000");
  for (let i = 0; i < n; i++) {
    arreglo.push({ mascota: `M${i}`, tutor: `T${i}`, horaLlegada: "00:00", motivo: "x" });
  }
  console.timeEnd("Arreglo - push 100000");

  console.time("Arreglo - shift 100000");
  for (let i = 0; i < n; i++) {
    arreglo.shift();
  }
  console.timeEnd("Arreglo - shift 100000");
}

console.log("\n=== Comparación con 100.000 turnos ===");
medirComparacion();
