# Catálogo Libro Abierto v1.0 (Semana 3)

## Descripción del producto
**Catálogo Libro Abierto** es el motor de búsqueda y ordenamiento para la red de bibliotecas comunitarias del Valle de Aburrá. Integra generación de catálogos, consultas por título/autor/palabra/ISBN, ranking de libros más prestados y autocompletar por prefijo, implementando los algoritmos de búsqueda y ordenamiento propios (sin usar `sort` del lenguaje en los módulos del producto).

Funcionalidades principales:
- **Consultas:** por título (búsqueda lineal con normalización), por autor y por palabra (búsqueda lineal), por ISBN con **búsqueda binaria** (iterativa/recursiva/lower bound para copias) sobre copia ordenada por ISBN.
- **Ordenamiento:** Bubble Sort, Selection Sort, Insertion Sort, **Merge Sort** (estable, O(n log n)) y **Quick Sort** (pivote fijo y aleatorio) con comparadores compuestos.
- **Ranking (Top-K):** top de libros más prestados con ordenamiento completo (Merge Sort) y alternativa por selección parcial.
- **Autocompletar:** sugerencias por prefijo de título usando **búsqueda binaria de límite inferior** sobre catálogo ordenado por título normalizado (sin mayúsculas/tildes), O(log n + k).
- **Laboratorio de rendimiento:** comparación de algoritmos con verificación automática de orden y mediciones.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18

No requiere dependencias externas (`npm install` no es necesario).

## Cómo ejecutar

### Catálogo (demostración completa)
Desde la carpeta `libro-abierto-catalogo/`:

```bash
node src/catalogo.js
# o
npm run catalogo
```

**Salida esperada:** demostración con un solo comando que incluye generación de 10.000 libros y copias ordenadas preparadas con **Merge Sort propio** (por ISBN y por título), consultas por título/autor/ISBN (búsqueda lineal y binaria con comparaciones), top 10 de libros más prestados, tres ejemplos de autocompletar y un catálogo de exhibición ordenado por año (Merge Sort).

### Laboratorio de rendimiento
```bash
node src/laboratorio.js
# o
npm run laboratorio
```

**Salida esperada:** tabla comparativa de los **cinco algoritmos** (Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort aleatorio) con tamaños **1.000, 10.000 y 100.000** libros (los algoritmos básicos solo hasta 10.000), estados aleatorio/ordenado/invertido/casi ordenado, comparaciones/intercambios/tiempo y verificación automática (**OK/FALLA**) de que todos ordenan correctamente. Con 100.000 libros, Merge Sort y Quick Sort (aleatorio) terminan en menos de un segundo.

### Otros scripts
```bash
npm run explorar       # Generación/verificación del catálogo (10.000)
npm run busqueda       # Mediciones y traza de búsqueda lineal
npm run binaria        # Trazas y comparación lineal vs binaria por ISBN
npm run ordenamiento   # Trazas y mediciones Bubble/Selection/Insertion
npm run estabilidad    # Comparadores compuestos y experimento de estabilidad
npm run merge          # Merge Sort: mezclar, árbol, comparaciones vs n·log2(n), estabilidad
npm run quick          # Quick Sort: traza de partición, pivote fijo/aleatorio, comparación
npm run topk           # Ranking Top-K y comparación O(n log n) vs O(k·n)
npm run autocompletar  # Búsqueda por prefijo (lower bound) y casos de prueba
```

## Tabla de algoritmos

| Algoritmo | Complejidad (mejor / promedio / peor) | Estable | Dónde se usa en Libro Abierto |
|---|---|:---:|---|
| Búsqueda lineal | O(1) / O(n) / O(n) | N/A | Consultas por título, autor y palabra (`src/busqueda.js`, `src/catalogo.js`) |
| Búsqueda binaria (iterativa, recursiva, lower bound) | O(1) / O(log n) / O(log n) | N/A | Consulta por ISBN y primera ocurrencia en copia ordenada (`src/busquedaBinaria.js`); límite inferior para autocompletar (`src/autocompletar.js`) |
| Bubble Sort (optimizado) | O(n) / O(n²) / O(n²) | Sí | Laboratorio y mediciones comparativas (`src/ordenamiento.js`, `src/laboratorio.js`) |
| Selection Sort | O(n²) / O(n²) / O(n²) (comparaciones constantes) | No | Laboratorio/comparación; referencia de mínimos intercambios |
| Insertion Sort | O(n) / O(n²) / O(n²) | Sí | Laboratorio; recomendado para datos casi ordenados/inserciones |
| Merge Sort (recursivo) | O(n log n) / O(n log n) / O(n log n), mem. O(n) | Sí | Preparación de copias ordenadas por ISBN y por título, ranking Top-K, exhibición por año y generación de estados (`src/catalogo.js`, `src/topk.js`, `src/autocompletar.js`, `src/laboratorio.js`) |
| Quick Sort (pivote fijo, Lomuto) | O(n log n) / O(n log n) / O(n²) | No | Análisis de pivote y peor caso en laboratorio/mediciones (`src/ordenamiento.js`, `src/medirQuickSort.js`) |
| Quick Sort (pivote aleatorio) | O(n log n) / O(n log n) esperado / O(n²) raro, mem. pila O(log n) prom. | No | Alternativa eficiente in-place en laboratorio y recomendado para catálogos grandes sin requisito de estabilidad (`src/laboratorio.js`) |

