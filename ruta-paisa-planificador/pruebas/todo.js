/**
 * Pruebas del planificador Ruta Paisa v1.0.
 * Verifica al menos un caso normal y un caso borde de cada funcionalidad.
 * Ejecutar: node pruebas/todo.js
 */

const assert = require("assert");
const { ArbolBusqueda } = require("../src/estructuras/ArbolBusqueda");
const { construirGrafoRed } = require("../src/dominio/red");
const { construirIndiceOriginal, listadoOrdenado, consultaRango } = require("../src/dominio/indice");
const { obtenerEstacionesCriticas } = require("../src/dominio/cierres");
const { validarPlan, PLAN_ORIGINAL, PLAN_CORREGIDO } = require("../src/dominio/mantenimiento");
const { detectarTransbordos } = require("../src/planificador");
const { validacionesDuplicadas, montoACorregir } = require("../src/retos/duplicados");
const { horaPico, estacionesMasUsadas } = require("../src/retos/demanda");

let ok = 0;
let falla = 0;

/**
 * @param {string} nombre
 * @param {() => void} fn
 */
function prueba(nombre, fn) {
  try {
    fn();
    console.log(`OK - ${nombre}`);
    ok++;
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    console.log(`FALLA - ${nombre}: ${msg}`);
    falla++;
  }
}

console.log("=== Pruebas Ruta Paisa v1.0 ===\n");

// 1. Consulta de ruta con transbordos y cierres
prueba("Ruta (normal): 10->59 devuelve camino con menor número de tramos y transbordos", () => {
  const grafo = construirGrafoRed();
  const ruta = grafo.bfs(10, 59, new Set());
  assert.ok(ruta, "debe existir ruta");
  assert.deepStrictEqual(ruta, [10, 20, 30, 35, 40, 56, 58, 59]);
  const transbordos = detectarTransbordos(ruta, grafo);
  assert.strictEqual(transbordos.length, 2);
  assert.deepStrictEqual(transbordos.map((t) => t.en), [40, 56]);
  assert.strictEqual(transbordos[0].deLinea, "A");
  assert.strictEqual(transbordos[0].aLinea, "T");
  assert.strictEqual(transbordos[1].deLinea, "T");
  assert.strictEqual(transbordos[1].aLinea, "B");
});

prueba("Ruta (borde): cierre de Estadio (56) hace imposible 10->59; código inexistente no produce ruta válida", () => {
  const grafo = construirGrafoRed();
  const indice = construirIndiceOriginal();
  const rutaImposible = grafo.bfs(10, 59, new Set([56]));
  assert.strictEqual(rutaImposible, null, "con 56 cerrada no debe haber ruta");
  const noExiste = indice.buscar(999);
  assert.strictEqual(noExiste, null, "código inexistente debe retornar null");
  const origenCerrado = grafo.bfs(10, 59, new Set([10]));
  assert.strictEqual(origenCerrado, null, "origen cerrado debe impedir ruta");
});

// 2. Listado ordenado de estaciones
prueba("Listado (normal): 20 estaciones en orden ascendente por código (10 a 90)", () => {
  const listado = listadoOrdenado();
  assert.strictEqual(listado.length, 20);
  assert.strictEqual(listado[0].codigo, 10);
  assert.strictEqual(listado[0].estacion, "Niquía");
  assert.strictEqual(listado[19].codigo, 90);
  assert.strictEqual(listado[19].estacion, "La Estrella");
  for (let i = 1; i < listado.length; i++) {
    assert.ok(listado[i].codigo > listado[i - 1].codigo, "debe estar en orden ascendente");
  }
});

prueba("Listado (borde): índice vacío produce listado vacío", () => {
  const vacio = new ArbolBusqueda();
  /** @type {{codigo:number, estacion:string}[]} */
  const res = [];
  vacio.inorden((n) => res.push({ codigo: n.codigo, estacion: n.estacion }));
  assert.strictEqual(res.length, 0);
  assert.strictEqual(vacio.minimo(), null);
  assert.strictEqual(vacio.maximo(), null);
});

// 3. Consulta por rango de códigos
prueba("Rango (normal): [10,30] devuelve zona norte en orden (6 estaciones)", () => {
  const rango = consultaRango(10, 30);
  const codigos = rango.map((e) => e.codigo);
  assert.deepStrictEqual(codigos, [10, 20, 25, 27, 29, 30]);
  const nombres = rango.map((e) => e.estacion);
  assert.deepStrictEqual(nombres, ["Niquía", "Bello", "Acevedo", "Andalucía", "Santo Domingo", "Caribe"]);
});

prueba("Rango (borde): rango sin estaciones devuelve vacío; rango de un solo código existente lo incluye", () => {
  const vacio = consultaRango(1, 5);
  assert.deepStrictEqual(vacio, []);
  const unico = consultaRango(50, 50);
  assert.strictEqual(unico.length, 1);
  assert.strictEqual(unico[0].codigo, 50);
  assert.strictEqual(unico[0].estacion, "San Antonio");
});

