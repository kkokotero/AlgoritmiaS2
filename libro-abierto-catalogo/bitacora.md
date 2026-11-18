# Bitácora — Catálogo Libro Abierto v0.1 (Semana 3, Día 1)

## 1. Modelo de datos
Cada libro se representa como un objeto `Libro`:

| Campo | Tipo | Descripción |
|---|---|---|
| `isbn` | `string` (13 dígitos) | Identificador del libro; se conserva como string (ceros a la izquierda). Puede haber copias repetidas del mismo ISBN para simular el mismo libro en distintas sedes. |
| `titulo` | `string` | Título de la obra. |
| `autor` | `string` | Autor/a. |
| `anio` | `number` | Año de publicación (1900–2026 en el generador). |
| `prestamos` | `number` | Número de préstamos (0–500 en el generador). |

**Muestra de referencia (8 libros):** `src/muestra.js`.

**Generador:** `src/generador.js` — `generarCatalogo(n, { copiasRepetidas })` genera n libros con ISBN únicos base (controlados con `Set` + `padStart(13,"0")`), títulos/autores combinados y opción de insertar copias repetidas del mismo ISBN (mismo título/autor/año, préstamos variables) para simular sedes.

## 2. Trazas

### 2.1 Búsqueda lineal por título (muestra, 8 libros)
Búsqueda de `"Delirio"` en `src/muestra.js` (`buscarPorTitulo`, normalizando mayúsculas/espacios):

| Comparación | Título comparado | ¿Coincide? |
|---:|---|---|
| 1 | Cien años de soledad | No |
| 2 | La vorágine | No |
| 3 | El olvido que seremos | No |
| 4 | Delirio | **Sí → retorno temprano** |

**Resultado:** `{ libro: "Delirio", comparaciones: 4 }`.

### 2.2 Búsqueda binaria por ISBN (muestra ordenada por ISBN)
Muestra ordenada por ISBN (`sort` + `localeCompare`):

| Índice | ISBN | Título |
|---:|---|---|
| 0 | 9789584264879 | Rosario Tijeras |
| 1 | 9789584270344 | El olvido que seremos |
| 2 | 9789584276049 | La casa de las dos palmas |
| 3 | 9789584295125 | Cien años de soledad |
| 4 | 9789587047462 | Delirio |
| 5 | 9789587434477 | Satanás |
| 6 | 9789588886121 | La vorágine |
| 7 | 9789588948485 | Los ejércitos |

**ISBN existente: `9789587047462` (Delirio)**

| Paso | inicio | fin | medio | ISBN en medio | Decisión |
|---:|---:|---:|---:|---|---|
| 1 | 0 | 7 | 3 | 9789584295125 | medio < buscado → inicio = medio + 1 |
| 2 | 4 | 7 | 5 | 9789587434477 | medio > buscado → fin = medio - 1 |
| 3 | 4 | 4 | 4 | 9789587047462 | **encontrado** |

Resultado: `Delirio`, **3 comparaciones**.

**ISBN inexistente: `9789585000000`**

| Paso | inicio | fin | medio | ISBN en medio | Decisión |
|---:|---:|---:|---:|---|---|
| 1 | 0 | 7 | 3 | 9789584295125 | medio < buscado → inicio = medio + 1 |
| 2 | 4 | 7 | 5 | 9789587434477 | medio > buscado → fin = medio - 1 |
| 3 | 4 | 4 | 4 | 9789587047462 | medio > buscado → fin = medio - 1 |
| 4 | 4 | 3 | -1 | - | inicio > fin → no encontrado |

Resultado: `null`, **3 comparaciones**.

### 2.3 Demostración: búsqueda binaria en arreglo NO ordenado
Se busca `9789584264879` (Rosario Tijeras, presente en índice 4 de la muestra original sin ordenar). La binaria compara contra el medio asumiendo orden y descarta la mitad donde debería estar:

