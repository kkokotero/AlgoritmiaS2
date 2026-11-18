# Bitácora — Catálogo Libro Abierto (Semana 3, Día 2)

## Contexto
Las bibliotecas agregan libros nuevos al final de un catálogo casi ordenado. Se comparan algoritmos de ordenamiento cuadráticos para observar cómo el estado inicial de los datos afecta su rendimiento.

## Objetivo
Implementar **Selection Sort** e **Insertion Sort** (con los mismos contadores que Bubble Sort) y analizar cómo el estado inicial de los datos afecta su rendimiento.

## Implementación
- `libro-abierto-catalogo/src/ordenamiento.js`:
  - `bubbleSort(arreglo, comparar, { traza })`: intercambio de adyacentes, optimizado con corte temprano si no hay intercambios en una pasada.
  - `selectionSort(arreglo, comparar, { traza })`: búsqueda del mínimo en la parte no ordenada e intercambio con la posición actual.
  - `insertionSort(arreglo, comparar, { traza })`: inserción del elemento actual en la parte ordenada mediante **desplazamientos**.
  - Todos reciben `(arreglo, comparar)` y devuelven `{ arreglo, comparaciones, intercambios, desplazamientos, pasadas }` (y `traza` opcional con el arreglo tras cada pasada). No mutan el arreglo original.
- `libro-abierto-catalogo/src/generador.js`: `casiOrdenado(n, cambios)` devuelve un catálogo ordenado por año con `cambios` libros fuera de lugar al final (intercambiados con posiciones anteriores).
- `libro-abierto-catalogo/src/medirOrdenamiento.js`: trazas sobre `[2006, 1967, 2004, 1924, 1999]` y mediciones con 2.000 libros en 4 estados (aleatorio, ordenado, invertido, casi ordenado) para los 3 algoritmos.

## 1. Trazas (arreglo de años `[2006, 1967, 2004, 1924, 1999]`, orden ascendente)

### Bubble Sort (intercambio de adyacentes)
| Pasada | Arreglo tras la pasada |
|---:|---|
| Inicial | [2006, 1967, 2004, 1924, 1999] |
| 1 | [1967, 2004, 1924, 1999, 2006] |
| 2 | [1967, 1924, 1999, 2004, 2006] |
| 3 | [1924, 1967, 1999, 2004, 2006] |
| 4 | [1924, 1967, 1999, 2004, 2006] |

Contadores: **comparaciones 10, intercambios 7, desplazamientos 0, pasadas 4**.

### Selection Sort (búsqueda del mínimo)
| Pasada | Arreglo tras la pasada |
|---:|---|
| Inicial | [2006, 1967, 2004, 1924, 1999] |
| 1 | [1924, 1967, 2004, 2006, 1999] |
| 2 | [1924, 1967, 2004, 2006, 1999] |
| 3 | [1924, 1967, 1999, 2006, 2004] |
| 4 | [1924, 1967, 1999, 2004, 2006] |

Contadores: **comparaciones 10, intercambios 3, desplazamientos 0, pasadas 4**.

### Insertion Sort (desplazamiento)
| Pasada | Arreglo tras la pasada |
|---:|---|
| Inicial | [2006, 1967, 2004, 1924, 1999] |
| 1 | [1967, 2006, 2004, 1924, 1999] |
| 2 | [1967, 2004, 2006, 1924, 1999] |
| 3 | [1924, 1967, 2004, 2006, 1999] |
| 4 | [1924, 1967, 1999, 2004, 2006] |

Contadores: **comparaciones 9, intercambios 0, desplazamientos 11, pasadas 4**.

## 2. Mediciones con 2.000 libros (4 estados × 3 algoritmos)
Estados generados: **aleatorio** (`generarCatalogo`), **ordenado** por año ascendente, **invertido** por año descendente y **casi ordenado** (`casiOrdenado(2000, 20)`, 20 fuera de lugar al final). Todos ordenan correctamente los cuatro estados.

