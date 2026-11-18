# Bitácora — Ruta Paisa Planificador (Semana 4)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-4/bitacora-dia-1.md](../docs/semana-4/bitacora-dia-1.md)
- [../docs/semana-4/bitacora-dia-2.md](../docs/semana-4/bitacora-dia-2.md)

## Día 1 — Árbol general de la red
- **NodoArbol** (`src/NodoArbol.js`) y red piloto raíz→líneas→estaciones→servicios (`src/redArbol.js`), 22 apariciones de estaciones y 3 servicios.
- **Recursivos:** `imprimirArbol`, `contarNodos` (29), `contarHojas` (23), `altura` (3). Análisis de estaciones compartidas y alternativa: **grafo**.

## Día 1 — ABB, recorridos y consultas (v0.1)
- **`ArbolBusqueda.js`:** `NodoBinario`/`ArbolBusqueda` con `insertar`, `buscar`, recorridos `inorden/preorden/postorden`, `altura`, `contarHojas/Nodos`, `minimo`, `maximo`, `rango` con poda.
- **Verificaciones:** búsquedas 50→1, 59→7, 10→4, 40→3, 33→`null`; inorden 10–90; preorden reconstruye misma forma; postorden conteo/liberación; `minimo` Niquía (10), `maximo` La Estrella (90), `rango(10,30)` = Niquía, Bello, Acevedo, Andalucía, Santo Domingo, Caribe.
- **Árbol degenerado:** inserción ascendente → 20 niveles (altura 19), `buscar(59)`=15 comp., `buscar(90)`=20 comp.; O(n) vs O(log n).
- **Índice:** `src/indice.js` con reporte completo.

## Día 2 — Grafo, DFS/BFS y planificador (v0.2)
- **`Grafo.js`:** grafo no dirigido con lista de adyacencia (`Map`), conexiones etiquetadas por línea, `conectar/vecinos/grado`, `dfs` recursivo e iterativo, `componentes`, `bfs` (ruta con menor número de tramos). V=20, E=21; transbordos: Caribe, Hospital, San Antonio, Industriales, Estadio.
- **`cierres.js`:** alcanzabilidad 20/20, recursivo=iterativo; cierre de Estadio → aisladas **Floresta y San Javier**; 11 estaciones críticas justificadas.
- **`planificador.js` (v0.2):** CLI `node src/planificador.js <origen> <destino> [--cerradas ...]`; valida con índice ABB, calcula ruta BFS con nombres/líneas/paradas y detecta transbordos; maneja códigos inexistentes y viajes imposibles por cierres.
- **Bitácora Día 2:** dibujo del grafo, comparación lista/matriz, traza DFS (Santo Domingo, pila 6 pasos) y **traza BFS** (10→59), complejidad O(V+E) y **tabla de estructuras** (árbol general, ABB, grafo, cola, pila, Set, Map) con uso y complejidad.
