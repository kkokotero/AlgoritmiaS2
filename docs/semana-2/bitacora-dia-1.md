# Café Origen Analítica — Bitácora Semana 2, día 1

**Tema:** complementos y conteo de frecuencias con estructuras clave–valor en tiempo lineal.

## Contexto
Para la campaña de fin de año: (1) sugerir dos productos distintos cuyo precio sume exactamente el valor de una tarjeta regalo, y (2) identificar el producto estrella de cada ciudad y el primer cliente de la temporada que compró una sola vez.

**Catálogo (`src/catalogo.js`):** arreglo de objetos `{ producto, precio }` con: Origen Nariño 250 g ($26.000), Origen Huila 500 g ($42.000), Origen Sierra 500 g ($45.000), Filtros de papel x100 ($18.000), Taza de cerámica ($35.000), Origen Huila 1 kg ($79.000), Prensa francesa ($95.000), Molino manual ($120.000).

## 1. Combo regalo (dos productos que suman el valor)

### 1.1 Fuerza bruta — `comboRegalo(catalogo, valor)`
- **Idea:** probar todos los pares distintos `(i, j)` con `j > i` y devolver el primero cuya suma sea `valor`.
- **Complejidad:** tiempo **O(n²)** (n productos → n·(n-1)/2 pares), espacio **O(1)** auxiliar.
- **Casos borde:** catálogo vacío o sin combinación → `null`; no se repite el mismo producto (pares con índices distintos).

### 1.2 Optimizada (patrón complemento) — `comboRegaloOptimizado(catalogo, valor)`
- **Idea:** recorrer el catálogo una sola vez manteniendo un `Map` de precios ya vistos (`precio → producto`). Para cada producto se calcula `complemento = valor - precio` y se pregunta si `vistos.has(complemento)`; si ya apareció, se devuelve `[anterior, producto]` en O(1) promedio. Si no, se registra el precio actual.
- **Complejidad:** tiempo **O(n)** (una pasada, búsquedas/inserciones O(1) promedio), espacio **O(n)** para el `Map` de vistos.
- **Casos borde:** sin combinación → `null`; productos distintos (el complemento debe venir de un elemento ya visto, distinto del actual); no se sobreescribe un precio ya visto.

### 1.3 Pruebas
- `comboRegalo*` con **87.000** → `Origen Huila 500 g ($42000) + Origen Sierra 500 g ($45000)` (combinación válida).
- **61.000** → `Origen Nariño 250 g ($26000) + Taza de cerámica ($35000)`.
- **50.000** (sin combinación posible) → `null`.

### 1.4 Traza de la versión optimizada para valor 87.000
| Paso | Producto (precio) | complemento = 87.000 - precio | ¿`vistos.has(complemento)`? | Acción / `vistos` (precios) |
|-----:|-------------------|------------------------------:|:----------------------------|:----------------------------|
| 1 | Origen Nariño 250 g (26.000) | 61.000 | no | agregar 26.000 → {26000} |
| 2 | Origen Huila 500 g (42.000) | 45.000 | no | agregar 42.000 → {26000,42000} |
| 3 | Origen Sierra 500 g (45.000) | 42.000 | **sí** (está 42.000) | **devolver [Origen Huila 500 g, Origen Sierra 500 g]** |

Se recorre el catálogo una sola vez y se detiene al encontrar el complemento.

## 2. Producto estrella por ciudad — `productoEstrellaPorCiudad(ventas)`
- **Patrón:** conteo de frecuencias con `Map` (un `Map` por ciudad que cuenta apariciones de cada producto; claves canónicas de ciudad/producto para agrupar correctamente).
- **Resultado:** objeto `ciudad -> producto estrella` (un producto por cada ciudad).
- **Regla de desempate (documentada):** si dos productos empatan en frecuencia máxima, se conserva el **primero que alcanzó** esa frecuencia máxima (orden de primera aparición en las ventas). Con los datos del Día 1 no hay empates.
- **Complejidad:** tiempo **O(n)** (un recorrido para contar + recorrido de las ciudades/productos distintos ≤ n), espacio **O(n)** en el peor caso.
- **Casos borde:** `ventas` vacío → `{}`.
- **Resultado con datos del Día 1:** `{ 'Medellín': 'Origen Huila 500 g', 'Bogotá': 'Origen Nariño 250 g', 'Cali': 'Prensa francesa', 'Pereira': 'Origen Huila 500 g' }`.

## 3. Primer cliente único — `primerClienteUnico(ventas)`
- **Patrón:** conteo de frecuencias en `Map` + búsqueda en orden. 
  1. Primer recorrido: contar compras por cliente (`conteos.set(cliente, (conteos.get(cliente)||0)+1)`).
  2. Segundo recorrido: devolver el primer cliente (en orden de las ventas) cuyo conteo sea 1.
- **Complejidad:** tiempo **O(n)** (dos recorridos lineales, consultas `get` O(1) promedio), espacio **O(n)** para el `Map` de conteos.
- **Casos borde:** arreglo vacío o sin clientes únicos → `null`.
- **Resultado con datos del Día 1:** `C04` (primer cliente en orden de ventas que aparece una sola vez; C04/C05/C06/C07/C08 son únicos, pero C04 aparece primero).

## 4. Clasificación de complejidad (resumen)
| Función | Tiempo | Espacio | Técnica |
|---|---:|---:|---|
| `comboRegalo` (fuerza bruta) | O(n²) | O(1) | pares anidados |
| `comboRegaloOptimizado` | O(n) | O(n) | complemento con `Map` |
| `productoEstrellaPorCiudad` | O(n) | O(n) | frecuencias con `Map` |
| `primerClienteUnico` | O(n) | O(n) | conteo + 2 recorridos con `Map` |

## 5. Verificación
`node src/combosFrecuencias.js` confirma: 87.000 → Huila 500 g + Sierra 500 g, 61.000 → Nariño 250 g + Taza, 50.000 → `null`; producto estrella por ciudad correcto; `primerClienteUnico` → `C04`.
