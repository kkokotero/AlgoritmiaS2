# Bitácora — Ruta Paisa Planificador (Semana 4)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-4/bitacora-dia-1.md](../docs/semana-4/bitacora-dia-1.md)
- [../docs/semana-4/bitacora-dia-2.md](../docs/semana-4/bitacora-dia-2.md)

## Día 1 — Árbol general de la red
- **NodoArbol** (`src/NodoArbol.js`) y red piloto raíz→líneas→estaciones→servicios (`src/redArbol.js`), 22 apariciones de estaciones y 3 servicios.
- **Recursivos:** `imprimirArbol`, `contarNodos` (29), `contarHojas` (23), `altura` (3). Análisis de estaciones compartidas y alternativa: **grafo**.

## Día 1 — ABB, recorridos y consultas (v0.1)
- **`ArbolBusqueda.js`:** `NodoBinario`/`ArbolBusqueda` con `insertar` (duplicados ignorados), `buscar`, recorridos `inorden/preorden/postorden`, `altura`, `contarHojas/Nodos`, `minimo`, `maximo`, `rango` con poda.
- **Verificaciones:** búsquedas 50→1, 59→7, 10→4, 40→3, 33→`null`; inorden 10–90; preorden reconstruye misma forma; postorden conteo/liberación; `minimo` Niquía (10), `maximo` La Estrella (90), `rango(10,30)` = Niquía, Bello, Acevedo, Andalucía, Santo Domingo, Caribe.
- **Árbol degenerado:** inserción ascendente → 20 niveles (altura 19), `buscar(59)`=15 comp., `buscar(90)`=20 comp.; O(n) vs O(log n).
- **Índice:** `src/indice.js` (`npm start`) con reporte completo.

## Día 2 — Grafo de la red (líneas A, B, K, T)
- **`Grafo.js`:** grafo no dirigido con lista de adyacencia (`Map`), `agregarEstacion`, `conectar` (ambos sentidos, sin duplicar), `vecinos`, `grado`, conteo V/E.
- **`red.js`:** construcción desde líneas (pares consecutivos = conexión), traducción de códigos a nombres con el índice del Día 1.
- **Resultados:** V=20 estaciones, E=21 conexiones; transbordos (grado>2): Caribe(30), Hospital(40), San Antonio(50), Industriales(65), Estadio(56). Dibujo y lista de adyacencia coinciden.
- **Análisis:** grafo resuelve estaciones compartidas (vértice único, sin duplicación) y comparación lista vs matriz de adyacencia justificada (red dispersa: O(V+E) y vecinos por grado real). Detalle en `docs/semana-4/bitacora-dia-2.md`.
