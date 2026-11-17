# Café Origen Analítica — Bitácora Semana 1, Día 3

**Temas:** optimización de clientes recurrentes (Set/Map), combos y frecuencias (complemento/Map), ventana deslizante y dos punteros, e integración v1.0.

## Parte 1: Clientes recurrentes (optimización)

### Contexto
El reporte debía responder en < 1 s con 100.000 ventas; la versión de clientes recurrentes era lenta por trabajo repetido.

### 1. Entender (entradas, salidas, restricciones)
- **Entradas:** `ventas` (arreglo de objetos venta; cada venta incluye `cliente`).
- **Salidas:** clientes que compraron más de una vez (recurrentes). La versión original y la de Map devuelven un arreglo de códigos; la versión con Set devuelve un `Set<string>`. Para comparar se normalizan los resultados ordenados.
- **Restricciones:** responder en < 1 s con 100.000 ventas; las tres versiones deben devolver los mismos clientes (comparando resultados ordenados). Se usan `Set` (`add`, `has`, `size`) y `Map` (`set`, `get`, `has`) y medición con `console.time`.

### 2. Ejemplos y casos borde
- **Datos Día 1 (`VENTAS`, 12 registros):** recurrentes `["C01","C02","C03"]`.
- **Arreglo vacío `[]`:** sin recurrentes.
- **Sin repetidos:** ninguno recurrente.
- **Todos iguales:** un solo recurrente.
- **5.000 ventas generadas:** `cliente = C(i % 2000)`, muchos con múltiples compras.

### 3. Fuerza bruta y su complejidad
- **Algoritmo (`clientesRecurrentes`):** para cada cliente se busca otra aparición con doble ciclo; se evita duplicar el resultado.
- **Tiempo:** O(n²). **Espacio:** O(k) auxiliar (k clientes recurrentes).

### 4. Idea de optimización
Eliminar trabajo repetido en un solo recorrido:
- **Set (`clientesRecurrentesSet`):** `Set` de vistos y `Set` de recurrentes (`has/add` O(1) promedio) → O(n).
- **Map (`comprasPorCliente`):** `Map` cliente→conteo (`get/set`) y filtrar conteo > 1 → O(n).

### 5. Implementación
- `src/analitica.js` — `clientesRecurrentes` (O(n²)), `clientesRecurrentesSet` (Set vistos + Set recurrentes), `comprasPorCliente` (Map de conteos).
- `src/clientesRecurrentes.js` — verificación (resultados ordenados) y medición con `console.time/console.timeEnd`.

### 6. Pruebas y medición
- **Correctitud:** las tres versiones coinciden (ordenado) con datos del Día 1 y con 5.000 ventas generadas (`OK`).

| Ventas | Original (fuerza bruta) | Set | Map |
|-------:|------------------------:|----:|----:|
| 1.000 | 1.832 ms | 0.429 ms | 0.094 ms |
| 10.000 | 30.470 ms | 1.662 ms | 1.054 ms |
| 100.000 | omitida (no razonable) | 12.829 ms | 4.093 ms |

> Tiempos de referencia (`console.time/console.timeEnd`, pueden variar por máquina).

- **Crecimiento:** la original crece cuadráticamente; Set y Map crecen linealmente y procesan 100.000 ventas muy por debajo de 1 s.

### Intercambio tiempo-memoria
Las versiones optimizadas intercambian memoria por tiempo: estructuras auxiliares O(n) en el peor caso (clientes distintos). La fuerza bruta usa O(k) auxiliar pero O(n²) en tiempo, inviable a gran escala.

---

## Parte 2: Combos de regalo y frecuencias (complemento, Map)

### Contexto
Sugerir dos productos distintos cuya suma sea el valor de una tarjeta regalo; identificar producto estrella por ciudad y primer cliente que compró una sola vez.

**Catálogo (`src/catalogo.js`)**: arreglo `{producto, precio}` — Origen Nariño 250 g ($26.000), Origen Huila 500 g ($42.000), Origen Sierra 500 g ($45.000), Filtros de papel x100 ($18.000), Taza de cerámica ($35.000), Origen Huila 1 kg ($79.000), Prensa francesa ($95.000), Molino manual ($120.000).

### Combo regalo
- **Fuerza bruta `comboRegalo(catalogo, valor)`**: prueba todos los pares `(i,j), j>i`. **O(n²)** tiempo, **O(1)** espacio.
- **Optimizada `comboRegaloOptimizado(catalogo, valor)`** (complemento): una pasada con `Map` de precios vistos; calcula `complemento = valor - precio`, si `vistos.has(complemento)` retorna el par, si no registra. **O(n)** tiempo, **O(n)** espacio.

**Pruebas:** 87.000 → Origen Huila 500 g + Origen Sierra 500 g; 61.000 → Origen Nariño 250 g + Taza de cerámica; 50.000 → `null`.

