/**
 * Pruebas de ListaEnlazada: inserción al inicio/final en los 6 casos de diseño.
 * Ejecutar desde `patitas/`: `node pruebas/lista.js`
 */

// @ts-ignore: módulo built-in de Node.js
const assert = require("assert");
const ListaEnlazada = require("../src/estructuras/ListaEnlazada");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/**
 * Crea una atención de prueba.
 * @param {string} fecha - Fecha de la atención.
 * @param {string} motivo - Motivo de la atención.
 * @returns {Atencion} Atención de prueba.
 */
function atencion(fecha, motivo) {
  return { fecha, motivo, veterinario: "Vet", costo: 1000 };
}

/**
 * Verifica el estado de la lista tras una operación.
 * @param {ListaEnlazada} lista - Lista a verificar.
 * @param {string | null} esperadoCabeza - Fecha esperada en cabeza (o null).
 * @param {string | null} esperadoCola - Fecha esperada en cola (o null).
 * @param {number} esperadoTamanio - Tamaño esperado.
 * @param {string[]} esperadoArreglo - Fechas esperadas en orden.
 * @param {string} etiqueta - Nombre del caso.
 * @returns {void}
 */
function verificar(lista, esperadoCabeza, esperadoCola, esperadoTamanio, esperadoArreglo, etiqueta) {
  assert.strictEqual(lista.estaVacia(), esperadoTamanio === 0, `${etiqueta}: estaVacia`);
  assert.strictEqual(lista.obtenerTamanio(), esperadoTamanio, `${etiqueta}: tamanio`);
  assert.strictEqual(lista.tamanio, esperadoTamanio, `${etiqueta}: propiedad tamanio`);
  if (esperadoTamanio === 0) {
    assert.strictEqual(lista.cabeza, null, `${etiqueta}: cabeza null`);
    assert.strictEqual(lista.cola, null, `${etiqueta}: cola null`);
  } else {
    assert.ok(lista.cabeza, `${etiqueta}: cabeza existe`);
    assert.ok(lista.cola, `${etiqueta}: cola existe`);
    assert.ok(esperadoCabeza, `${etiqueta}: esperadoCabeza definido`);
    assert.ok(esperadoCola, `${etiqueta}: esperadoCola definido`);
    const cabeza = /** @type {import("../src/estructuras/Nodo")<Atencion>} */ (lista.cabeza);
    const cola = /** @type {import("../src/estructuras/Nodo")<Atencion>} */ (lista.cola);
    assert.strictEqual(cabeza.dato.fecha, esperadoCabeza, `${etiqueta}: cabeza dato`);
    assert.strictEqual(cola.dato.fecha, esperadoCola, `${etiqueta}: cola dato`);
    if (esperadoTamanio === 1) {
      assert.strictEqual(cabeza, cola, `${etiqueta}: cabeza y cola mismo nodo`);
    }
  }
  assert.deepStrictEqual(
    lista.aArreglo().map((d) => d.fecha),
    esperadoArreglo,
    `${etiqueta}: aArreglo orden`
  );
  console.log(`OK - ${etiqueta}`);
}

// Caso 1: agregarAlFinal en lista vacía
{
  const lista = new ListaEnlazada();
  lista.agregarAlFinal(atencion("A1", "final en vacía"));
  verificar(lista, "A1", "A1", 1, ["A1"], "Caso 1: agregarAlFinal en lista vacía");
}

// Caso 2: agregarAlInicio en lista vacía
{
  const lista = new ListaEnlazada();
  lista.agregarAlInicio(atencion("B1", "inicio en vacía"));
  verificar(lista, "B1", "B1", 1, ["B1"], "Caso 2: agregarAlInicio en lista vacía");
}

// Caso 3: agregarAlFinal en lista con un nodo
{
  const lista = new ListaEnlazada();
  lista.agregarAlFinal(atencion("C1", "primero"));
  lista.agregarAlFinal(atencion("C2", "segundo al final"));
  verificar(lista, "C1", "C2", 2, ["C1", "C2"], "Caso 3: agregarAlFinal en lista con un nodo");
}

// Caso 4: agregarAlInicio en lista con un nodo
{
  const lista = new ListaEnlazada();
  lista.agregarAlFinal(atencion("D1", "primero"));
  lista.agregarAlInicio(atencion("D0", "nuevo inicio"));
  verificar(lista, "D0", "D1", 2, ["D0", "D1"], "Caso 4: agregarAlInicio en lista con un nodo");
}

// Caso 5: agregarAlFinal en lista con varios nodos
{
  const lista = new ListaEnlazada();
  lista.agregarAlFinal(atencion("E1", "1"));
  lista.agregarAlFinal(atencion("E2", "2"));
  lista.agregarAlFinal(atencion("E3", "3 al final"));
  verificar(lista, "E1", "E3", 3, ["E1", "E2", "E3"], "Caso 5: agregarAlFinal en lista con varios nodos");
}

// Caso 6: agregarAlInicio en lista con varios nodos
{
  const lista = new ListaEnlazada();
  lista.agregarAlFinal(atencion("F2", "2"));
  lista.agregarAlFinal(atencion("F3", "3"));
  lista.agregarAlInicio(atencion("F1", "nuevo inicio"));
  verificar(lista, "F1", "F3", 3, ["F1", "F2", "F3"], "Caso 6: agregarAlInicio en lista con varios nodos");
}

console.log("\nTodos los casos pasaron.");
