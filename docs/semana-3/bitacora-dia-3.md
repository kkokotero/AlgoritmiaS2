# Bitácora — Catálogo Libro Abierto (Semana 3, Día 3)

## Contexto
El reordenamiento nocturno debe procesar todo el catálogo de la red (y en un año ~100.000 libros). Los algoritmos O(n²) resultan demasiado lentos; se requiere un algoritmo con rendimiento garantizado **O(n log n)** e **estable**.

## Objetivo
Implementar **Merge Sort** de forma recursiva, trazar su ejecución y comprobar experimentalmente su complejidad O(n log n).

## Implementación
- `libro-abierto-catalogo/src/ordenamiento.js`:
  - `mezclar(izquierda, derecha, comparar, contadores?)`: combina dos arreglos **ya ordenados** en uno ordenado usando **dos índices** (`i`, `j`), sin usar `sort`. Si los elementos son iguales toma de la izquierda (`<=`) para conservar estabilidad. Cuenta comparaciones y desplazamientos (escrituras al resultado).
  - `mergeSort(arreglo, comparar)`: recursivo (caso base `length <= 1`), **división** con `slice` en mitades, llamadas recursivas y **mezcla**. Devuelve `{ arreglo, comparaciones, intercambios: 0, desplazamientos, pasadas: 0 }`. No muta el original.
- `libro-abierto-catalogo/src/medirMergeSort.js` (`npm run merge`): pruebas de `mezclar`, árbol de divisiones/mezclas, comparaciones vs `n·log₂(n)`, experimento de estabilidad y comparación de tiempos con 4.000 libros.
- `libro-abierto-catalogo/src/laboratorio.js`: Merge Sort agregado al laboratorio (500–4000, 4 estados) con verificación automática.

## 1. Prueba de `mezclar` (dos listas de años ordenadas)
Entrada:
- Izquierda: `[1924, 1967, 2004, 2006]`
- Derecha:   `[1988, 1999, 2002, 2007]`

Salida:
- Resultado: `[1924, 1967, 1988, 1999, 2002, 2004, 2006, 2007]`
- **Comparaciones:** 7, **Desplazamientos (escrituras):** 8

`mezclar` funciona con cualquier comparador y no usa `sort`.

## 2. Árbol de divisiones y mezclas
Arreglo: `[2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002]`

```text
- Dividir: [2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002] -> izq=[2006, 1967, 2004, 1924], der=[1999, 2007, 1988, 2002]
  - Dividir: [2006, 1967, 2004, 1924] -> izq=[2006, 1967], der=[2004, 1924]
    - Dividir: [2006, 1967] -> izq=[2006], der=[1967]
      - Base: [2006]
      - Base: [1967]
    - Mezclar: [2006] + [1967] => [1967, 2006]
    - Dividir: [2004, 1924] -> izq=[2004], der=[1924]
      - Base: [2004]
      - Base: [1924]
    - Mezclar: [2004] + [1924] => [1924, 2004]
  - Mezclar: [1967, 2006] + [1924, 2004] => [1924, 1967, 2004, 2006]
  - Dividir: [1999, 2007, 1988, 2002] -> izq=[1999, 2007], der=[1988, 2002]
    - Dividir: [1999, 2007] -> izq=[1999], der=[2007]
      - Base: [1999]
      - Base: [2007]
    - Mezclar: [1999] + [2007] => [1999, 2007]
    - Dividir: [1988, 2002] -> izq=[1988], der=[2002]
      - Base: [1988]
      - Base: [2002]
    - Mezclar: [1988] + [2002] => [1988, 2002]
  - Mezclar: [1999, 2007] + [1988, 2002] => [1988, 1999, 2002, 2007]
- Mezclar: [1924, 1967, 2004, 2006] + [1988, 1999, 2002, 2007] => [1924, 1967, 1988, 1999, 2002, 2004, 2006, 2007]
```

