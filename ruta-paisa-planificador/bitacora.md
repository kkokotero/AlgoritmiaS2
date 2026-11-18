# Bitácora — Ruta Paisa Planificador (Semana 4)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-4/bitacora-dia-1.md](../docs/semana-4/bitacora-dia-1.md)

## Día 1 — Árbol general de la red
- **NodoArbol** (`src/NodoArbol.js`) y red piloto raíz→líneas→estaciones→servicios (`src/red.js`), 22 apariciones de estaciones y 3 servicios.
- **Recursivos:** `imprimirArbol`, `contarNodos` (29), `contarHojas` (23), `altura` (3). Análisis de estaciones compartidas (San Antonio, Caribe) y alternativa: **grafo**.

## Día 1 — ABB, recorridos y consultas (v0.1)
- **`ArbolBusqueda.js`:** `NodoBinario`/`ArbolBusqueda` con `insertar` (duplicados ignorados, documentado), `buscar` (comparaciones), recorridos `inorden/preorden/postorden`, `altura`, `contarHojas/Nodos`, `minimo`, `maximo`, `rango` con poda.
- **Verificaciones:** búsquedas 50→1, 59→7, 10→4, 40→3, 33→`null`; inorden 10–90; preorden reconstruye misma forma; postorden para conteo/liberación segura; `minimo` Niquía (10), `maximo` La Estrella (90), `rango(10,30)` = Niquía, Bello, Acevedo, Andalucía, Santo Domingo, Caribe.
- **Árbol degenerado:** inserción ascendente → 20 niveles (altura 19), `buscar(59)`=15 comp., `buscar(90)`=20 comp.; explicación de degeneración a lista y complejidad O(n) vs O(log n).
- **Índice:** `src/indice.js` (`npm start`) con reporte completo de consultas. Detalle, dibujos y predicciones en `docs/semana-4/bitacora-dia-1.md`.
