# Catálogo Libro Abierto v0.1 (Semana 3)

## Qué es
Buscador de catálogo de libros para practicar **búsqueda lineal y binaria** sobre volúmenes grandes de datos. Genera un catálogo de 10.000 libros, mantiene una copia ordenada por ISBN y ejecuta consultas eligiendo el algoritmo adecuado según el tipo de búsqueda y si los datos están ordenados por ese campo.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18

## Modelo de datos (`Libro`)
Cada libro es un objeto: `{ isbn, titulo, autor, anio, prestamos }`
- `isbn` (string, 13 dígitos): identificador; puede haber copias repetidas del mismo ISBN para simular el mismo libro en distintas sedes.
- `titulo` (string), `autor` (string), `anio` (number, 1900–2026), `prestamos` (number, 0–500).

## Consultas soportadas
| Consulta | Algoritmo | Nota |
|---|---|---|
| Por **título** (coincidencia exacta) | Búsqueda lineal con retorno temprano | No requiere orden; normaliza mayúsculas/espacios |
| Por **autor** (todas las coincidencias) | Búsqueda lineal (recorrido completo) | Devuelve todos los libros del autor |
| Por **palabra** en el título | Búsqueda lineal (recorrido completo) | Búsqueda por contenido en el título |
| Por **ISBN** (cualquier copia) | Búsqueda binaria iterativa/recursiva | Requiere catálogo **ordenado por ISBN** (`localeCompare`) |
| Por **ISBN** (primera ocurrencia entre copias) | Búsqueda binaria de primera posición (lower bound) + conteo a la derecha | Resuelve ISBN repetidos consecutivos en el arreglo ordenado |

Cada consulta del reporte indica el **algoritmo usado**, el **resultado** y las **comparaciones** realizadas.

## Cómo ejecutarlo
Desde la carpeta `libro-abierto-catalogo/`:

```bash
# Buscador integrado v0.1: genera 10.000 libros y muestra reporte de consultas
node src/catalogo.js
# o
npm run catalogo

# Exploración: genera 10.000 libros, verifica unicidad y muestra estadísticas
npm run explorar

# Búsqueda lineal: tabla de comparaciones y traza
npm run busqueda

# Búsqueda binaria: trazas, comparación lineal vs binaria y demostración
npm run binaria
```

**Salida esperada (`catalogo.js`):** total de libros generados, copia ordenada por ISBN, ISBN con copias repetidas y reporte de consultas de ejemplo (título, autor, palabra, ISBN existente/inexistente y ISBN con copias vía `primeraPosicionIsbn`) con algoritmo, comparaciones y resultado.

## Estructura
```
libro-abierto-catalogo/
├── src/
│   ├── muestra.js             # Muestra de referencia (8 libros)
│   ├── generador.js           # Generador (ISBN únicos; opción de copias repetidas)
│   ├── explorar.js            # Exploración y verificación del catálogo
│   ├── busqueda.js            # Búsqueda lineal (título, autor, palabra)
│   ├── medirBusqueda.js       # Mediciones y traza de búsqueda lineal
│   ├── busquedaBinaria.js     # Búsqueda binaria iterativa, recursiva y primera ocurrencia
│   ├── comparacionBinaria.js  # Trazas y comparación lineal vs binaria
│   └── catalogo.js            # Buscador integrado v0.1 y reporte de consultas
├── bitacora.md                # Índice/enlace a bitácoras en docs/
├── jsconfig.json
├── package.json
└── README.md
```

## Bitácoras
Las bitácoras (modelo de datos, trazas, tablas de comparaciones y tabla de decisión) se registran en [`docs/semana-3/`](../docs/semana-3/):
- [Día 1: modelo, generador, búsquedas, trazas, comparaciones y tabla de decisión](../docs/semana-3/bitacora-dia-1.md)

`bitacora.md` en este proyecto actúa como índice/enlace.
