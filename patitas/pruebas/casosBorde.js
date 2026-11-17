const assert = require("assert");
const ListaEnlazada = require("../src/ListaEnlazada");

function at(fecha) {
  return { fecha, motivo: "m", veterinario: "v", costo: 1000 };
}

function fechas(lista) {
  return lista.aArreglo().map((d) => d.fecha);
}

function verificarEstado(lista, esperado, etiqueta) {
  assert.strictEqual(lista.tamanio, esperado.length, `${etiqueta}: tamanio`);
  assert.strictEqual(lista.obtenerTamanio(), esperado.length, `${etiqueta}: obtenerTamanio`);
  assert.strictEqual(lista.estaVacia(), esperado.length === 0, `${etiqueta}: estaVacia`);
  assert.deepStrictEqual(fechas(lista), esperado, `${etiqueta}: orden/arreglo`);
  if (esperado.length === 0) {
    assert.strictEqual(lista.cabeza, null, `${etiqueta}: cabeza null`);
    assert.strictEqual(lista.cola, null, `${etiqueta}: cola null`);
  } else {
    assert.strictEqual(lista.cabeza.dato.fecha, esperado[0], `${etiqueta}: cabeza`);
    assert.strictEqual(lista.cola.dato.fecha, esperado[esperado.length - 1], `${etiqueta}: cola`);
    assert.strictEqual(lista.cola.siguiente, null, `${etiqueta}: cola.siguiente null`);
    if (esperado.length === 1) {
      assert.strictEqual(lista.cabeza, lista.cola, `${etiqueta}: unico nodo`);
    }
  }
  console.log(`OK - ${etiqueta}`);
}

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
  assert.strictEqual(res.fecha, "A", "único: dato eliminado");
  verificarEstado(lista, [], "2. Eliminar el único nodo");
}

// 3. Eliminar la cabeza
{
  const lista = new ListaEnlazada();
  ["A", "B", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const res = lista.eliminar(porFecha("A"));
  assert.strictEqual(res.fecha, "A");
  verificarEstado(lista, ["B", "C"], "3. Eliminar la cabeza");
}

// 4. Eliminar la cola
{
  const lista = new ListaEnlazada();
  ["A", "B", "C"].forEach((f) => lista.agregarAlFinal(at(f)));
  const res = lista.eliminar(porFecha("C"));
  assert.strictEqual(res.fecha, "C");
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
  assert.strictEqual(lista.buscar(porFecha("A")).fecha, "A");
  assert.strictEqual(lista.buscar(porFecha("Z")), null);
  assert.strictEqual(lista.insertarDespuesDe(porFecha("Z"), at("X")), false);
  lista.insertarDespuesDe(porFecha("A"), at("B"));
  verificarEstado(lista, ["A", "B", "C"], "Extra: buscar e insertar en medio");
}

console.log("\nTodas las pruebas de casos borde pasaron.");
