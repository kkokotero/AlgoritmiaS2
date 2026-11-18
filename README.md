# Algoritmia S2

Repositorio de ejercicios y proyectos del curso de Algoritmia. Incluye implementaciones, análisis de complejidad, optimizaciones y bitácoras de trabajo.

## Proyectos

| Proyecto | Descripción | Ubicación |
|---|---|---|
| **Café Origen — Analítica v1.0** | Motor de analítica y reporte por consola: indicadores, clientes recurrentes (Set/Map), frecuencias, combos (complemento), ventana deslizante y dos punteros. Procesa 100.000 ventas en < 5 s. | [`analitica-cafe-origen/`](analitica-cafe-origen/) |
| **Patitas — Motor de historial clínico v1.0** | Historial clínico con listas enlazadas, recepción con colas (prioridad urgencias), deshacer/rehacer con pilas y catálogo recursivo. Incluye simulación y demostración integrada. | [`patitas/`](patitas/) |
| **Libro Abierto — Catálogo (Semana 3)** | Modelo de datos y generador de catálogos para el motor de búsqueda/ordenamiento de la red de bibliotecas (ISBN único, 10.000 libros de prueba). | [`libro-abierto-catalogo/`](libro-abierto-catalogo/) |

## Estructura del repositorio

```
.
├── analitica-cafe-origen/   # Proyecto Café Origen (src, pruebas/scripts, README, RENDIMIENTO)
├── patitas/                 # Proyecto Patitas (src/estructuras, src/dominio, demo, pruebas, README)
├── libro-abierto-catalogo/  # Proyecto Libro Abierto (muestra, generador, exploración)
├── docs/
│   ├── semana-1/            # Bitácoras Café Origen (Día 1, Día 2, Día 3)
│   ├── semana-2/            # Bitácoras Patitas (Día 1, Día 2, Día 3)
│   └── semana-3/            # Bitácoras Libro Abierto
└── README.md                # Índice general del repositorio
```

## Documentación
- Cada proyecto incluye su propio `README.md` con instrucciones de ejecución y detalles.
- **Café Origen:** [`analitica-cafe-origen/README.md`](analitica-cafe-origen/README.md) y [`analitica-cafe-origen/RENDIMIENTO.md`](analitica-cafe-origen/RENDIMIENTO.md). Bitácoras: [`docs/semana-1/`](docs/semana-1/).
- **Patitas:** [`patitas/README.md`](patitas/README.md). Bitácoras: [`docs/semana-2/`](docs/semana-2/).
- **Libro Abierto:** [`libro-abierto-catalogo/README.md`](libro-abierto-catalogo/README.md). Bitácoras: [`docs/semana-3/`](docs/semana-3/).

## Requisitos generales
- [Node.js](https://nodejs.org/) >= 18 (proyectos JavaScript/Node).
- Git.
