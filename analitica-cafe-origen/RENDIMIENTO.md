# Rendimiento — Café Origen Analítica

## Comparación v0.1 vs v1.0 (mediciones reales)

Medición del pipeline de análisis/reporte (cálculo de secciones, sin impresión masiva) con ventas generadas sintéticamente (`node src/medirRendimiento.js`). Entorno: Node.js, Linux.

| Ventas | v0.1 (pipeline con recurrentes O(n²)) | v1.0 (optimizado, secciones nuevas) | Mejora |
|-------:|--------------------------------------:|------------------------------------:|-------:|
| 10.000 | 95.49 ms | 38.97 ms | 2.5× |
| 100.000 | 8.36 s | 345.92 ms | 24.2× |

**Reporte completo v1.0 por consola** (`node src/reporte.js 100000`): tiempo total reportado ~468 ms, tiempo de proceso ~0.58 s (< 5 s).

**Conclusión:** en v0.1 el cuello de botella era la detección de clientes recurrentes con complejidad O(n²), que dominaba al escalar. En v1.0 se usan estructuras `Set`/`Map` (O(n)) y técnicas lineales/log-lineales, por lo que el reporte escala y procesa 100.000 ventas en menos de 1 s de cómputo (y < 5 s incluyendo salida por consola).

## Tabla de complejidades

| Función / módulo | Tiempo | Espacio | Notas |
|---|---:|---:|---|
| `valorVenta` | O(1) | O(1) | cantidad × precio |
| `totalVendido` / `totalVendidoM` | O(n) | O(1) | suma lineal |
| `unidadesVendidas` / `unidadesVendidasM` | O(n) | O(1) | suma lineal |
| `ventaMayor` | O(n) | O(1) | máximo lineal |
| `ticketPromedio` | O(n) | O(1) | suma y conteo válidos |
| `ventasPorCiudad` / `ventasPorCiudadM` | O(n) | O(1) | filtro/acumulación por clave |
| `totalPorCiudad` / `resumenPorCiudad` | O(n) | O(c) | agrupación por ciudad (c ciudades) |
| `unidadesPorProducto` / `resumenPorProducto` | O(n) | O(p) | agrupación por producto (p productos) |
| `topProductosPorValor` | O(n + p log p) | O(p) | agrupa + ordena productos |
| `ventasDelDia` / `resumenDelDia` | O(n) | O(n) | filtrado por clave de día |
| `fechasConVentas` | O(n + d log d) | O(d) | set de fechas + orden |
| `clientesRecurrentes` (fuerza bruta, referencia) | O(n²) | O(k) | comparaciones repetidas (no usado en v1.0) |
| `clientesRecurrentesSet` | O(n) | O(n) | `Set` vistos + `Set` recurrentes (`has/add`) |
| `comprasPorCliente` | O(n) | O(n) | conteo con `Map` (`get/set`) y filtrado |
| `productoEstrellaPorCiudad` | O(n) | O(n) | conteo de frecuencias con `Map` por ciudad/producto |
| `primerClienteUnico` | O(n) | O(n) | conteo `Map` + 2 recorridos lineales |
| `comboRegalo` (fuerza bruta, referencia) | O(m²) | O(1) | pares del catálogo (m productos) |
| `comboRegaloOptimizado` | O(m) | O(m) | complemento con `Map` en una pasada |
| `mejorSemanaBruta` (referencia) | O(n·k) | O(1) | suma cada ventana desde cero |
| `mejorSemana` (ventana deslizante) | O(n) | O(1) | cada elemento entra/sale una vez |
| `parMasCercano` | O(m log m) | O(m) | ordenamiento numérico + dos punteros O(m) |

*n = número de ventas, m = tamaño del catálogo, k = tamaño de ventana. Ninguna función del reporte final v1.0 es O(n²).*

## Decisiones de diseño (tiempo/memoria)
- **Clientes recurrentes:** se reemplazó O(n²) por O(n) usando `Set`/`Map` (costo memoria O(n)).
- **Totales por ciudad:** acumulación numérica por clave canónica (sin concatenación de strings en bucle), evitando costos cuadráticos por copias.
- **Cadenas/normalización:** claves canónicas separadas de etiquetas visibles para agrupar correctamente sin duplicar datos.
- **Ventana deslizante y dos punteros:** evitan recomputar sumas/pares (O(n) u O(m) tras ordenar) con memoria auxiliar constante o lineal acotada.