// 4. Análisis de estaciones críticas
prueba("Estaciones críticas (normal): se identifican 11 críticas incluyendo Estadio (56)", () => {
  const criticas = obtenerEstacionesCriticas();
  assert.strictEqual(criticas.length, 11);
  const codigos = criticas.map((c) => c.codigo);
  assert.ok(codigos.includes(56), "Estadio debe ser crítica");
  const estadio = criticas.find((c) => c.codigo === 56);
  assert.ok(estadio && estadio.componentes.length >= 2, "cerrar Estadio debe dividir la red");
});

prueba("Estaciones críticas (borde): estación no crítica no divide la red en 2+ componentes", () => {
  const grafo = construirGrafoRed();
  // Niquía (10) es terminal de la línea A: al cerrarla el resto sigue conectado
  const comps = grafo.componentes(new Set([10]));
  assert.ok(comps.length < 2, "Niquía no debe ser crítica");
  const criticas = obtenerEstacionesCriticas();
  const codigos = criticas.map((c) => c.codigo);
  assert.ok(!codigos.includes(10), "Niquía no debe estar en críticas");
});

// 5. Validación del plan de mantenimiento
prueba("Mantenimiento (normal): plan corregido sin ciclos y con orden topológico válido", () => {
  const res = validarPlan(PLAN_CORREGIDO);
  assert.strictEqual(res.hayCiclo, false);
  assert.ok(Array.isArray(res.orden), "debe tener orden");
  assert.deepStrictEqual(res.orden, ["T1", "T2", "T5", "T3", "T4", "T6"]);
  // verificar que cada tarea aparece después de sus requisitos
  const pos = new Map();
  res.orden.forEach((id, i) => pos.set(String(id), i));
  for (const t of PLAN_CORREGIDO) {
    for (const req of t.requiere) {
      assert.ok(pos.get(req) < pos.get(t.id), `${req} debe ir antes de ${t.id}`);
    }
  }
});

prueba("Mantenimiento (borde): plan original tiene ciclo T3->T4->T5->T3", () => {
  const res = validarPlan(PLAN_ORIGINAL);
  assert.strictEqual(res.hayCiclo, true);
  assert.ok(Array.isArray(res.ciclo), "debe reportar ciclo");
  const ciclo = res.ciclo.map(String);
  const cicloStr = ciclo.join("->");
  assert.ok(cicloStr.includes("T3") && cicloStr.includes("T4") && cicloStr.includes("T5"), "ciclo debe involucrar T3,T4,T5");
  assert.strictEqual(ciclo[0], ciclo[ciclo.length - 1], "ciclo debe cerrarse");
  assert.ok(cicloStr === "T3->T4->T5->T3" || cicloStr === "T4->T5->T3->T4" || cicloStr === "T5->T3->T4->T5", "ciclo esperado T3,T4,T5");
});

// Retos (cobertura adicional)
prueba("Reto duplicados (normal): detecta 2 duplicados y monto $6000", () => {
  const ejemplo = [
    { tarjeta: "T-101", estacion: 50, hora: "07:02", valor: 3000 },
    { tarjeta: "T-205", estacion: 30, hora: "07:02", valor: 3000 },
    { tarjeta: "T-101", estacion: 50, hora: "07:02", valor: 3000 },
    { tarjeta: "T-330", estacion: 56, hora: "07:05", valor: 3000 },
    { tarjeta: "T-205", estacion: 30, hora: "07:09", valor: 3000 },
    { tarjeta: "T-412", estacion: 10, hora: "07:10", valor: 3000 },
    { tarjeta: "T-330", estacion: 56, hora: "07:05", valor: 3000 },
    { tarjeta: "T-101", estacion: 60, hora: "07:31", valor: 3000 },
  ];
  const dups = validacionesDuplicadas(ejemplo);
  assert.strictEqual(dups.length, 2);
  assert.strictEqual(montoACorregir(ejemplo), 6000);
});

prueba("Reto duplicados (borde): lista vacía o sin duplicados -> 0 duplicados y monto 0", () => {
  assert.deepStrictEqual(validacionesDuplicadas([]), []);
  assert.strictEqual(montoACorregir([]), 0);
  const sinDups = [
    { tarjeta: "T-205", estacion: 30, hora: "07:02", valor: 3000 },
    { tarjeta: "T-205", estacion: 30, hora: "07:09", valor: 3000 },
  ];
  assert.strictEqual(validacionesDuplicadas(sinDups).length, 0);
});

prueba("Reto demanda (normal): horaPico ventana deslizante k=5 inicia 6:14 con 1630", () => {
  const porMinuto = [120, 135, 150, 180, 210, 260, 310, 340, 330, 300, 280, 250, 240, 260, 290, 320, 350, 360, 310, 270];
  const pico = horaPico(porMinuto, 5);
  assert.strictEqual(pico.inicio, "6:14");
  assert.strictEqual(pico.total, 1630);
  assert.strictEqual(pico.indiceInicio, 14);
});

prueba("Reto demanda (borde): horaPico con arreglo vacío/k inválido y estacionesMasUsadas con vacío", () => {
  const vacio = horaPico([], 5);
  assert.strictEqual(vacio.total, 0);
  const invalido = horaPico([10, 20], 0);
  assert.strictEqual(invalido.total, 0);
  assert.deepStrictEqual(estacionesMasUsadas([], 3), []);
});

console.log(`\nResultado: ${ok} OK, ${falla} FALLA`);
if (falla > 0) {
  process.exitCode = 1;
}
