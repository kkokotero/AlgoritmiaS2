# Libro Abierto — Catálogo (Motor de búsqueda)

Proyecto de la red de bibliotecas comunitarias **Libro Abierto** (Valle de Aburrá). Implementa el modelado del catálogo y las bases para el motor de búsqueda y ordenamiento.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Estructura
```
libro-abierto-catalogo/
├── src/
│   ├── muestra.js           # Muestra de referencia (8 libros)
│   ├── generador.js         # Generador de catálogos (ISBN únicos)
│   ├── explorar.js          # Exploración y verificación del catálogo generado
│   ├── busqueda.js          # Búsqueda lineal (título, autor, palabra)
│   ├── medirBusqueda.js     # Mediciones y traza de búsqueda lineal
│   ├── busquedaBinaria.js   # Búsqueda binaria iterativa y recursiva por ISBN
│   └── comparacionBinaria.js# Trazas y comparación lineal vs binaria
├── bitacora.md              # Índice/enlace a bitácoras en docs/
├── jsconfig.json
├── package.json
└── README.md
```

## Cómo ejecutarlo
Desde la carpeta `libro-abierto-catalogo/`:

```bash
# Exploración: genera 10.000 libros, verifica unicidad y muestra estadísticas
npm run explorar

# Búsqueda lineal: tabla de comparaciones y traza
npm run busqueda

# Búsqueda binaria: trazas, comparación lineal vs binaria y demostración
npm run binaria
```

**Salida esperada:** total 10.000 libros con ISBN únicos, primeros 5 libros, año más antiguo, año más reciente y total de préstamos.

## Modelo de datos
Cada libro es un objeto: `{ isbn, titulo, autor, anio, prestamos }` donde `isbn` es un string de 13 dígitos.

## Bitácoras
Las bitácoras están en [`docs/semana-3/`](../docs/semana-3/) (organizadas por semana y día):
- [Día 1: Modelo de datos y generador de catálogos](../docs/semana-3/bitacora-dia-1.md)

## Semana 3 — Día 1
- Muestra de 8 libros (`src/muestra.js`).
- Generador `generarCatalogo(n)` con ISBN únicos, títulos/autores combinados, año 1900–2026 y préstamos 0–500 (`src/generador.js`).
- Exploración y verificación de unicidad con n = 10.000 (`src/explorar.js`).
