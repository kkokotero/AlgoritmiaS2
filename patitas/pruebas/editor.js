/**
 * Prueba de deshacer/rehacer con dos pilas.
 * Secuencia: agregar A, agregar B, eliminar A, deshacer, deshacer, rehacer, agregar C, rehacer.
 * Ejecutar desde `patitas/`: `node pruebas/editor.js`
 */

// @ts-ignore: módulo built-in de Node.js
const assert = require("assert");
const RegistroClinico = require("../src/RegistroClinico");
const Editor = require("../src/Editor");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/** @type {Atencion} */
const A = { fecha: "01/01", motivo: "A", veterinario: "V", costo: 100 };
/** @type {Atencion} */
const B = { fecha: "02/02", motivo: "B", veterinario: "V", costo: 200 };
/** @type {Atencion} */
const C = { fecha: "03/03", motivo: "C", veterinario: "V", costo: 300 };

/**
 * Obtiene las fechas del historial de una mascota.
 * @param {Editor} editor
 * @param {string} mascota
 * @returns {string[]}
 */
function fechas(editor, mascota) {
  const h = editor.registro.obtenerHistorial(mascota);
  return h ? h.aArreglo().map((d) => d.fecha) : [];
}

/**
 * Imprime y verifica el estado de un paso.
 * @param {number} paso
 * @param {string} accion
 * @param {Editor} editor
 * @param {string[]} esperadoHistorial
 * @returns {void}
 */
function verificarPaso(paso, accion, editor, esperadoHistorial) {
  const estado = editor.estadoPilas();
  const hist = fechas(editor, "Lola");
  console.log(`Paso ${paso} (${accion}):`);
  console.log(`  Historial: [${hist.join(", ")}]`);
  console.log(`  Pila deshacer (base->tope): [${estado.deshacer.join(", ")}]`);
  console.log(`  Pila rehacer  (base->tope): [${estado.rehacer.join(", ")}]`);
  assert.deepStrictEqual(hist, esperadoHistorial, `Paso ${paso}: historial`);
  console.log("");
}

const registro = new RegistroClinico();
const editor = new Editor(registro);
const mascota = "Lola";

// 1. agregar A
editor.agregar(mascota, A);
verificarPaso(1, "agregar A", editor, ["01/01"]);

// 2. agregar B
editor.agregar(mascota, B);
verificarPaso(2, "agregar B", editor, ["01/01", "02/02"]);

// 3. eliminar A
editor.eliminar(mascota, (d) => d === A);
verificarPaso(3, "eliminar A", editor, ["02/02"]);

// 4. deshacer (revierte eliminar A)
editor.deshacer();
verificarPaso(4, "deshacer", editor, ["01/01", "02/02"]);

// 5. deshacer (revierte agregar B)
editor.deshacer();
verificarPaso(5, "deshacer", editor, ["01/01"]);

// 6. rehacer (reaplica agregar B)
editor.rehacer();
verificarPaso(6, "rehacer", editor, ["01/01", "02/02"]);

// 7. agregar C (acción nueva: vacía rehacer)
editor.agregar(mascota, C);
verificarPaso(7, "agregar C", editor, ["01/01", "02/02", "03/03"]);

// 8. rehacer (no hace nada)
const hizo = editor.rehacer();
assert.strictEqual(hizo, false, "rehacer no debe hacer nada");
verificarPaso(8, "rehacer", editor, ["01/01", "02/02", "03/03"]);

// Casos borde: deshacer/rehacer en vacías
const r = new RegistroClinico();
const e = new Editor(r);
assert.strictEqual(e.deshacer(), false);
assert.strictEqual(e.rehacer(), false);

console.log("Todas las verificaciones pasaron.");
