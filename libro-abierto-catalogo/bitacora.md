# Bitácora - Libro Abierto (Semana 3)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-3/bitacora-dia-1.md](../docs/semana-3/bitacora-dia-1.md) — Modelo, búsquedas, trazas, comparaciones y tabla de decisión (v0.1).
- [../docs/semana-3/bitacora-dia-2.md](../docs/semana-3/bitacora-dia-2.md) — Ordenamiento cuadrático, estabilidad, laboratorio y recomendaciones (v0.2).
- [../docs/semana-3/bitacora-dia-3.md](../docs/semana-3/bitacora-dia-3.md) — Merge Sort recursivo, árbol, O(n log n) y estabilidad.

## Día 1 (v0.1)
- **Modelo y generador:** `Libro` (isbn/titulo/autor/anio/prestamos), muestra y `generarCatalogo(n, { copiasRepetidas })`.
- **Búsquedas y trazas:** lineal (título/autor/palabra) y binaria iterativa/recursiva por ISBN; `primeraPosicionIsbn` para copias.
- **Tablas y decisión:** comparaciones lineal vs binaria y tabla de decisión por consulta. Buscador `src/catalogo.js`.

## Día 2 (v0.2)
- **Ordenamiento:** `bubbleSort`, `selectionSort`, `insertionSort` con contadores/trazas; `casiOrdenado(n,cambios)`.
- **Mediciones y estabilidad:** 2.000 libros en 4 estados; comparadores compuestos e `invertir`; experimento de estabilidad (Bubble/Insertion estables, Selection inestable).
- **Laboratorio:** `src/laboratorio.js` (500–4000, 4 estados, + `sort` nativo, verificación y crecimiento) y recomendaciones.

## Día 3
- **Merge Sort:** `mezclar` y `mergeSort` recursivo con contadores. Árbol sobre `[2006,1967,2004,1924,1999,2007,1988,2002]`; comparaciones < `n·log₂(n)` para 1.000, 10.000 y 100.000; estable (MiniReto 7).
- **Quick Sort:** `particion` Lomuto (pivote último) y `quickSort`/`quickSortAleatorio`. Traza 1ª partición; 10.000 aleatorios vs ordenados evidencia O(n²) con pivote fijo y corrección con pivote aleatorio (~O(n log n)); inestable. Comparación Merge vs Quick en bitácora.
- **Laboratorio:** Bubble/Selection/Insertion/Merge/Quick fijo/Quick aleatorio/`sort` nativo (500–4000, 4 estados) con verificación automática OK/FALLA.
- **Top-K y autocompletar:** `topPrestados` (Merge Sort, O(n log n)) vs `topPrestadosSeleccion` (k pasadas, O(k·n)) comparados con k=10 y k=5000 sobre 10.000; `ordenarPorTitulo`, `primeraPosicionPrefijo` (lower bound) y `autocompletar` (O(log n + k), normalización sin mayúsculas/tildes) con casos frecuente/único/sin resultados/cadena vacía.
