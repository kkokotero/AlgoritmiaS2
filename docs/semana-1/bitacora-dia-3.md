# Café Origen Analítica — Bitácora Semana 1, día 3

**Optimización:** reporte de clientes recurrentes (Set y Map).

## Contexto
El marketplace exige que cualquier reporte del proveedor responda en menos de un segundo con 100.000 ventas. La versión actual de clientes recurrentes tarda minutos. Se elimina el trabajo repetido identificado en el plan de optimización del Día 2.

## 1. Entender (entradas, salidas, restricciones)
- **Entradas:** `ventas` (arreglo de objetos venta; cada venta incluye `cliente`).
- **Salidas:** clientes que compraron más de una vez (recurrentes). La versión original y la de Map devuelven un arreglo de códigos; la versión con Set devuelve un `Set<string>`. Para comparar se normalizan los resultados ordenados.
- **Restricciones:** responder en < 1 s con 100.000 ventas; las tres versiones deben devolver los mismos clientes (comparando resultados ordenados, ya que el orden no es relevante). Se deben usar `Set` (`add`, `has`, `size`) y `Map` (`set`, `get`, `has`) y medir con `console.time`.

## 2. Ejemplos y casos borde
- **Datos Día 1 (`VENTAS`, 12 registros):** clientes `C01`, `C02`, `C03` aparecen más de una vez → recurrentes `["C01","C02","C03"]`.
- **Arreglo vacío `[]`:** sin recurrentes (`[]` / `Set` vacío).
- **Sin repetidos:** cada cliente compra una sola vez → sin recurrentes.
- **Todos iguales:** un único cliente repetido → un solo recurrente.
- **5.000 ventas generadas:** `cliente = C(i % 2000)` con `i=0..4999`, muchos clientes con múltiples compras (usado como conjunto de prueba).

## 3. Fuerza bruta y su complejidad
- **Algoritmo (`clientesRecurrentes`):** para cada cliente se busca otra aparición hacia adelante con un doble ciclo; se evita duplicar el resultado comprobando si ya fue agregado.
- **Tiempo:** O(n²) en el peor caso (comparaciones repetidas entre pares de ventas).
- **Espacio:** O(k) auxiliar para almacenar los recurrentes encontrados (k = cantidad de clientes recurrentes).

## 4. Idea de optimización
Eliminar el trabajo repetido recordando lo ya visto en un solo recorrido:
- **Set (`clientesRecurrentesSet`):** un `Set` de clientes vistos y otro `Set` de recurrentes. Para cada venta: si `clientes.has(cliente)` → `recurrentes.add(cliente)`, si no → `clientes.add(cliente)`. Operaciones `has/add` O(1) promedio → O(n).
- **Map (`comprasPorCliente`):** un `Map` cliente→conteo. Se recorre una vez incrementando con `get/set/has` implícito y luego se filtran los clientes con conteo > 1 → O(n).

## 5. Implementación
- `src/analitica.js:494` — `clientesRecurrentes(ventas)` (fuerza bruta, original).
- `src/analitica.js:522` — `clientesRecurrentesSet(ventas)` usa `Set` vistos + `Set` recurrentes (`add`, `has`, `size` implícito en la estructura).
- `src/analitica.js:546` — `comprasPorCliente(ventas)` usa `Map` con `set/get/has` lógico (`get` + `set`) y devuelve recurrentes con conteo > 1.
- `src/clientesRecurrentes.js` — verificación (resultados ordenados) y medición con `console.time/console.timeEnd`.

## 6. Pruebas
- **Correctitud:** las tres versiones devuelven los mismos clientes (comparados ordenados) con los datos del Día 1 (`VENTAS`) y con 5.000 ventas generadas. Resultado: `OK` en ambos conjuntos (`node src/clientesRecurrentes.js`).
- **Medición** (1.000, 10.000 y 100.000 ventas; la original solo hasta donde es razonable), con `console.time`:

| Ventas | Original (fuerza bruta) | Set | Map |
|-------:|------------------------:|----:|----:|
| 1.000 | 1.832 ms | 0.429 ms | 0.094 ms |
| 10.000 | 30.470 ms | 1.662 ms | 1.054 ms |
| 100.000 | omitida (no razonable) | 12.829 ms | 4.093 ms |

> Tiempos medidos con `console.time`/`console.timeEnd` en este entorno; pueden variar por máquina, pero la tendencia se mantiene.

- **Análisis de crecimiento:** la original crece de forma **cuadrática** (al multiplicar n×10 el tiempo crece aproximadamente ×10–×100 según constantes/caché), mientras Set y Map crecen **linealmente** con n y procesan 100.000 ventas muy por debajo de 1 segundo, cumpliendo el requisito.

## Intercambio entre tiempo y memoria
Las versiones optimizadas intercambian memoria por tiempo: mantienen estructuras auxiliares proporcionales al número de clientes distintos. Si hay `n` ventas y hasta `n` clientes distintos, el costo en memoria es **O(n)** (los `Set`/`Map` almacenan claves y, en el caso del `Map`, conteos). La fuerza bruta usa menos memoria auxiliar O(k) para el resultado, pero paga con tiempo O(n²); con 100.000 ventas esa diferencia hace inviable la versión original y necesaria la optimización para responder en < 1 s.