## Decisiones técnicas

Recomendaciones actualizadas con los algoritmos avanzados (respaldadas por el laboratorio y mediciones de la semana):

1. **Reordenamiento nocturno del catálogo completo (10.000 libros, creciendo a 100.000): usar Merge Sort (o Quick Sort con pivote aleatorio), no algoritmos O(n²).**  
   *Antes (Día 2):* se sugería `sort` nativo por el costo O(n²). *Actualizado:* con implementaciones propias, **Merge Sort** garantiza **O(n log n)** y es **estable** (conserva criterios secundarios), terminando con 100.000 libros aleatorios en ~39 ms en el laboratorio (verificación OK). **Quick Sort con pivote aleatorio** es una alternativa in-place rápida (~103 ms con 100.000) cuando la memoria es limitada y no se requiere estabilidad. Los algoritmos cuadráticos no escalan: con 10.000 ya toman del orden de 10²–10³ ms según el estado, y crecerían ~×100 al pasar a 100.000.

2. **Inserción diaria de libros que llegan (catálogo casi ordenado): Insertion Sort para inserciones incrementales; Merge Sort para reordenamientos de lotes grandes.**  
   *Antes (Día 2):* Insertion Sort por aprovechar datos casi ordenados. *Actualizado:* se mantiene: en casi ordenado (2.000, 20 fuera de lugar) Insertion hizo ~37k comparaciones/0.08 ms frente a ~2M comparaciones de Bubble/Selection. Para pocos libros que llegan al final, insertar de forma incremental con Insertion es eficiente y **estable**. Si el lote diario es grande o se requiere reordenar todo el catálogo, **Merge Sort** ofrece O(n log n) garantizado.

3. **Listas pequeñas de exhibición (~20 libros): algoritmo cuadrático simple es suficiente; preferible Insertion Sort.**  
   *Antes (Día 2):* cuadrático simple, Insertion preferible. *Actualizado:* se confirma: con n=20 el trabajo máximo es ~190 comparaciones, irrelevante en tiempo. **Insertion Sort** es preferible por ser **estable**, adaptativo si la lista ya viene casi ordenada y simple de aplicar con comparadores (p. ej. por año o por autor y título). Para exhibiciones derivadas del catálogo completo, generarlas con **Merge Sort** y un comparador compuesto garantiza orden correcto y estable.

## Estructura
```
libro-abierto-catalogo/
├── src/
│   ├── muestra.js             # Muestra de referencia
│   ├── generador.js           # generarCatalogo, casiOrdenado (Merge Sort propio)
│   ├── explorar.js            # Exploración/verificación
│   ├── busqueda.js            # Búsqueda lineal (título, autor, palabra)
│   ├── busquedaBinaria.js     # Búsqueda binaria por ISBN y primera ocurrencia
│   ├── autocompletar.js       # Orden por título normalizado y autocompletar (lower bound)
│   ├── topk.js                # Top-K: ordenamiento completo y selección parcial
│   ├── catalogo.js            # Demostración completa v1.0
│   ├── ordenamiento.js        # Bubble, Selection, Insertion, Merge, Quick (+ comparadores)
│   ├── comparadores.js        # Comparadores compuestos e invertir
│   ├── laboratorio.js         # Laboratorio de rendimiento v1.0
│   ├── medirBusqueda.js       # Mediciones búsqueda lineal
│   ├── comparacionBinaria.js  # Comparación lineal vs binaria
│   ├── medirOrdenamiento.js   # Trazas/mediciones cuadráticos
│   ├── medirEstabilidad.js    # Experimento de estabilidad
│   ├── medirMergeSort.js      # Árbol y mediciones Merge Sort
│   ├── medirQuickSort.js      # Traza y análisis Quick Sort
│   ├── medirTopK.js           # Comparación Top-K
│   └── probarAutocompletar.js # Pruebas de autocompletar
├── bitacora.md                # Índice de bitácoras
├── jsconfig.json
├── package.json
└── README.md
```

## Bitácoras
Las bitácoras detalladas (trazas, mediciones, experimentos y decisiones) están en [`docs/semana-3/`](../docs/semana-3/):
- [Día 1: modelo, búsquedas, trazas, comparaciones y tabla de decisión](../docs/semana-3/bitacora-dia-1.md)
- [Día 2: ordenamiento cuadrático, estabilidad, laboratorio y recomendaciones](../docs/semana-3/bitacora-dia-2.md)
- [Día 3: Merge/Quick Sort, Top-K, autocompletar, laboratorio v1.0 y cierre](../docs/semana-3/bitacora-dia-3.md)

> Nota: el producto no usa `Array.prototype.sort` en sus módulos (`src/catalogo.js`, `src/generador.js`, `src/busquedaBinaria.js`, etc.); las copias ordenadas se preparan con Merge Sort propio. Los scripts de medición/traza históricos pueden conservar llamadas a `sort` con fines comparativos.
