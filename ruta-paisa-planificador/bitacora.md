# Bitácora — Ruta Paisa Planificador (Semana 4)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-4/bitacora-dia-1.md](../docs/semana-4/bitacora-dia-1.md)
- [../docs/semana-4/bitacora-dia-2.md](../docs/semana-4/bitacora-dia-2.md)
- [../docs/semana-4/bitacora-dia-3.md](../docs/semana-4/bitacora-dia-3.md)

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

## Día 3 — Simulacros de entrevista (retos y rúbrica)
- **Reto 1 — Duplicados (`src/retos/duplicados.js`):** detectar validaciones duplicadas (misma tarjeta, misma estación, mismo minuto) con `Set` de claves compuestas `tarjeta|estacion|hora`. Fuerza bruta O(n²) vs optimizado **O(n) tiempo, O(n) espacio**. Resultado: 2 duplicados (T-101/50/07:02, T-330/56/07:05), monto **$6.000**; T-205 30 07:02 vs 07:09 no duplicado. Protocolo en voz alta, traza y rúbrica en bitácora.
- **Reto 2 — Demanda (`src/retos/demanda.js`):** señales “minutos consecutivos” → **ventana deslizante** y “más usadas” → **conteo de frecuencias** (`Map`). `horaPico(porMinuto,5)` en un solo recorrido O(n) → inicio **6:14**, total **1630**. `estacionesMasUsadas` sobre 50.000 validaciones (estaciones al azar de la red): `Map` + ordenamiento de entradas → **O(n + u log u)** tiempo, **O(u)** espacio. Alternativa top-3 sin ordenar todas: top-k en una pasada **O(n+u)** o min-heap tamaño k **O(n + u log k)**.
- **Rúbrica/pistas:** evaluaciones recibidas y autoevaluaciones (comprensión, diseño, corrección, complejidad, comunicación) y **pistas progresivas usadas: 0** registradas en [../docs/semana-4/bitacora-dia-3.md](../docs/semana-4/bitacora-dia-3.md).
