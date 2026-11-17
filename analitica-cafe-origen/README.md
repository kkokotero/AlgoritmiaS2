# Café Origen — Motor de Analítica de Ventas (v1.0)

Motor de analítica y **reporte de negocio por consola** para Café Origen. Integra indicadores, análisis de clientes/productos/ciudades, combos de regalo, mejor semana y detección de clientes para cupón, optimizado para procesar grandes volúmenes de ventas en pocos segundos.

**Versión:** v1.0

## Descripción
El proyecto procesa un historial de ventas y genera un informe legible en consola: resumen general, ventas por ciudad, unidades y top de productos, clientes recurrentes, producto estrella por ciudad, combo de regalo sugerido (tarjeta $87.000), cliente para cupón (primera compra única) y mejor semana. Puede ejecutarse sobre los **datos reales** del Día 1 o sobre **n ventas generadas** para pruebas de rendimiento.

- **Motor de analítica:** `src/analitica.js` (funciones puras y reutilizables).
- **Reporte de negocio:** `src/reporte.js` (punto de entrada).
- **Catálogo y análisis comerciales:** `src/catalogo.js`, `src/ventanas.js`, `src/generarVentas.js`.

## Requisitos
- Node.js **>= 18**.
- No hay dependencias de runtime (solo `@types/node` como devDependency para tipado).

## Cómo ejecutarlo

```bash
# (opcional, solo para chequeo de tipos) 
npm install

# Reporte con datos reales (Día 1)
node src/reporte.js

# Reporte con n ventas generadas (ej. 100.000)
node src/reporte.js 100000

# Scripts disponibles
npm run reporte        # datos reales
npm run depuracion     # verificación/depuración de la v0.1
npm run verificar      # compara versión ciclo vs métodos
npm run recurrentes    # verificación y tiempos de clientes recurrentes
npm run combos         # pruebas de combos y frecuencias
npm run ventanas       # pruebas de ventana deslizante y dos punteros
npm test               # verificar + depuracion
```

Ejemplo (resumen):
```bash
node src/reporte.js 100000
# ... secciones 1-10 ...
# Fin del reporte · Café Origen · v1.0 · Tiempo total: ~< 1 s
```

## Preguntas que responde el reporte
1. **¿Cuánto se vendió y cuál es el ticket promedio?** — Resumen general (ventas, unidades, total, ticket, venta mayor, ciudad líder).
2. **¿Dónde y qué se vende más?** — Ventas por ciudad, unidades por producto y top 3 por valor (con participación).
3. **¿Quiénes son clientes recurrentes?** — Conteo y muestra de clientes con más de una compra (optimizado con `Set`).
4. **¿Cuál es el producto estrella por ciudad?** — Producto más frecuente en ventas por cada ciudad.
5. **¿Qué combo sugiere la tarjeta regalo de $87.000?** — Dos productos del catálogo cuya suma es exacta (complemento con `Map`).
6. **¿A quién enviar cupón de regreso?** — Primer cliente en orden que aparece una sola vez.
7. **¿Cuál fue la mejor semana (7 días consecutivos)?** — Mejor racha por totales diarios (ventana deslizante): septiembre en datos reales o calculada sobre las ventas generadas.
8. **¿Cómo fue un día específico y un día sin ventas?** — Resumen por día con manejo seguro de días vacíos (sin `NaN`).

## Estructura del proyecto

```
.
├── src/
│   ├── analitica.js           # Motor de analítica (funciones puras)
│   ├── datos.js               # Historial de ventas real (Día 1)
│   ├── catalogo.js            # Catálogo y combo de regalo (complementos)
│   ├── ventanas.js            # Mejor semana (ventana deslizante) y par más cercano (dos punteros)
│   ├── generarVentas.js       # Generador de ventas sintéticas y totales por día
│   ├── reporte.js             # Reporte v1.0 (CLI: [n] ventas)
│   ├── medirRendimiento.js    # Comparación v0.1 vs v1.0
│   ├── clientesRecurrentes.js # Verificación/medición de recurrentes
│   ├── combosFrecuencias.js   # Pruebas de combos y frecuencias
│   ├── pruebasVentanas.js     # Pruebas de ventana y dos punteros
│   ├── depuracion.js          # Reproducción y verificación de errores
│   ├── verificar.js           # Comparación ciclo vs métodos
│   └── explorar.js            # Exploración de datos
├── docs/
│   ├── semana-1/              # Bitácoras Día 1, 2, 3
│   └── semana-2/              # Bitácoras Día 1, 2 y cierre de semana
├── RENDIMIENTO.md             # Complejidades y comparación v0.1 vs v1.0
├── README.md
├── package.json
└── jsconfig.json
```

## Documentación y rendimiento
- **Rendimiento y complejidades:** ver [`RENDIMIENTO.md`](RENDIMIENTO.md).
- **Bitácoras (proceso, trazas y depuración):** ver [`docs/`](docs/), especialmente [`docs/semana-2/bitacora-cierre.md`](docs/semana-2/bitacora-cierre.md).

## Decisiones de diseño
- Funciones puras, sin mutar entradas; resultados deterministas.
- Claves canónicas para agrupar (ciudad/producto) y etiquetas legibles para mostrar.
- Manejo de fechas por clave `YYYY-MM-DD` (sin desfase de zona horaria) y casos vacíos sin `NaN`.
- Optimizaciones con `Set`/`Map`, ventana deslizante y dos punteros: ninguna función del reporte final es O(n²).
