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
