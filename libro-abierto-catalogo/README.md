# Catálogo Libro Abierto v0.3 (Semana 3)

## Qué es
Motor de búsqueda y ordenamiento para el catálogo de la red de bibliotecas **Libro Abierto**. Incluye búsqueda lineal/binaria sobre catálogos grandes, algoritmos de ordenamiento (cuadráticos y Merge Sort O(n log n)) con comparadores, y un laboratorio de rendimiento para decidir qué algoritmo usar en cada proceso.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18

## Modelo de datos (`Libro`)
`{ isbn, titulo, autor, anio, prestamos }`
- `isbn` (string, 13 dígitos; puede haber copias repetidas para simular sedes), `titulo`, `autor`, `anio` (1900–2026), `prestamos` (0–500).

## Búsqueda (v0.1)
| Consulta | Algoritmo |
|---|---|
| Título (exacto) | Búsqueda lineal con retorno temprano |
| Autor (todas las coincidencias) | Búsqueda lineal (recorrido completo) |
| Palabra en título | Búsqueda lineal (recorrido completo) |
| ISBN (cualquier copia) | Búsqueda binaria iterativa/recursiva (catálogo ordenado por ISBN) |
| ISBN (primera ocurrencia entre copias) | Búsqueda binaria lower bound + conteo a la derecha (`primeraPosicionIsbn`) |

## Ordenamiento
Algoritmos en `src/ordenamiento.js` (misma firma `(arreglo, comparar, { traza })` y contadores de comparaciones, intercambios, desplazamientos y pasadas; no mutan el original):
- **Bubble Sort** (v0.2): intercambio de adyacentes, optimizado con corte temprano.
- **Selection Sort** (v0.2): búsqueda del mínimo e intercambio (comparaciones constantes n·(n-1)/2, mínimo de intercambios, **inestable**).
- **Insertion Sort** (v0.2): inserción por desplazamiento (**estable**, aprovecha datos ordenados/casi ordenados).
- **Merge Sort** (v0.3): recursivo y **estable** (`mezclar` con dos índices, sin `sort`, `slice` para dividir). Complejidad garantizada **O(n log n)** y memoria adicional **O(n)**.
- **Quick Sort** (v0.3): partición **en el lugar** (Lomuto) y recursión con índices, sobre copia. `quickSort` usa pivote fijo (último elemento, peor caso O(n²) con datos ordenados, **inestable**); `quickSortAleatorio` usa pivote aleatorio para evitar el caso patológico (~O(n log n) en promedio).

Comparadores en `src/comparadores.js` (también reexportados desde `ordenamiento.js`):
- `porAutorYTitulo` (autor y luego título, `localeCompare("es",{sensitivity:"base"})`, ignora mayúsculas/tildes)
- `porAutor`, `porTitulo`, `porAnio`, `porPrestamosDesc` (más a menos prestados)
- `invertir(comparar)`: recibe un comparador y devuelve el contrario (p. ej. `invertir(porAnio)`).

Generación de datos: `generarCatalogo(n, { copiasRepetidas })` y `casiOrdenado(n, cambios)` en `src/generador.js`.

## Laboratorio de rendimiento
`src/laboratorio.js` ejecuta Bubble, Selection, Insertion, Merge Sort, Quick Sort (pivote fijo y aleatorio) y `sort` nativo (referencia) con **500, 1.000, 2.000 y 4.000** libros en estados **aleatorio, ordenado, invertido y casi ordenado**, mostrando con `console.table` comparaciones, intercambios y tiempo. Verifica automáticamente que cada resultado esté ordenado (marca **FALLA** si no) e incluye resumen del crecimiento del tiempo al duplicar `n`.

## Cómo ejecutarlo
Desde la carpeta `libro-abierto-catalogo/`:

