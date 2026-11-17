/**
 * Pruebas de métodos recursivos de ListaEnlazada y desbordamiento de pila.
 * Ejecutar desde `patitas/`: `node pruebas/recursivo.js`
 */

// @ts-ignore
const assert = require("assert");
const RegistroClinico = require("../src/dominio/RegistroClinico");
const ListaEnlazada = require("../src/estructuras/ListaEnlazada");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/**
 * Carga historiales de Lola, Toby y Mía como en el reporte.
 * @returns {RegistroClinico}
 */
function cargarDatos() {
  const registro = new RegistroClinico();
  /** @type {[string, Atencion][]} */
  const datos = [
    ["Lola (gata)", { fecha: "02/02", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 }],
    ["Lola (gata)", { fecha: "15/03", motivo: "Control de peso", veterinario: "Dr. Gómez", costo: 40000 }],
    ["Lola (gata)", { fecha: "20/05", motivo: "Limpieza dental", veterinario: "Dra. Ríos", costo: 150000 }],
    ["Toby (perro)", { fecha: "10/01", motivo: "Consulta por cojera", veterinario: "Dr. Gómez", costo: 60000 }],
    ["Toby (perro)", { fecha: "12/01", motivo: "Radiografía de pata", veterinario: "Dr. Gómez", costo: 120000 }],
    ["Toby (perro)", { fecha: "05/04", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 }],
    ["Mía (gata)", { fecha: "18/02", motivo: "Esterilización", veterinario: "Dra. Ríos", costo: 280000 }],
    ["Mía (gata)", { fecha: "25/02", motivo: "Control posquirúrgico", veterinario: "Dra. Ríos", costo: 0 }],
  ];
  for (const [mascota, atencion] of datos) {
    registro.registrarAtencion(mascota, atencion);
  }
  return registro;
}

/**
 * Calcula costo total iterativo recorriendo la lista.
 * @param {ListaEnlazada} lista
 * @returns {number}
 */
function costoTotalIterativo(lista) {
  let total = 0;
  lista.recorrer((d) => {
    total += d.costo;
  });
  return total;
}

const registro = cargarDatos();
console.log("=== Verificación recursivo vs iterativo (Lola, Toby, Mía) ===\n");
for (const mascota of registro.mascotas()) {
  const h = registro.obtenerHistorial(mascota);
  if (!h) continue;
  const tamI = h.obtenerTamanio();
  const tamR = h.tamanioRecursivo();
  const costoI = costoTotalIterativo(h);
  const costoR = h.costoTotalRecursivo();
  const buscI = h.buscar((d) => /vacun/i.test(d.motivo));
  const buscR = h.buscarRecursivo((d) => /vacun/i.test(d.motivo));
  console.log(`${mascota}: tamanio iter=${tamI} rec=${tamR}, costo iter=${costoI} rec=${costoR}`);
  assert.strictEqual(tamI, tamR, "tamanio coincide");
  assert.strictEqual(costoI, costoR, "costo coincide");
  assert.deepStrictEqual(buscI, buscR, "buscar coincide");
  console.log("  Historial en orden inverso (imprimirAlReves):");
  h.imprimirAlReves();
  console.log("");
}
console.log("OK - versiones recursivas coinciden con iterativas.\n");

console.log("=== Prueba de desbordamiento con 100.000 atenciones ===");
const grande = new ListaEnlazada();
for (let i = 0; i < 100000; i++) {
  grande.agregarAlFinal({ fecha: "01/01", motivo: `m${i}`, veterinario: "V", costo: 1 });
}
console.log(`Lista creada con tamanio (iterativo): ${grande.obtenerTamanio()}`);
try {
  const t = grande.tamanioRecursivo();
  console.log(`tamanioRecursivo(): ${t} (no hubo desbordamiento)`);
} catch (e) {
  const err = /** @type {Error} */ (e);
  console.log(`Error capturado: ${err.name}: ${err.message}`);
}
