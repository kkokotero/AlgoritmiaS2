# Catálogo Libro Abierto v0.2 (Semana 3)

## Qué es
Motor de búsqueda y ordenamiento para el catálogo de la red de bibliotecas **Libro Abierto**. Incluye búsqueda lineal/binaria sobre catálogos grandes, algoritmos de ordenamiento cuadráticos con comparadores y un laboratorio de rendimiento para decidir qué algoritmo usar en cada proceso.

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

## Ordenamiento (v0.2)
Algoritmos implementados en `src/ordenamiento.js` (misma firma `(arreglo, comparar, { traza })` y contadores de comparaciones, intercambios, desplazamientos y pasadas; no mutan el original):
- **Bubble Sort**: intercambio de adyacentes, optimizado con corte temprano.
- **Selection Sort**: búsqueda del mínimo e intercambio (comparaciones constantes n·(n-1)/2, mínimo de intercambios, **inestable**).
- **Insertion Sort**: inserción por desplazamiento (**estable**, aprovecha datos ordenados/casi ordenados).

Comparadores en `src/comparadores.js` (también reexportados desde `ordenamiento.js`):
- `porAutorYTitulo` (autor y luego título, `localeCompare("es",{sensitivity:"base"})`, ignora mayúsculas/tildes)
- `porAutor`, `porTitulo`, `porAnio`, `porPrestamosDesc` (más a menos prestados)
- `invertir(comparar)`: recibe un comparador y devuelve el contrario (p. ej. `invertir(porAnio)`).

Generación de datos: `generarCatalogo(n, { copiasRepetidas })` y `casiOrdenado(n, cambios)` en `src/generador.js`.

## Laboratorio de rendimiento
`src/laboratorio.js` ejecuta Bubble, Selection, Insertion y `sort` nativo (referencia de tiempo) con **500, 1.000, 2.000 y 4.000** libros en estados **aleatorio, ordenado, invertido y casi ordenado**, mostrando con `console.table` comparaciones, intercambios y tiempo. Verifica automáticamente que cada resultado esté ordenado (marca **FALLA** si no) e incluye resumen del crecimiento del tiempo al duplicar `n`.

## Cómo ejecutarlo
Desde la carpeta `libro-abierto-catalogo/`:

```bash
# v0.2: laboratorio de ordenamiento (tabla completa + verificación + crecimiento)
node src/laboratorio.js
# o
npm run laboratorio

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

**Salida esperada (`laboratorio.js`):** tabla de resultados por (n, estado, algoritmo) con comparaciones, intercambios, tiempo y verificación (OK/FALLA) sin errores, tabla de crecimiento al duplicar `n` y mensaje de verificación automática.

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
│   ├── ordenamiento.js        # Bubble, Selection, Insertion (+ comparadores)
│   ├── comparadores.js        # Comparadores compuestos e invertir
│   ├── medirOrdenamiento.js   # Trazas y tabla comparativa
│   ├── medirEstabilidad.js    # Experimento de estabilidad
│   └── laboratorio.js         # Laboratorio de rendimiento v0.2
├── bitacora.md
├── jsconfig.json
├── package.json
└── README.md
```

## Bitácoras
- [Día 1: modelo, búsquedas, trazas, comparaciones y tabla de decisión](../docs/semana-3/bitacora-dia-1.md)
- [Día 2: ordenamiento, trazas, estabilidad y recomendaciones](../docs/semana-3/bitacora-dia-2.md)