| Estado | Algoritmo | Comparaciones | Intercambios | Desplazamientos | Pasadas | Tiempo (ms) | ¿Ordenado? |
|---|---|---:|---:|---:|---:|---:|:---:|
| Aleatorio | Bubble Sort | 1.997.109 | 973.049 | 0 | 1.938 | 7.906 | Sí |
| Aleatorio | Selection Sort | 1.999.000 | 1.975 | 0 | 1.999 | 6.606 | Sí |
| Aleatorio | Insertion Sort | 975.044 | 0 | 975.028 | 1.999 | 3.832 | Sí |
| Ordenado | Bubble Sort | 1.999 | 0 | 0 | 1 | 0.059 | Sí |
| Ordenado | Selection Sort | 1.999.000 | 0 | 0 | 1.999 | 3.903 | Sí |
| Ordenado | Insertion Sort | 1.999 | 0 | 0 | 1.999 | 0.021 | Sí |
| Invertido | Bubble Sort | 1.998.964 | 1.983.071 | 0 | 1.991 | 6.516 | Sí |
| Invertido | Selection Sort | 1.999.000 | 1.370 | 0 | 1.999 | 4.134 | Sí |
| Invertido | Insertion Sort | 1.984.944 | 0 | 1.985.055 | 1.999 | 3.374 | Sí |
| Casi ordenado (20 fuera de lugar al final) | Bubble Sort | 1.988.847 | 35.538 | 0 | 1.857 | 3.789 | Sí |
| Casi ordenado (20 fuera de lugar al final) | Selection Sort | 1.999.000 | 161 | 0 | 1.999 | 3.870 | Sí |
| Casi ordenado (20 fuera de lugar al final) | Insertion Sort | 37.537 | 0 | 37.384 | 1.999 | 0.080 | Sí |

> Los tiempos son orientativos (dependen del entorno/ejecución); las comparaciones, intercambios, desplazamientos y pasadas son los valores determinantes del comportamiento.

## 3. Respuestas (con base en las mediciones)

### ¿Cuál hace menos intercambios?
**Selection Sort.** En cada pasada selecciona el mínimo y realiza **a lo sumo 1 intercambio** (y ninguno si ya está en su lugar), por lo que hace como máximo *n-1* intercambios en total. En las mediciones: 0–1.975 intercambios según el estado, frente a los intercambios masivos de Bubble (0 a ~1.98M) e Insertion, que no realiza intercambios sino **desplazamientos** (0 intercambios en todos los casos).

### ¿Cuál aprovecha mejor los datos casi ordenados?
**Insertion Sort.** Al estar casi todo ordenado, cada elemento nuevo se inserta con muy pocos desplazamientos/comparaciones. En el estado casi ordenado (20 fuera de lugar al final) hizo solo **37.537 comparaciones y 37.384 desplazamientos** (~0.080 ms), mientras Bubble y Selection siguieron cerca de ~2 millones de comparaciones (~3.8–3.9 ms). También es el más rápido en el estado ya ordenado (1.999 comparaciones, 0.021 ms).

### ¿Cuál hace siempre la misma cantidad de comparaciones sin importar los datos?
**Selection Sort.** Siempre recorre la porción no ordenada para buscar el mínimo: realiza **1.999.000 comparaciones** (n·(n-1)/2 para n=2000) en los cuatro estados (aleatorio, ordenado, invertido y casi ordenado). Bubble (optimizado) e Insertion varían sus comparaciones según el orden inicial (p. ej. 1.999 en ordenado vs ~2M en invertido para Bubble, o 1.999 vs ~1.98M para Insertion).

## 4. ¿Por qué los tres son O(n²) en el peor caso aunque sus mediciones sean muy diferentes?
Los tres algoritmos se basan en recorridos anidados sobre el arreglo:
- **Bubble Sort:** compara (y puede intercambiar) pares adyacentes en pasadas sucesivas; en el peor caso (invertido) realiza ~n²/2 comparaciones e intercambios.
- **Selection Sort:** en cada una de las n-1 pasadas busca el mínimo entre los n-i elementos restantes, sumando (n-1)+(n-2)+…+1 = **n·(n-1)/2** comparaciones siempre (incluido el peor caso).
- **Insertion Sort:** en el peor caso (invertido) cada elemento debe desplazarse hasta el inicio, acumulando ~n²/2 comparaciones y desplazamientos.

Aunque son **O(n²)** en el peor caso, las mediciones difieren porque: (1) las constantes y el tipo de operación cambian (comparar vs intercambiar vs desplazar tienen costos distintos), (2) Bubble e Insertion pueden terminar antes o hacer mucho menos trabajo en datos favorables (ordenados/casi ordenados, mejores casos O(n) para Bubble optimizado e Insertion), y (3) Selection mantiene comparaciones fijas pero minimiza intercambios. La notación O(n²) describe el crecimiento asintótico en el peor caso, no el tiempo/operaciones exactas en cada escenario.