**Traza optimizada (87.000):**
| Paso | Producto (precio) | complemento | `vistos.has(complemento)` | Acción / vistos |
|---:|---|---:|:--|---|
| 1 | Origen Nariño 250 g (26.000) | 61.000 | no | {26000} |
| 2 | Origen Huila 500 g (42.000) | 45.000 | no | {26000,42000} |
| 3 | Origen Sierra 500 g (45.000) | 42.000 | **sí** | **retorna [Origen Huila 500 g, Origen Sierra 500 g]** |

### Producto estrella por ciudad — `productoEstrellaPorCiudad(ventas)`
- Conteo de frecuencias con `Map` por ciudad (claves canónicas). **O(n)** tiempo, **O(n)** espacio. Vacío → `{}`.
- **Desempate:** se conserva el primero que alcanzó la frecuencia máxima. Día 1: `{ 'Medellín': 'Origen Huila 500 g', 'Bogotá': 'Origen Nariño 250 g', 'Cali': 'Prensa francesa', 'Pereira': 'Origen Huila 500 g' }`.

### Primer cliente único — `primerClienteUnico(ventas)`
- Conteo en `Map` (recorrido 1) + primer cliente en orden con conteo 1 (recorrido 2). **O(n)** tiempo, **O(n)** espacio. Vacío/sin únicos → `null`. Día 1 → `C04`.

Verificación: `node src/combosFrecuencias.js`.

---

## Parte 3: Mejor semana y presupuesto (ventana deslizante, dos punteros)

### Mejor semana (ventana deslizante fija, k=7)
Datos septiembre (miles): `[320,410,280,390,510,620,700,300,290,450,480,530,610,680,350,330,420,470,560,640,710,380,360,440,500,590,650,720,400,370]`.
- **Fuerza bruta `mejorSemanaBruta(dias,k)`**: suma cada bloque desde cero. **O(n·k)** tiempo, **O(1)** espacio. `k<=0 || k>n` → `null`.
- **Ventana deslizante `mejorSemana(dias,k)`**: suma inicial y luego `suma += entra - sale`. **O(n)** tiempo, **O(1)** espacio.

**Tres primeras posiciones (k=7):**
| Pos | Inicio (0-based / día) | Ventana | Total |
|---:|---:|---|---:|
| 1 | 0 / día 1 | [320,410,280,390,510,620,700] | 3230 |
| 2 | 1 / día 2 | [410,280,390,510,620,700,300] | 3210 (3230+300-320) |
| 3 | 2 / día 3 | [280,390,510,620,700,300,290] | 3090 (3210+290-410) |

**Resultado septiembre:** `{ total: 3670, inicio: 23 }` (día 24, días 24–30). Con 100.000 días aleatorios ambas coinciden (ej. ~1.84 ms bruta vs ~0.49 ms ventana). `k>n` → `null`.

### Par más cercano al presupuesto — `parMasCercano(productos,presupuesto)`
Dos punteros sobre copia ordenada por precio ascendente: si `suma <= presupuesto` se guarda si mejora y `i++`; si `suma > presupuesto` `j--`. **O(m log m)** tiempo (sort) + **O(m)** recorrido, **O(m)** espacio.

**Pruebas:** 100.000 → Filtros x100 + Origen Huila 1 kg = $97.000; 140.000 → Sierra 500 g + Prensa francesa = $140.000; 40.000 → `null`.

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

## Parte 4: Integración v1.0, rendimiento y cierre
- **Reporte v1.0 (`src/reporte.js`)**: versiones optimizadas y secciones nuevas (clientes recurrentes, producto estrella por ciudad, combo regalo $87.000, cliente para cupón, mejor semana) + resumen por día. CLI: `node src/reporte.js` (datos reales) o `node src/reporte.js 100000` (n ventas generadas, `src/generarVentas.js`).
- **Rendimiento (`RENDIMIENTO.md`, `src/medirRendimiento.js`)**: 10.000 → 95.49 ms (v0.1, recurrentes O(n²)) vs 38.97 ms (v1.0); 100.000 → 8.36 s vs 345.92 ms; `node src/reporte.js 100000` ~< 0.5 s total. Ninguna función del reporte final es O(n²).
- **Complejidades clave:** recurrentes Set/Map O(n), combo optimizado O(m), frecuencias/primer único O(n), mejorSemana O(n), parMasCercano O(m log m).
- **Documentación:** `README.md` (producto) y bitácoras en `docs/semana-1/` (Día 1, Día 2, Día 3).

## Estrategias de optimización aplicadas
1. **O(n²)→O(n) con memoria O(n):** `Set/Map` para recurrentes.
2. **Complemento con `Map`:** combo en una pasada O(m).
3. **Frecuencias con `Map`:** estrella por ciudad y primer cliente único en O(n).
4. **Ventana deslizante:** mejor semana O(n), O(1) espacio auxiliar.
5. **Dos punteros + sort:** par más cercano O(m log m), sin superar presupuesto.
6. **Diseño seguro:** claves canónicas, fechas por clave `YYYY-MM-DD`, sin `NaN`, funciones puras.
