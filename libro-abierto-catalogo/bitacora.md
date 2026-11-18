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

## Día 2 (v0.2)
- **Ordenamiento:** `bubbleSort`, `selectionSort`, `insertionSort` en `src/ordenamiento.js` con contadores y trazas. `casiOrdenado(n, cambios)` en `src/generador.js`.
- **Trazas y mediciones:** `[2006,1967,2004,1924,1999]` y 2.000 libros en 4 estados. Insertion aprovecha datos casi ordenados; Selection hace menos intercambios y comparaciones constantes; los tres O(n²) en peor caso.
- **Criterios múltiples y estabilidad:** `src/comparadores.js` (`porAutorYTitulo`, `porPrestamosDesc`, `invertir`), experimento del bibliotecario con trazas en `src/medirEstabilidad.js`; Bubble/Insertion estables, Selection inestable; definición de estabilidad con ejemplo.
- **Laboratorio v0.2:** `src/laboratorio.js` (500–4000, 4 estados, 3 algoritmos + `sort` nativo, `console.table`, verificación automática OK/FALLA, crecimiento al duplicar n). Recomendaciones: nocturno 10.000 → `sort` nativo; inserción diaria casi ordenada → Insertion Sort; exhibición 20 → cuadrático simple (Insertion preferible).
