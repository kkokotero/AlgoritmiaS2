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

---

## Día 3 (continuación): Combos de regalo y frecuencias (complementos, Map)

### Contexto
Campaña fin de año: sugerir dos productos distintos cuya suma sea el valor de la tarjeta regalo; identificar producto estrella por ciudad y primer cliente que compró una sola vez.

**Catálogo (`src/catalogo.js`)**: arreglo `{producto, precio}` — Origen Nariño 250 g ($26.000), Origen Huila 500 g ($42.000), Origen Sierra 500 g ($45.000), Filtros de papel x100 ($18.000), Taza de cerámica ($35.000), Origen Huila 1 kg ($79.000), Prensa francesa ($95.000), Molino manual ($120.000).

### Combo regalo
- **Fuerza bruta `comboRegalo(catalogo, valor)`**: prueba todos los pares `(i,j), j>i`. **Tiempo O(n²)**, **espacio O(1)**. Casos borde: vacío/sin combinación → `null`, productos distintos.
- **Optimizada `comboRegaloOptimizado(catalogo, valor)`** (patrón complemento): una pasada con `Map` de precios vistos (`precio→producto`); para cada producto calcula `complemento = valor - precio`, si `vistos.has(complemento)` devuelve `[anterior, producto]`, si no registra. **Tiempo O(n)**, **espacio O(n)**.

**Pruebas:** 87.000 → Origen Huila 500 g ($42.000) + Origen Sierra 500 g ($45.000); 61.000 → Origen Nariño 250 g + Taza de cerámica; 50.000 → `null`.

**Traza optimizada (87.000):**
| Paso | Producto (precio) | complemento | `vistos.has(complemento)` | Acción / vistos |
|---:|---|---:|:--|---|
| 1 | Origen Nariño 250 g (26.000) | 61.000 | no | {26000} |
| 2 | Origen Huila 500 g (42.000) | 45.000 | no | {26000,42000} |
| 3 | Origen Sierra 500 g (45.000) | 42.000 | **sí** | **retorna [Origen Huila 500 g, Origen Sierra 500 g]** |

### Producto estrella por ciudad — `productoEstrellaPorCiudad(ventas)` (`src/analitica.js`)
- Conteo de frecuencias con `Map` por ciudad (claves canónicas). **Tiempo O(n)**, **espacio O(n)**. Vacío → `{}`.
- **Regla de desempate:** si empatan en frecuencia máxima, se conserva el primero que alcanzó esa frecuencia (orden de primera aparición). Con Día 1: `{ 'Medellín': 'Origen Huila 500 g', 'Bogotá': 'Origen Nariño 250 g', 'Cali': 'Prensa francesa', 'Pereira': 'Origen Huila 500 g' }`.

### Primer cliente único — `primerClienteUnico(ventas)` (`src/analitica.js`)
- Conteo en `Map` (recorrido 1) + devolver primer cliente en orden con conteo 1 (recorrido 2). **Tiempo O(n)**, **espacio O(n)**. Vacío/sin únicos → `null`. Día 1 → `C04`.

Verificación: `node src/combosFrecuencias.js`.

---

## Día 3 (continuación): Mejor semana y presupuesto (ventana deslizante, dos punteros)

### Mejor semana (ventana deslizante fija, k=7)
Datos septiembre (miles): `[320,410,280,390,510,620,700,300,290,450,480,530,610,680,350,330,420,470,560,640,710,380,360,440,500,590,650,720,400,370]`.
- **Fuerza bruta `mejorSemanaBruta(dias,k)`**: suma cada bloque desde cero. **O(n·k)** tiempo, **O(1)** espacio. `k<=0 || k>n` → `null`.
- **Ventana deslizante `mejorSemana(dias,k)`**: suma inicial de primera ventana y luego `suma += entra - sale`. **O(n)** tiempo, **O(1)** espacio.