- **Resultado final:** `[1924, 1967, 1988, 1999, 2002, 2004, 2006, 2007]`
- **Comparaciones totales:** 17, **Desplazamientos:** 24

El árbol muestra todas las divisiones (hasta casos base) y todas las mezclas ascendentes.

## 3. Comparaciones medidas vs `n·log₂(n)` (complejidad O(n log n))
Medición con catálogos generados y comparación por año:

| n | Comparaciones Merge Sort | n·log₂(n) | ¿comparaciones < n·log₂(n)? |
|---:|---:|---:|:---:|
| 1.000 | 8.694 | 9.965,78 | Sí |
| 10.000 | 120.252 | 132.877,12 | Sí |
| 100.000 | 1.533.778 | 1.660.964,05 | Sí |

Las comparaciones se mantienen **por debajo de `n·log₂(n)`** en los tres tamaños, consistente con una complejidad temporal **O(n log n)** (rendimiento garantizado, independiente del estado inicial de los datos). Merge Sort requiere **memoria adicional O(n)** para los arreglos auxiliares de la mezcla/división.

## 4. Experimento de estabilidad (repetición MiniReto 7)
Tabla de prueba y referencia `porAutorYTitulo` (autor y luego título): Laura Restrepo (Delirio, Dulce compañía, La novia oscura), Mario Mendoza (Buda Blues, Cobro de sangre).

**Método del bibliotecario** con Merge Sort: 1º ordenar por **título**, 2º ordenar solo por **autor** sobre ese resultado.

Resultado tras el paso 2:
- Laura Restrepo - Delirio
- Laura Restrepo - Dulce compañía
- Laura Restrepo - La novia oscura
- Mario Mendoza - Buda Blues
- Mario Mendoza - Cobro de sangre

**¿Conserva el orden por título dentro de cada autor? Sí (ESTABLE).**

**Conclusión:** Merge Sort es **estable** porque, al mezclar, cuando dos elementos son iguales según el comparador toma primero el de la sublista izquierda (`<=`), preservando el orden relativo original de claves iguales. A diferencia de Selection Sort (inestable), permite el ordenamiento en dos pasos del bibliotecario sin perder el criterio secundario.

## 5. Merge Sort en el laboratorio y comparación con 4.000 libros
Merge Sort se agregó a `src/laboratorio.js` (500, 1000, 2000, 4000 libros; estados aleatorio, ordenado, invertido y casi ordenado; verificación automática de orden y `sort` nativo como referencia).

**Medición con 4.000 libros (datos aleatorios, comparación por año):**

| Algoritmo | Comparaciones | Tiempo (ms) | ¿Ordenado? |
|---|---:|---:|:---:|
| Bubble Sort | 7.995.299 | 33.769 | Sí |
| Selection Sort | 7.998.000 | 28.812 | Sí |
| Insertion Sort | 3.962.946 | 10.408 | Sí |
| Merge Sort | 42.757 | 1.279 | Sí |

Con 4.000 libros aleatorios, **Merge Sort es mucho más rápido** que los tres algoritmos básicos (≈26× frente a Bubble, ≈22× frente a Selection y ≈8× frente a Insertion en esta medición) y realiza ~187× menos comparaciones que los O(n²), evidenciando la ventaja práctica de O(n log n).

## 6. Archivos relevantes
- `src/ordenamiento.js` (`mezclar`, `mergeSort`, algoritmos básicos)
- `src/medirMergeSort.js` (pruebas, árbol, comparaciones, estabilidad y tiempos)
- `src/laboratorio.js` (incluye Merge Sort)
- `src/comparadores.js`, `src/generador.js` (reutilizados)

---

## Día 3 (continuación): Quick Sort, pivote y comparación con Merge Sort

### Contexto
Bibliotecas con poca memoria requieren un algoritmo que ordene **en el lugar**. Se evalúa Quick Sort y se investiga por qué con datos ya ordenados y un pivote mal elegido el sistema puede bloquearse (peor caso).

