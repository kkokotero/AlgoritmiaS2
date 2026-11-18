# Libro Abierto — Bitácora

Documentación del desarrollo del motor de búsqueda y ordenamiento del catálogo Libro Abierto.

## Semana 3

### Día 1: Modelo de datos y generador de catálogos

#### Modelo de datos
- Cada libro se representa como un objeto con: `isbn` (string, 13 dígitos), `titulo` (string), `autor` (string), `anio` (number, 1900–2026) y `prestamos` (number, 0–500).
- Muestra de referencia: 8 libros en `src/muestra.js`.

#### Justificación del tipo de dato del ISBN (texto y no número)
El ISBN se almacena como **texto (string)**, no como número, por las siguientes razones:
1. **Es un identificador, no un valor aritmético:** no se realizan operaciones matemáticas con él; usar string evita tratamientos numéricos indebidos.
2. **Preservación exacta del código de 13 dígitos:** representarlo como cadena garantiza conservar siempre los 13 caracteres, incluido cualquier cero inicial que pudiera presentarse en códigos o formatos relacionados, sin pérdida de formato.
3. **Consistencia y comparación:** las búsquedas y comparaciones de identificadores (igualdad/exactitud) son claras y directas como cadenas.
4. **Evitar ambigüedades de representación:** aunque 13 dígitos están dentro del rango de enteros seguros en JavaScript, tratarlo como número no aporta beneficios y puede inducir errores de interpretación; como texto el código es inequívoco.

#### Generador (`src/generador.js`)
- `generarCatalogo(n)` genera `n` libros con:
  - **ISBN únicos de 13 dígitos** (string) usando `padStart(13, "0")`.
  - **Títulos y autores** combinados aleatoriamente a partir de listas de palabras y nombres.
  - **Año** entre 1900 y 2026.
  - **Préstamos** entre 0 y 500.

#### Verificación de unicidad de ISBN (n = 10.000)
- **Cómo se garantiza y comprobó:**
  1. Durante la generación se utiliza un `Set` (`isbnsUsados`) para registrar cada ISBN creado; si se genera un ISBN ya presente, se descarta y se genera otro hasta completar `n` libros únicos.
  2. Se verificó ejecutando `node src/explorar.js`, que genera 10.000 libros y comprueba: `catalogo.length === 10000` y `new Set(catalogo.map(l => l.isbn)).size === 10000`.
- **Resultado observado:** `Total de libros generados: 10000`, `ISBN únicos: 10000`, `¿Todos los ISBN son únicos? Sí`.

#### Consultas de la red y tipo de resultado

| Consulta | Campo | ¿Devuelve uno o varios? | Justificación |
|---|---|---|---|
| Por ISBN | `isbn` | **Un libro** (o ninguno) | El ISBN es un identificador único de cada ejemplar/edición registrado. |
| Por título | `titulo` | **Varios** (posible) | Distintos libros o coincidencias pueden compartir título o el usuario puede buscar parcialmente; la consulta debe poder retornar múltiples resultados. |
| Por autor | `autor` | **Varios** (posible) | Un mismo autor puede tener múltiples obras en el catálogo. |

#### Ejecución
- `node src/explorar.js`: genera 10.000 libros, muestra los primeros 5, el año más antiguo, el más reciente y el total de préstamos, junto con la verificación de unicidad.

---

### Día 1 (continuación): Búsqueda lineal

#### Implementación (`src/busqueda.js`)
Funciones implementadas con ciclos `for`, sin usar `find`, `filter`, `indexOf` ni `includes` sobre arreglos (`includes` se usa solo sobre cadenas de texto en la búsqueda por palabra). Se normalizan textos (trim y minúsculas) para comparar títulos/autores.

- `buscarPorTitulo(libros, titulo)`: devuelve `{ libro, comparaciones }`. Recorre secuencialmente y aplica **retorno temprano** al encontrar el primer título coincidente; si no existe devuelve `libro: null` y el total de comparaciones realizadas.
- `buscarPorAutor(libros, autor)`: devuelve `{ libros, comparaciones }` con **todos** los libros del autor.
- `buscarPorPalabra(libros, palabra)`: devuelve `{ libros, comparaciones }` con los libros cuyo título contiene la palabra.

#### Por qué `buscarPorAutor` siempre recorre el catálogo completo
Debe devolver **todos** los libros del autor. Aunque encuentre una coincidencia, no puede detenerse (no hay retorno temprano) porque podrían existir más libros del mismo autor en posiciones posteriores. Además, el catálogo no está ordenado por autor, por lo que no hay forma de saber que ya no aparecerán más coincidencias sin revisar cada elemento. Por ello siempre realiza `n` comparaciones para un catálogo de `n` libros.

#### Cuándo la búsqueda lineal es la única opción posible
- Cuando los datos **no están ordenados** ni indexados por el campo/criterio de búsqueda (como el catálogo actual por título o autor).
- Cuando se buscan **todas las coincidencias** (p. ej. por autor o por palabra) y no solo la primera.
- Cuando el criterio es una **condición general o parcial** (subcadena/palabra en el título) que no permite acceso directo.
- Cuando el conjunto es pequeño o no se justifica el costo de ordenar/preprocesar para una búsqueda puntual.

#### Traza: búsqueda de "Delirio" en la muestra (8 libros)

| # | Comparación (título) | ¿Coincide? | Acción |
|---:|---|:--:|---|
| 1 | "Cien años de soledad" vs "delirio" | No | Continúa |
| 2 | "La vorágine" vs "delirio" | No | Continúa |
| 3 | "El olvido que seremos" vs "delirio" | No | Continúa |
| 4 | "Delirio" vs "delirio" | Sí | Retorna el libro (retorno temprano) |

**Comparaciones totales: 4**. Se detiene en la posición 4 y no evalúa los 4 libros restantes.

#### Medición de comparaciones: `buscarPorTitulo`
Medición con `node src/medirBusqueda.js` (títulos únicos por posición para medir por ubicación: primer libro, libro del medio, último y uno inexistente) en catálogos de 100, 1.000 y 10.000 libros:

| Tamaño (n) | Primer libro (mejor caso) | Libro del medio (caso promedio) | Último libro (peor caso) | No existe (peor caso) |
|---:|---:|---:|---:|---:|
| 100 | 1 | 51 | 100 | 100 |
| 1.000 | 1 | 501 | 1.000 | 1.000 |
| 10.000 | 1 | 5.001 | 10.000 | 10.000 |

**Relación con complejidad:**
- **Mejor caso O(1):** el elemento buscado está en la primera posición → 1 comparación.
- **Peor caso O(n):** el elemento está al final o no existe → `n` comparaciones (se recorre todo el catálogo).
- **Caso promedio O(n):** el elemento está en una posición intermedia → aproximadamente `n/2` comparaciones (en la medición, índice medio = `n/2 + 1` comparaciones).

Esto evidencia el crecimiento lineal del trabajo de la búsqueda lineal respecto al tamaño del catálogo.