| Paso | inicio | fin | medio | ISBN en medio | Decisión |
|---:|---:|---:|---:|---|---|
| 1 | 0 | 7 | 3 | 9789587047462 | medio > buscado → fin = medio - 1 |
| 2 | 0 | 2 | 1 | 9789588886121 | medio > buscado → fin = medio - 1 |
| 3 | 0 | 0 | 0 | 9789584295125 | medio > buscado → fin = medio - 1 |
| 4 | 0 | -1 | -1 | - | inicio > fin → no encontrado |

**Resultado:** `null` en 3 comparaciones (falso negativo), aunque el libro existe; la búsqueda lineal lo encuentra en 5 comparaciones. **Conclusión:** la búsqueda binaria exige datos ordenados por la clave de búsqueda.

## 3. Tablas de comparaciones

### 3.1 Búsqueda lineal por título (primero / medio / último / inexistente)
| Tamaño (n) | Primero | Medio | Último | Inexistente |
|---:|---:|---:|---:|---:|
| 100 | 1 | 51 | 100 | 100 |
| 1.000 | 1 | 501 | 1.000 | 1.000 |
| 10.000 | 1 | 5.001 | 10.000 | 10.000 |

Relación con complejidad: mejor caso O(1), caso promedio ~n/2 → O(n), peor caso O(n).

### 3.2 Búsqueda lineal vs binaria por ISBN (inexistente, peor caso lineal)
| Tamaño (n) | Lineal (comparaciones) | Binaria (comparaciones) | Máx teórico binaria ⌊log₂(n)⌋+1 | log₂(n) |
|---:|---:|---:|---:|---:|
| 1.000 | 1.000 | 9 | 10 | 9.9658 |
| 10.000 | 10.000 | 13 | 14 | 13.2877 |
| 1.000.000 | 1.000.000 | 19 | 20 | 19.9316 |

Con 1.000.000 de libros la búsqueda binaria no supera 20 comparaciones (crecimiento O(log n)).

## 4. Tabla de decisión (algoritmo por consulta)
| Tipo de consulta | ¿Datos ordenados por ese campo? | Algoritmo elegido | Complejidad (tiempo) |
|---|---|---|---|
| Título (coincidencia exacta, primera) | No (catálogo original) | Búsqueda lineal con retorno temprano (`buscarPorTitulo`) | Mejor O(1), promedio/peor O(n) |
| Autor (todas las coincidencias) | No | Búsqueda lineal, recorrido completo (`buscarPorAutor`) | Siempre O(n) |
| Palabra en título (todas las que contienen) | No | Búsqueda lineal, recorrido completo (`buscarPorPalabra`) | Siempre O(n) |
| ISBN (cualquier copia) | Sí (copia ordenada por ISBN) | Búsqueda binaria iterativa/recursiva (`buscarPorIsbn`) | O(log n) |
| ISBN (primera copia entre repetidos) | Sí (copias consecutivas por ISBN) | Búsqueda binaria de primera ocurrencia/lower bound + conteo a la derecha (`primeraPosicionIsbn`) | O(log n + k), k = nº de copias |
| Cualquier campo sin índice/orden | No | Búsqueda lineal | O(n) |

**Justificación:** la búsqueda lineal no requiere orden y es necesaria cuando se buscan todas las coincidencias o el campo no está ordenado. La búsqueda binaria exige orden por la clave y reduce comparaciones a O(log n); para ISBN duplicados la variante de primera ocurrencia localiza el inicio del bloque de copias contiguas.

## 5. Buscador integrado v0.1
- `src/catalogo.js`: genera 10.000 libros (con copias repetidas), prepara copia ordenada por ISBN y emite un reporte de consultas de ejemplo (título, autor, palabra, ISBN existente/inexistente, ISBN con copias) indicando consulta, algoritmo, comparaciones y resultado.
- Ejecución: `node src/catalogo.js` o `npm run catalogo`.

## 6. Archivos relevantes
- `src/muestra.js`, `src/generador.js`, `src/explorar.js`
- `src/busqueda.js`, `src/medirBusqueda.js`
- `src/busquedaBinaria.js`, `src/comparacionBinaria.js`
- `src/catalogo.js` (v0.1)

Bitácora ampliada y detallada por entregas: `../docs/semana-3/bitacora-dia-1.md`.