### Implementación
- `src/ordenamiento.js`:
  - `particion(arreglo, inicio, fin, comparar, contadores)`: esquema de **Lomuto**, pivote = **último elemento** (`arreglo[fin]`), partición **en el lugar** con índices; devuelve el índice final del pivote y cuenta comparaciones/intercambios.
  - `quickSort(arreglo, comparar)`: recursivo con índices sobre una **copia** del arreglo (pivote fijo = último). Devuelve `{ arreglo, comparaciones, intercambios, desplazamientos: 0, pasadas: 0 }`.
  - `quickSortAleatorio(arreglo, comparar)`: segunda versión con **pivote aleatorio** (se intercambia un elemento aleatorio con el último antes de particionar), también sobre copia.
- `src/medirQuickSort.js` (`npm run quick`): traza de la primera partición, mediciones 10.000 libros, experimento de estabilidad y tabla comparativa.
- `src/laboratorio.js`: ambas versiones agregadas al laboratorio.

### 1. Traza de la primera partición (Lomuto, pivote = último)
Arreglo inicial: `[2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002]`, pivote = `2002` (índice 7), `i = -1`.

| Paso (j) | arr[j] | ¿arr[j] <= pivote? | i | Arreglo tras paso | Intercambio |
|---:|---:|:---:|---:|---|:---:|
| 0 | 2006 | no | -1 | [2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002] | no |
| 1 | 1967 | sí | 0 | [1967, 2006, 2004, 1924, 1999, 2007, 1988, 2002] | sí (swap 0↔1) |
| 2 | 2004 | no | 0 | [1967, 2006, 2004, 1924, 1999, 2007, 1988, 2002] | no |
| 3 | 1924 | sí | 1 | [1967, 1924, 2004, 2006, 1999, 2007, 1988, 2002] | sí (swap 1↔3) |
| 4 | 1999 | sí | 2 | [1967, 1924, 1999, 2006, 2004, 2007, 1988, 2002] | sí (swap 2↔4) |
| 5 | 2007 | no | 2 | [1967, 1924, 1999, 2006, 2004, 2007, 1988, 2002] | no |
| 6 | 1988 | sí | 3 | [1967, 1924, 1999, 1988, 2004, 2007, 2006, 2002] | sí (swap 3↔6) |

Colocar pivote: `posPivote = i + 1 = 4`, swap 4↔7.

- **Resultado tras 1ª partición:** `[1967, 1924, 1999, 1988, 2002, 2007, 2006, 2004]`
- **Índice final del pivote:** 4. **Comparaciones:** 7, **Intercambios:** 5.
- **Subarreglos:** izquierda `[1967, 1924, 1999, 1988]` (≤ 2002), pivote `[2002]`, derecha `[2007, 2006, 2004]` (> 2002).

### 2. Mediciones con 10.000 libros (pivote fijo = último)

| Caso | Estado de datos | Comparaciones | Intercambios | Tiempo (ms) | ¿Ordenado? |
|---|---|---:|---:|---:|:---:|
| A | 10.000 aleatorios | 481.797 | 44.295 | 5.293 | Sí |
| B | 10.000 ya ordenados | 49.995.000 | 0 | 334.934 | Sí |

**Qué ocurre y por qué (peor caso O(n²)):** con datos **ya ordenados** y pivote = **último elemento**, en cada partición de Lomuto todos los elementos son `<= pivote`, por lo que `i` avanza hasta `fin-1`, el pivote queda en la última posición y se generan subproblemas de tamaño **n-1 y 0** (partición totalmente desbalanceada). El trabajo es `(n-1)+(n-2)+...+1 = n·(n-1)/2 ≈ 5×10^7` comparaciones → **O(n²)**, y la profundidad de recursión es **O(n)**. Con n=10.000 esto implica ~10.000 llamadas anidadas que pueden **exceder el límite de pila de llamadas** de Node/V8 (stack overflow), bloqueando/fallando la ejecución (como el incidente reportado). (En la medición aquí se obtuvo el resultado gracias a una mitigación de profundidad de pila en la implementación, pero el costo de comparaciones evidencia el crecimiento cuadrático).