## 5. Archivos relevantes
- `libro-abierto-catalogo/src/ordenamiento.js` (Bubble, Selection, Insertion con contadores y traza)
- `libro-abierto-catalogo/src/generador.js` (`generarCatalogo`, `casiOrdenado(n, cambios)`)
- `libro-abierto-catalogo/src/medirOrdenamiento.js` (trazas y tabla comparativa)

---

## Día 2 (continuación): Criterios múltiples y estabilidad

### Contexto
Inventario anual: ordenar por **autor** y, dentro de cada autor, por **título**. Se investiga por qué el método del bibliotecario (primero por título, luego por autor) funciona con unos algoritmos y con otros revuelve los títulos.

**Tabla de prueba:**

| Autor | Título | Año |
|---|---|---:|
| Laura Restrepo | Delirio | 2004 |
| Mario Mendoza | Cobro de sangre | 2004 |
| Laura Restrepo | Dulce compañía | 1995 |
| Mario Mendoza | Buda Blues | 2009 |
| Laura Restrepo | La novia oscura | 1999 |

### Implementación (`libro-abierto-catalogo/src/comparadores.js`)
- `porAutorYTitulo(a,b)`: comparador compuesto; compara primero por autor y, si son iguales, por título. Ignora mayúsculas y tildes con `localeCompare(..., "es", { sensitivity: "base" })`.
- `porAutor(a,b)`, `porTitulo(a,b)`, `porAnio(a,b)`.
- `porPrestamosDesc(a,b)`: ordena de más a menos prestados (`b.prestamos - a.prestamos`).
- `invertir(comparar)`: función que recibe un comparador y devuelve el comparador contrario (`(a,b) => -comparar(a,b)`), sin escribir un comparador nuevo (ej. `invertir(porAnio)` → más reciente a más antiguo).

Script de experimento: `src/medirEstabilidad.js` (`npm run estabilidad`).

### 1. Orden con comparador compuesto `porAutorYTitulo`
Los tres algoritmos (Bubble, Selection, Insertion) producen el mismo resultado:

| # | Autor | Título |
|---:|---|---|
| 1 | Laura Restrepo | Delirio |
| 2 | Laura Restrepo | Dulce compañía |
| 3 | Laura Restrepo | La novia oscura |
| 4 | Mario Mendoza | Buda Blues |
| 5 | Mario Mendoza | Cobro de sangre |

Laura Restrepo aparece primero y sus tres títulos quedan en orden alfabético; igual para Mario Mendoza.

### 2. Método del bibliotecario: primero por título, luego solo por autor
**Paso 1 (por título, igual en los tres algoritmos):**

| # | Autor | Título |
|---:|---|---|
| 1 | Mario Mendoza | Buda Blues |
| 2 | Mario Mendoza | Cobro de sangre |
| 3 | Laura Restrepo | Delirio |
| 4 | Laura Restrepo | Dulce compañía |
| 5 | Laura Restrepo | La novia oscura |

(Dentro de cada autor ya quedó orden por título: Mendoza [Buda Blues, Cobro de sangre]; Restrepo [Delirio, Dulce compañía, La novia oscura]).

**Paso 2 (ordenar solo por autor sobre el resultado del paso 1) — trazas y resultado:**

#### Bubble Sort (paso 2)
| Pasada | Arreglo tras la pasada (Autor:Título) |
|---:|---|
| 1 | Mario:Buda Blues \| Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura \| Mario:Cobro de sangre |
| 2 | Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura \| Mario:Buda Blues \| Mario:Cobro de sangre |
| 3 | Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura \| Mario:Buda Blues \| Mario:Cobro de sangre |

**Resultado final:** Laura (Delirio, Dulce compañía, La novia oscura), Mario (Buda Blues, Cobro de sangre). **Conserva el orden por título dentro de cada autor → estable.**

#### Selection Sort (paso 2) — **inestable**
| Pasada | Arreglo tras la pasada (Autor:Título) |
|---:|---|
| 1 | Laura:Delirio \| Mario:Cobro de sangre \| Mario:Buda Blues \| Laura:Dulce compañía \| Laura:La novia oscura |
| 2 | Laura:Delirio \| Laura:Dulce compañía \| Mario:Buda Blues \| Mario:Cobro de sangre \| Laura:La novia oscura |
| 3 | Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura \| Mario:Cobro de sangre \| Mario:Buda Blues |
| 4 | Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura \| Mario:Cobro de sangre \| Mario:Buda Blues |