**Tres primeras posiciones (k=7):**
| Pos | Inicio (0-based / día) | Ventana | Total |
|---:|---:|---|---:|
| 1 | 0 / día 1 | [320,410,280,390,510,620,700] | 3230 |
| 2 | 1 / día 2 | [410,280,390,510,620,700,300] | 3210 (3230+300-320) |
| 3 | 2 / día 3 | [280,390,510,620,700,300,290] | 3090 (3210+290-410) |

**Resultado septiembre:** ambas coinciden → `{ total: 3670, inicio: 23 }` (día 24, días 24–30). Con 100.000 días aleatorios coinciden (ej. ~1.84 ms bruta vs ~0.49 ms ventana). Caso borde `k>n` → `null`.

### Par más cercano al presupuesto — `parMasCercano(productos,presupuesto)` (`src/ventanas.js`)
Dos punteros sobre copia ordenada por precio ascendente (`sort` numérico): si `suma <= presupuesto` se guarda si mejora y `i++` (buscar mayor); si `suma > presupuesto` `j--`. Nunca supera presupuesto. **O(m log m)** tiempo (sort) + **O(m)** recorrido, **O(m)** espacio.

**Pruebas:** 100.000 → Filtros x100 ($18.000) + Origen Huila 1 kg ($79.000) = $97.000; 140.000 → Sierra 500 g + Prensa francesa = $140.000; 40.000 → `null`.

**Traza (presupuesto 100.000), ordenados [18k,26k,35k,42k,45k,79k,95k,120k]:**
| Paso | i | j | suma | Decisión |
|---:|---|---|---:|---|
| 1 | 0 Filtros(18k) | 7 Molino(120k) | 138000 | j-- (excede) |
| 2 | 0 Filtros(18k) | 6 Prensa(95k) | 113000 | j-- (excede) |
| 3 | 0 Filtros(18k) | 5 Huila 1kg(79k) | 97000 | mejor=97000, i++ (candidata) |
| 4 | 1 Nariño(26k) | 5 Huila 1kg(79k) | 105000 | j-- (excede) |
| 5 | 1 Nariño(26k) | 4 Sierra(45k) | 71000 | i++ (no mejora) |
| 6 | 2 Taza(35k) | 4 Sierra(45k) | 80000 | i++ (no mejora) |
| 7 | 3 Huila 500g(42k) | 4 Sierra(45k) | 87000 | i++ (no mejora, fin) |

Resultado: $97.000.

---

## Integración v1.0, rendimiento y cierre
- **Reporte v1.0 (`src/reporte.js`)**: versiones optimizadas y secciones nuevas (clientes recurrentes, producto estrella por ciudad, combo regalo $87.000, cliente para cupón, mejor semana) + resumen por día. CLI: `node src/reporte.js` (datos reales) o `node src/reporte.js 100000` (n ventas generadas, `src/generarVentas.js`).
- **Rendimiento (`RENDIMIENTO.md`, `src/medirRendimiento.js`)**: 10.000 → 95.49 ms (v0.1, recurrentes O(n²)) vs 38.97 ms (v1.0); 100.000 → 8.36 s vs 345.92 ms; `node src/reporte.js 100000` ~< 0.5 s total. Ninguna función del reporte final es O(n²).
- **Complejidades clave:** recurrentes Set/Map O(n), combo optimizado O(m), frecuencias/primer único O(n), mejorSemana O(n), parMasCercano O(m log m).
- **Documentación:** `README.md` (producto), bitácoras en `docs/semana-1/` (días 1–3) y verificación `tsc --noEmit` limpia.

## Estrategias de optimización aplicadas
1. **O(n²)→O(n) con memoria O(n):** `Set/Map` para recurrentes.
2. **Complemento con `Map`:** combo en una pasada O(m).
3. **Frecuencias con `Map`:** estrella por ciudad y primer cliente único en O(n).
4. **Ventana deslizante:** mejor semana O(n), O(1) espacio auxiliar.
5. **Dos punteros + sort:** par más cercano O(m log m), sin superar presupuesto.
6. **Diseño seguro:** claves canónicas, fechas por clave `YYYY-MM-DD`, sin `NaN`, funciones puras.
