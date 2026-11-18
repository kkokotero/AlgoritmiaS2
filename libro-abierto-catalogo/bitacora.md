# Bitácora - Libro Abierto (Semana 3)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-3/bitacora-dia-1.md](../docs/semana-3/bitacora-dia-1.md) — Modelo, búsquedas, trazas, comparaciones y tabla de decisión (v0.1).
- [../docs/semana-3/bitacora-dia-2.md](../docs/semana-3/bitacora-dia-2.md) — Ordenamiento cuadrático: Selection/Insertion Sort, trazas, datos casi ordenados y comparativa.

## Día 1 (v0.1)
- **Modelo de datos:** `Libro` (`isbn` string 13 dígitos, `titulo`, `autor`, `anio`, `prestamos`) y muestra de 8 libros.
- **Generador:** `generarCatalogo(n, { copiasRepetidas })` con ISBN únicos base y opción de copias repetidas del mismo ISBN.
- **Búsquedas y trazas:** lineal (título/autor/palabra) y binaria iterativa/recursiva por ISBN; `primeraPosicionIsbn` para copias.
- **Tablas:** comparaciones lineal y lineal vs binaria; tabla de decisión por tipo de consulta.
- **Buscador integrado:** `src/catalogo.js` con reporte (algoritmo, resultado, comparaciones).

## Día 2
- **Ordenamiento:** `bubbleSort`, `selectionSort`, `insertionSort` en `src/ordenamiento.js` con contadores (comparaciones, intercambios, desplazamientos, pasadas) y trazas.
- **Generador:** `casiOrdenado(n, cambios)` (catálogo ordenado por año con pocos libros fuera de lugar al final).
- **Trazas:** arreglo `[2006, 1967, 2004, 1924, 1999]` tras cada pasada para los tres algoritmos.
- **Mediciones:** 2.000 libros en estados aleatorio, ordenado, invertido y casi ordenado. Insertion Sort aprovecha mejor los datos casi ordenados; Selection Sort hace menos intercambios y comparaciones constantes; los tres son O(n²) en el peor caso.