**Resultado final:** Laura (Delirio, Dulce compañía, La novia oscura), Mario (**Cobro de sangre, Buda Blues**). **No conserva el orden por título dentro de Mario Mendoza → inestable.**

**Explicación con la traza (por qué ocurre la inestabilidad):** al inicio del paso 2, los dos libros de Mario Mendoza estaban en orden de título: `[Mario:Buda Blues, Mario:Cobro de sangre, ...]`. En la **pasada 1**, Selection Sort busca el mínimo por autor desde el índice 0 y encuentra `Laura:Delirio` (índice 2); intercambia la posición 0 con la 2 de forma **no adyacente**, produciendo `[Laura:Delirio, Mario:Cobro de sangre, Mario:Buda Blues, ...]`. Ese intercambio de larga distancia “saltó” a `Buda Blues` por encima de `Cobro de sangre`, invirtiendo el orden relativo de dos elementos con **clave igual** (mismo autor). Como Selection Sort mueve elementos lejanos sin preservar el orden relativo de los iguales, el resultado final deja a Mendoza como [Cobro de sangre, Buda Blues] en lugar de [Buda Blues, Cobro de sangre].

#### Insertion Sort (paso 2)
| Pasada | Arreglo tras la pasada (Autor:Título) |
|---:|---|
| 1 | Mario:Buda Blues \| Mario:Cobro de sangre \| Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura |
| 2 | Laura:Delirio \| Mario:Buda Blues \| Mario:Cobro de sangre \| Laura:Dulce compañía \| Laura:La novia oscura |
| 3 | Laura:Delirio \| Laura:Dulce compañía \| Mario:Buda Blues \| Mario:Cobro de sangre \| Laura:La novia oscura |
| 4 | Laura:Delirio \| Laura:Dulce compañía \| Laura:La novia oscura \| Mario:Buda Blues \| Mario:Cobro de sangre |

**Resultado final:** Laura (Delirio, Dulce compañía, La novia oscura), Mario (Buda Blues, Cobro de sangre). **Conserva el orden por título dentro de cada autor → estable.** (Insertion desplaza solo cuando el elemento anterior es **mayor** que el actual, no cuando es igual).

**Conclusión del experimento:** Bubble Sort e Insertion Sort son **estables** y conservan el orden por título dentro de cada autor al reordenar solo por autor; **Selection Sort es inestable** y puede invertir el orden relativo de elementos con igual clave.

### 3. Comparadores adicionales
- `porPrestamosDesc(a,b)`: ordena de más a menos prestados. Resultado en la tabla: Delirio (201), Dulce compañía (180), La novia oscura (150), Cobro de sangre (120), Buda Blues (95).
- `invertir(comparar)`: recibe un comparador y devuelve el contrario. `invertir(porAnio)` aplicado a la tabla produce orden de **más reciente a más antiguo** sin escribir un comparador nuevo: Buda Blues (2009), Delirio (2004), Cobro de sangre (2004), La novia oscura (1999), Dulce compañía (1995).

### 4. Definición de estabilidad (con ejemplo de la red de bibliotecas)
**Estabilidad:** un algoritmo de ordenamiento es **estable** si, cuando dos elementos tienen la misma clave de ordenación, conserva el **orden relativo** que tenían en la entrada. Si el algoritmo puede intercambiar o mover elementos iguales y alterar ese orden relativo, es **inestable**.

**Ejemplo (red de bibliotecas Libro Abierto):** el catálogo llega con los libros de cada sede ya ordenados por **título**. Para el inventario anual se necesita ordenarlo por **autor** y, dentro de cada autor, por **título**. Si se intenta en dos pasos (primero por título, luego solo por autor) usando un algoritmo **estable** (Bubble/Insertion), los libros de un mismo autor mantienen el orden alfabético por título conseguido en el primer paso. Si se usa **Selection Sort** (inestable), dos libros del mismo autor pueden quedar con sus títulos invertidos respecto al orden previo (como ocurrió con *Buda Blues* y *Cobro de sangre* de Mario Mendoza), exigiendo un comparador compuesto `porAutorYTitulo` en una sola pasada o un algoritmo estable para no perder el criterio secundario.
