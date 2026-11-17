# Café Origen Analítica — Bitácora de cierre (Semana 1 y Semana 2)

**Producto:** Motor de analítica Café Origen **v1.0**. Esta bitácora consolida lo construido a lo largo de la semana, el resumen de los 12 MiniRetos y la estrategia de resolución aplicada en cada optimización.

## Resumen por MiniReto (1–12)

| # | MiniReto | Qué se construyó | Parte del producto | Estrategia / notas |
|---:|---|---|---|---|
| 1 | Primer tueste: repositorio y datos | Modelo de datos, diccionario y casos borde detectados | `src/datos.js`, `docs/semana-1/bitacora-dia-1.md` | Entender el dominio antes de calcular; datos originales se conservan intactos |
| 2 | Los números del día | Indicadores con ciclos y manejo de vacíos (total, unidades, ticket, venta mayor, etc.) | Indicadores básicos en `src/analitica.js` | Plan en pseudocódigo; guardias para arreglos vacíos y divisiones seguras (sin `NaN`) |
| 3 | Del ciclo al método | Agrupaciones, rankings y verificación ciclo vs métodos | Reportes por ciudad/producto (`resumenPorCiudad`, `resumenPorProducto`, `topProductosPorValor`) | `map/filter/reduce`, claves de agrupación y verificación con `src/verificar.js` |
| 4 | Analítica v0.1 | Reporte por consola, integración y depuración sistemática | `src/reporte.js`, `src/depuracion.js`, v0.1 entregable | Método de depuración (síntoma→hipótesis→prueba→causa→corrección); normalización y fechas por clave |
| 5 | ¿Cuánto cuesta cada reporte? | Criterio y herramientas de medición de tiempos/operaciones | Base para mediciones (`console.time`/`hrtime`, scripts de prueba) | Medir antes de optimizar para identificar dónde duele |
| 6 | El reporte que se volvió lento | Diagnóstico del cuello de botella O(n²) con tiempos reales | Identificación de `clientesRecurrentes` como crítico | Análisis de crecimiento (cuadrático vs lineal) y decisión de optimizar |
| 7 | Tiempo, memoria y cadenas | Análisis espacial y decisiones de representación | Ajustes en acumulación/normalización (`totalCiudad`/agrupaciones por clave) | Evitar trabajo/costos innecesarios (p.ej. concatenaciones/duplicados) y balancear memoria |
| 8 | Analítica v0.2 (informe) | Informe de rendimiento y plan de optimización | `RENDIMIENTO.md` (base) y plan en bitácoras | Priorizar optimizaciones por impacto (atacar O(n²) primero) |
| 9 | Clientes recurrentes en tiempo lineal | `clientesRecurrentesSet` (Set) y `comprasPorCliente` (Map), verificación y tabla | `src/analitica.js`, `src/clientesRecurrentes.js`, `docs/semana-1/bitacora-dia-3.md` | **Optimización:** reemplazar ciclos anidados por búsqueda/conteo O(1) promedio con `Set/Map` → O(n) tiempo, O(n) memoria |
| 10 | Combos de regalo y frecuencias | Complementos y conteo de frecuencias (producto estrella, primer cliente único) | `src/catalogo.js`, `productoEstrellaPorCiudad`, `primerClienteUnico`, `docs/semana-2/bitacora-dia-1.md` | **Optimización:** patrón complemento con `Map` en una pasada O(m) y frecuencias con `Map` O(n) (dos recorridos donde aplica) |
| 11 | La mejor racha y el presupuesto | Ventana deslizante y dos punteros | `src/ventanas.js`, `parMasCercano`, `docs/semana-2/bitacora-dia-2.md` | **Optimización:** ventana deslizante O(n) (evita recomputar sumas) y dos punteros sobre arreglo ordenado O(m log m) total por `sort` + O(m) |
| 12 | Analítica v1.0 | Integración, reporte final con datos reales o n ventas, comparación v0.1 vs v1.0 y documentación de producto | `src/reporte.js` v1.0, `src/generarVentas.js`, `src/medirRendimiento.js`, `README.md`, `RENDIMIENTO.md` | Integración de módulos optimizados; ninguna función del reporte final O(n²); evidencia con mediciones reales |

## Estrategias de optimización aplicadas (resumen)
1. **De O(n²) a O(n) con memoria auxiliar:** clientes recurrentes usando `Set` (vistos/recurrentes, `has/add`) y `Map` (conteos `get/set`) — intercambio tiempo-memoria O(n).
2. **Patrón del complemento (hashing):** `comboRegaloOptimizado` recorre una vez y consulta `valor-precio` en `Map` (O(1) promedio) en lugar de probar pares O(m²).
3. **Conteo de frecuencias con `Map`:** `productoEstrellaPorCiudad` y `primerClienteUnico` agregan/consultan en tiempo lineal, con reglas claras de desempate y orden.
4. **Ventana deslizante de tamaño fijo:** `mejorSemana` actualiza la suma en O(1) por paso (entra/sale) → O(n) frente a O(n·k).
5. **Dos punteros tras ordenar:** `parMasCercano` reduce el espacio de búsqueda en O(m) después de ordenar numéricamente (costo total O(m log m)); nunca supera el presupuesto.
6. **Diseño y corrección:** claves canónicas vs etiquetas, fechas por clave `YYYY-MM-DD` y guardias para evitar `NaN`/casos vacíos, manteniendo funciones puras.

## Evidencia de resultados
- `node src/reporte.js 100000` ejecuta todas las secciones del reporte v1.0 en < 5 s.
- Comparación de pipelines (`src/medirRendimiento.js`): 10.000 ventas 95.49 ms (v0.1) vs 38.97 ms (v1.0); 100.000 ventas 8.36 s (v0.1) vs 345.92 ms (v1.0).
- Detalle de complejidades, mediciones y trazas: `RENDIMIENTO.md` y bitácoras por día (`docs/semana-1/`, `docs/semana-2/`).

## Cierre
El repositorio queda documentado y listo para ejecución desde cero (`README.md`), con reporte integrado v1.0, análisis de rendimiento actualizado y trazabilidad del proceso de construcción y depuración en la bitácora.
