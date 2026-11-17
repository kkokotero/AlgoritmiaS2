/**
 * Pruebas de casos borde: buscar, insertarDespuesDe y eliminar.
 * Ejecutar desde `patitas/`: `node pruebas/casosBorde.js`
 */

// @ts-ignore: módulo built-in de Node.js
const assert = require("assert");
const ListaEnlazada = require("../src/estructuras/ListaEnlazada");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/**
 * Crea una atención de prueba con fecha dada.
 * @param {string} fecha - Fecha identificadora.
 * @returns {Atencion} Atención de prueba.
 */
function at(fecha) {
  return { fecha, motivo: "m", veterinario: "v", costo: 1000 };
}

/**
 * Obtiene las fechas de los datos de la lista en orden.
 * @param {ListaEnlazada} lista - Lista enlazada.
 * @returns {string[]} Arreglo de fechas.
 */
function fechas(lista) {
  return lista.aArreglo().map((d) => d.fecha);
}

/**
 * Verifica el estado completo de la lista.
 * @param {ListaEnlazada} lista - Lista a verificar.
 * @param {string[]} esperado - Fechas esperadas en orden.
 * @param {string} etiqueta - Nombre del caso.
 * @returns {void}
 */
function verificarEstado(lista, esperado, etiqueta) {
  assert.strictEqual(lista.tamanio, esperado.length, `${etiqueta}: tamanio`);
  assert.strictEqual(lista.obtenerTamanio(), esperado.length, `${etiqueta}: obtenerTamanio`);
  assert.strictEqual(lista.estaVacia(), esperado.length === 0, `${etiqueta}: estaVacia`);
  assert.deepStrictEqual(fechas(lista), esperado, `${etiqueta}: orden/arreglo`);
  if (esperado.length === 0) {
    assert.strictEqual(lista.cabeza, null, `${etiqueta}: cabeza null`);
    assert.strictEqual(lista.cola, null, `${etiqueta}: cola null`);
  } else {
    assert.ok(lista.cabeza, `${etiqueta}: cabeza existe`);
    assert.ok(lista.cola, `${etiqueta}: cola existe`);
    const cabeza = /** @type {import("../src/estructuras/Nodo")<Atencion>} */ (lista.cabeza);
    const cola = /** @type {import("../src/estructuras/Nodo")<Atencion>} */ (lista.cola);
    assert.strictEqual(cabeza.dato.fecha, esperado[0], `${etiqueta}: cabeza`);
    assert.strictEqual(cola.dato.fecha, esperado[esperado.length - 1], `${etiqueta}: cola`);
    assert.strictEqual(cola.siguiente, null, `${etiqueta}: cola.siguiente null`);
    if (esperado.length === 1) {
      assert.strictEqual(cabeza, cola, `${etiqueta}: unico nodo`);
    }
  }
  console.log(`OK - ${etiqueta}`);
}

/**
 * Crea una condición que compara por fecha.
 * @param {string} f - Fecha a buscar.
 * @returns {(d: Atencion) => boolean} Función condición.
 */
const porFecha = (f) => (d) => d.fecha === f;

// 1. Eliminar en una lista vacía
{
  const lista = new ListaEnlazada();
  const res = lista.eliminar(porFecha("X"));
  assert.strictEqual(res, null, "vacía: devuelve null");
  verificarEstado(lista, [], "1. Eliminar en lista vacía");
}

// 2. Eliminar el único nodo
{
  const lista = new ListaEnlazada();
  lista.agregarAlFinal(at("A"));
  const res = lista.eliminar(porFecha("A"));
  assert.ok(res, "único: devuelve dato");
  assert.strictEqual((/** @type {Atencion} */ (res)).fecha, "A", "único: dato eliminado");
  verificarEstado(lista, [], "2. Eliminar el único nodo");
}

// 3. Eliminar la cabeza
{
  const lista = new ListaEnlazada();
  ["A", "B", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const res = lista.eliminar(porFecha("A"));
  assert.ok(res, "cabeza: devuelve dato");
  assert.strictEqual((/** @type {Atencion} */ (res)).fecha, "A");
  verificarEstado(lista, ["B", "C"], "3. Eliminar la cabeza");
}

// 4. Eliminar la cola
{
  const lista = new ListaEnlazada();
  ["A", "B", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const res = lista.eliminar(porFecha("C"));
  assert.ok(res, "cola: devuelve dato");
  assert.strictEqual((/** @type {Atencion} */ (res)).fecha, "C");
  verificarEstado(lista, ["A", "B"], "4. Eliminar la cola (nueva cola.siguiente null)");
}

// 5. Eliminar algo que no existe
{
  const lista = new ListaEnlazada();
  ["A", "B", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const res = lista.eliminar(porFecha("Z"));
  assert.strictEqual(res, null, "no existe: null");
  verificarEstado(lista, ["A", "B", "C"], "5. Eliminar algo que no existe (sin cambios)");
}

// 6. Insertar después de la cola
{
  const lista = new ListaEnlazada();
  ["A", "B", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const ok = lista.insertarDespuesDe(porFecha("C"), at("D"));
  assert.strictEqual(ok, true, "insertar tras cola: true");
  verificarEstado(lista, ["A", "B", "C", "D"], "6. Insertar después de la cola");
}

// Extra: búsqueda y insertar en medio/no encontrado
{
  const lista = new ListaEnlazada();
  ["A", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const encontrada = lista.buscar(porFecha("A"));
  assert.ok(encontrada, "buscar: encontrada");
  assert.strictEqual((/** @type {Atencion} */ (encontrada)).fecha, "A");
  assert.strictEqual(lista.buscar(porFecha("Z")), null);
  assert.strictEqual(lista.insertarDespuesDe(porFecha("Z"), at("X")), false);
  lista.insertarDespuesDe(porFecha("A"), at("B"));
  verificarEstado(lista, ["A", "B", "C"], "Extra: buscar e insertar en medio");
}

console.log("\nTodas las pruebas de casos borde pasaron.");
