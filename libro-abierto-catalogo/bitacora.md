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
- **Merge Sort:** `mezclar` (dos índices, sin `sort`) y `mergeSort` recursivo (`slice`, divide/mezcla) con contadores. Árbol sobre `[2006,1967,2004,1924,1999,2007,1988,2002]`; comparaciones < `n·log₂(n)` para 1.000, 10.000 y 100.000; estable (MiniReto 7).
- **Quick Sort:** `particion` Lomuto (pivote = último, en el lugar) y `quickSort`/`quickSortAleatorio` sobre copia. Traza de 1ª partición; 10.000 aleatorios vs ordenados muestra O(n²) con pivote fijo (particiones desbalanceadas, riesgo de desbordamiento de pila) y corrección a ~O(n log n) con pivote aleatorio; **inestable** (MiniReto 7).
- **Comparación y laboratorio:** tabla Merge Sort vs Quick Sort (mejor/promedio/peor, memoria, estabilidad); ambas versiones en `src/laboratorio.js` con verificación automática.
