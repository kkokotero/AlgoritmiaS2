# Patitas — Motor de historial clínico

Proyecto de la veterinaria Patitas para modelar historiales de atenciones clínicas usando estructuras de datos (lista enlazada).

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Estructura
```
patitas/
├── src/
│   └── Nodo.js        # Clase Nodo (dato, siguiente)
├── pruebas/
│   └── nodos.js       # Prueba Día 1: 3 nodos enlazados, recorrido y costo total
├── bitacora.md        # Bitácora Semana 2
├── package.json
└── README.md
```

## Ejecución
Desde la carpeta `patitas/`:

```bash
node pruebas/nodos.js
```

**Salida esperada (Día 1):** las tres atenciones de Lola en orden cronológico y el costo total de $275.000.

## Semana 2
- **Día 1:** clase `Nodo` (`dato`, `siguiente`), enlace manual de tres atenciones y recorridos con `while (actual !== null)` sin usar índices ni arreglos. Ver `bitacora.md`.