### 3. Segunda versión: pivote aleatorio (repetición con datos ordenados)
Misma entrada: 10.000 libros **ya ordenados**.

| Versión | Comparaciones | Intercambios | Tiempo (ms) | ¿Ordenado? |
|---|---:|---:|---:|:---:|
| Quick Sort pivote aleatorio | 481.666 | 13.811 | 4.511 | Sí |

Elegir el **pivote aleatorio** evita el caso patológico (los datos ordenados ya no fuerzan el peor pivote): las particiones tienden a balancearse y el comportamiento vuelve a **~O(n log n)** en promedio, corrigiendo la degradación observada con pivote fijo.

### 4. Estabilidad de Quick Sort (experimento MiniReto 7)
Método del bibliotecario: 1º ordenar por **título**, 2º ordenar solo por **autor** (misma tabla de prueba). Referencia estable (`mergeSort` + `porAutorYTitulo`): Laura (Delirio, Dulce compañía, La novia oscura), Mario (Buda Blues, Cobro de sangre).

Resultado con **Quick Sort** (pivote fijo): Laura (Delirio, Dulce compañía, La novia oscura), Mario (**Cobro de sangre, Buda Blues**).

**¿Conserva el orden por título dentro de cada autor? No (INESTABLE).** Quick Sort con partición in-place (Lomuto) realiza intercambios de larga distancia y puede alterar el orden relativo de elementos con clave igual, por lo que **no es estable**.

### 5. Comparación Merge Sort vs Quick Sort
| Aspecto | Merge Sort | Quick Sort (pivote fijo, Lomuto) | Quick Sort (pivote aleatorio) |
|---|---|---|---|
| Mejor caso (tiempo) | O(n log n) | O(n log n) | O(n log n) (esperado) |
| Caso promedio (tiempo) | O(n log n) | O(n log n) | O(n log n) |
| Peor caso (tiempo) | O(n log n) (garantizado) | **O(n²)** (p. ej. datos ordenados con pivote último) | O(n²) muy raro; esperado O(n log n) |
| Memoria adicional | **O(n)** (arreglos auxiliares en mezcla) | O(log n) promedio en pila; **O(n)** en peor caso; partición in-place | O(log n) promedio en pila; partición in-place |
| Estabilidad | **Estable** (`<=` al mezclar) | **No estable** | **No estable** |
| Dependencia del estado de datos | Rendimiento garantizado, independiente del orden | Muy sensible al pivote/orden inicial | Robusto frente al orden inicial |

**Conclusión:** Merge Sort garantiza O(n log n) y estabilidad a costa de memoria O(n), ideal para reordenamientos masivos donde importa el criterio secundario. Quick Sort es in-place (bajo uso de memoria auxiliar promedio) y muy rápido en promedio, pero requiere una buena elección de pivote (aleatorio/mediana de tres) para evitar el peor caso O(n²) y no es estable.

### 6. Laboratorio (ambas versiones agregadas)
`src/laboratorio.js` ejecuta Bubble, Selection, Insertion, Merge Sort, **Quick Sort (pivote fijo)**, **Quick Sort (pivote aleatorio)** y `sort` nativo con 500–4000 libros en 4 estados. Verificación automática: **sin FALLA**. En datos ordenados se observa el crecimiento cuadrático del pivote fijo (124.750 → 499.500 → 1.999.000 → 7.998.000 comparaciones, ~×4 al duplicar n) mientras el pivote aleatorio se mantiene en ~n log n; en datos aleatorios ambas versiones de Quick son eficientes.
