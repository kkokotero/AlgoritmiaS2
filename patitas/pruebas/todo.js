/**
 * Pruebas finales Motor Patitas v1.0: al menos un caso normal y un borde por estructura.
 * Ejecutar desde `patitas/`: `node pruebas/todo.js`
 */

// @ts-ignore
const assert = require("assert");
const Nodo = require("../src/estructuras/Nodo");
const ListaEnlazada = require("../src/estructuras/ListaEnlazada");
const Cola = require("../src/estructuras/Cola");
const Pila = require("../src/estructuras/Pila");
const RegistroClinico = require("../src/dominio/RegistroClinico");
const Recepcion = require("../src/dominio/Recepcion");
const Editor = require("../src/dominio/Editor");
const { catalogo, contarServicios, buscarServicio, rutaDeServicio, precioPaquete } = require("../src/dominio/catalogo");

let okCount = 0;
let failCount = 0;

/**
 * @param {string} nombre
 * @param {() => void} fn
 */
function prueba(nombre, fn) {
  try {
    fn();
    console.log(`OK - ${nombre}`);
    okCount++;
  } catch (e) {
    const err = /** @type {Error} */ (e);
    console.log(`FALLA - ${nombre}: ${err.message}`);
    failCount++;
  }
}

// Nodo
prueba("Nodo: caso normal (dato y siguiente)", () => {
  const n = new Nodo({ x: 1 });
  assert.deepStrictEqual(n.dato, { x: 1 });
  assert.strictEqual(n.siguiente, null);
});
prueba("Nodo: caso borde (enlace a null)", () => {
  const n = new Nodo("a");
  n.siguiente = null;
  assert.strictEqual(n.siguiente, null);
});

// ListaEnlazada
prueba("ListaEnlazada: caso normal (insertar y buscar)", () => {
  const l = new ListaEnlazada();
  l.agregarAlFinal({ fecha: "1", motivo: "A", veterinario: "V", costo: 10 });
  l.agregarAlFinal({ fecha: "2", motivo: "B", veterinario: "V", costo: 20 });
  assert.strictEqual(l.obtenerTamanio(), 2);
  const b = l.buscar((d) => d.motivo === "B");
  assert.ok(b && b.fecha === "2");
});
prueba("ListaEnlazada: caso borde (eliminar en vacía / inexistente)", () => {
  const l = new ListaEnlazada();
  assert.strictEqual(l.eliminar(() => true), null);
  l.agregarAlFinal({ fecha: "1", motivo: "A", veterinario: "V", costo: 10 });
  assert.strictEqual(l.eliminar(() => false), null);
  assert.strictEqual(l.obtenerTamanio(), 1);
});

// Cola
prueba("Cola: caso normal (FIFO)", () => {
  const c = new Cola();
  c.encolar(1); c.encolar(2);
  assert.strictEqual(c.desencolar(), 1);
  assert.strictEqual(c.desencolar(), 2);
});
prueba("Cola: caso borde (desencolar vacía deja estado válido)", () => {
  const c = new Cola();
  assert.strictEqual(c.desencolar(), null);
  assert.strictEqual(c.frente, null);
  assert.strictEqual(c.final, null);
  assert.strictEqual(c.estaVacia(), true);
});

// Pila
prueba("Pila: caso normal (LIFO)", () => {
  const p = new Pila();
  p.apilar(1); p.apilar(2);
  assert.strictEqual(p.desapilar(), 2);
  assert.strictEqual(p.desapilar(), 1);
});
prueba("Pila: caso borde (desapilar/verTope vacía)", () => {
  const p = new Pila();
  assert.strictEqual(p.desapilar(), null);
  assert.strictEqual(p.verTope(), null);
  assert.strictEqual(p.estaVacia(), true);
});

// RegistroClinico
prueba("RegistroClinico: caso normal (registrar y obtener)", () => {
  const r = new RegistroClinico();
  r.registrarAtencion("Lola", { fecha: "1", motivo: "M", veterinario: "V", costo: 1 });
  const h = r.obtenerHistorial("Lola");
  assert.ok(h && h.obtenerTamanio() === 1);
});
prueba("RegistroClinico: caso borde (mascota inexistente)", () => {
  const r = new RegistroClinico();
  assert.strictEqual(r.obtenerHistorial("Nadie"), undefined);
});

// Recepcion
prueba("Recepcion: caso normal (urgencia antes que general)", () => {
  const r = new Recepcion();
  r.registrarLlegada({ hora: "8:00", mascota: "A", tipo: "General", motivo: "x" });
  r.registrarLlegada({ hora: "8:01", mascota: "B", tipo: "Urgencia", motivo: "y" });
  const s = r.llamarSiguiente();
  assert.ok(s && s.mascota === "B");
});
prueba("Recepcion: caso borde (llamar con sala vacía no falla)", () => {
  const r = new Recepcion();
  assert.strictEqual(r.llamarSiguiente(), null);
  assert.strictEqual(r.llamarSiguienteSeguro(), null);
});

// Editor
prueba("Editor: caso normal (agregar y deshacer)", () => {
  const reg = new RegistroClinico();
  const e = new Editor(reg);
  e.agregar("M", { fecha: "1", motivo: "A", veterinario: "V", costo: 1 });
  e.deshacer();
  const h = reg.obtenerHistorial("M");
  assert.ok(h && h.obtenerTamanio() === 0);
});
prueba("Editor: caso borde (rehacer sin nada / acción nueva vacía rehacer)", () => {
  const reg = new RegistroClinico();
  const e = new Editor(reg);
  assert.strictEqual(e.rehacer(), false);
  e.agregar("M", { fecha: "1", motivo: "A", veterinario: "V", costo: 1 });
  e.deshacer();
  e.agregar("M", { fecha: "2", motivo: "B", veterinario: "V", costo: 2 });
  assert.strictEqual(e.rehacer(), false);
});

// Catalogo (recursivo)
prueba("Catalogo: caso normal (contar y ruta)", () => {
  assert.strictEqual(contarServicios(catalogo), 9);
  assert.deepStrictEqual(rutaDeServicio(catalogo, "Gata"), ["Patitas", "Cirugías", "Esterilización", "Gata"]);
});
prueba("Catalogo: caso borde (inexistente y paquete)", () => {
  assert.strictEqual(buscarServicio(catalogo, "Peluquería"), null);
  assert.strictEqual(rutaDeServicio(catalogo, "Peluquería"), null);
  const cir = require("../src/dominio/catalogo").buscarCategoria(catalogo, "Cirugías");
  assert.ok(cir && precioPaquete(cir) === 702000);
});

console.log(`\nResultados: OK=${okCount} FALLA=${failCount}`);
// @ts-ignore: process disponible en Node.js
if (failCount > 0) process.exitCode = 1;
