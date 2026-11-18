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