```bash
# v0.3: laboratorio de ordenamiento (Merge/Quick, tabla + verificación + crecimiento)
node src/laboratorio.js
# o
npm run laboratorio

# Merge Sort: mezclar, árbol de divisiones/mezclas, comparaciones vs n·log2(n), estabilidad y tiempos
npm run merge

# Quick Sort: traza de partición, mediciones 10k (aleatorio/ordenado), pivote aleatorio, estabilidad y comparación
npm run quick

# Top-K: ranking de más prestados (Merge Sort vs selección parcial) y comparación k=10/k=5000
npm run topk

# Autocompletar por prefijo (búsqueda binaria de límite inferior) y casos de prueba
npm run autocompletar

# Trazas y mediciones de ordenamiento (Bubble/Selection/Insertion)
npm run ordenamiento

# Experimento de comparadores compuestos y estabilidad
npm run estabilidad

# v0.1: buscador integrado y reporte de consultas
npm run catalogo

# Exploración / búsquedas / binaria
npm run explorar
npm run busqueda
npm run binaria
```

**Salida esperada (`laboratorio.js`):** tabla por (n, estado, algoritmo) con comparaciones, intercambios, tiempo y verificación (OK/FALLA) sin errores, crecimiento al duplicar `n` y verificación automática. **`merge`:** prueba de `mezclar`, árbol de Merge Sort, comparaciones vs `n·log2(n)`, estabilidad y tiempos. **`quick`:** traza de la primera partición, mediciones 10.000 (aleatorio/ordenado), análisis del pivote, versión con pivote aleatorio, estabilidad y comparación Merge vs Quick. **`topk`:** top 10 más prestados y comparación de estrategias (O(n log n) vs O(k·n)) con mediciones para k=10 y k=5000 sobre 10.000 libros. **`autocompletar`:** catálogo ordenado por título (normalizado) y pruebas con prefijo frecuente, único resultado, sin resultados y cadena vacía (con casos borde documentados).

## Estructura
```
libro-abierto-catalogo/
├── src/
│   ├── muestra.js             # Muestra de referencia (8 libros)
│   ├── generador.js           # generarCatalogo, casiOrdenado
│   ├── explorar.js            # Exploración/verificación
│   ├── busqueda.js            # Búsqueda lineal
│   ├── medirBusqueda.js       # Mediciones búsqueda lineal
│   ├── busquedaBinaria.js     # Búsqueda binaria y primera ocurrencia
│   ├── comparacionBinaria.js  # Comparación lineal vs binaria
│   ├── catalogo.js            # Buscador integrado v0.1
│   ├── ordenamiento.js        # Bubble, Selection, Insertion, Merge, Quick (+ comparadores)
│   ├── comparadores.js        # Comparadores compuestos e invertir
│   ├── medirOrdenamiento.js   # Trazas y tabla comparativa (cuadráticos)
│   ├── medirEstabilidad.js    # Experimento de estabilidad
│   ├── medirMergeSort.js      # Trazas, árbol y mediciones de Merge Sort
│   ├── medirQuickSort.js      # Trazas, mediciones y análisis de Quick Sort
│   ├── topk.js                # Top-K: ordenamiento completo y selección parcial
│   ├── medirTopK.js           # Comparación de estrategias Top-K
│   ├── autocompletar.js       # Búsqueda por prefijo (lower bound) y autocompletar
│   ├── probarAutocompletar.js # Pruebas y casos borde de autocompletar
│   └── laboratorio.js         # Laboratorio de rendimiento
├── bitacora.md
├── jsconfig.json
├── package.json
└── README.md
```

## Bitácoras
- [Día 1: modelo, búsquedas, trazas, comparaciones y tabla de decisión](../docs/semana-3/bitacora-dia-1.md)
- [Día 2: ordenamiento cuadrático, estabilidad y recomendaciones](../docs/semana-3/bitacora-dia-2.md)
- [Día 3: Merge Sort, árbol, O(n log n) y estabilidad](../docs/semana-3/bitacora-dia-3.md)
