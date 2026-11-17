# Café Origen Analítica — Bitácora Semana 2, día 2

**Tema:** ventana deslizante de tamaño fijo y dos punteros sobre datos ordenados.

## Resumen de lo realizado previamente (en este repositorio)
- **Semana 1, Día 1-2 (v0.1):** motor de analítica (`src/analitica.js`), datos (`src/datos.js`), reporte (`src/reporte.js`), depuración y normalización documentada en `docs/semana-1/bitacora-dia-1.md` y `docs/semana-1/bitacora-dia-2.md`.
- **Semana 1, Día 3:** optimización de clientes recurrentes con `Set`/`Map` (`clientesRecurrentes`, `clientesRecurrentesSet`, `comprasPorCliente`), verificación y mediciones en `src/clientesRecurrentes.js`, bitácora `docs/semana-1/bitacora-dia-3.md`.
- **Semana 2, Día 1:** combos de regalo por complemento y conteo de frecuencias (`src/catalogo.js`, `comboRegalo`, `comboRegaloOptimizado`, `productoEstrellaPorCiudad`, `primerClienteUnico`) con trazas y complejidades en `docs/semana-2/bitacora-dia-1.md`.
- **Correcciones transversales:** tipado/JSDoc y `checkJs` estricto (`jsconfig.json` con `types:["node"]`, `@types/node`), y `.gitignore`.

## Contexto (nuevo)
- Encontrar la **mejor semana** de ventas (7 días consecutivos con mayor total) sobre los totales diarios de septiembre.
- Encontrar el **par de productos** cuya suma sea la mayor posible sin superar el presupuesto de clientes corporativos (`parMasCercano`), usando el catálogo de `src/catalogo.js`.

Datos de septiembre (miles de pesos, 30 días):
```js
const ventasDiarias = [320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
710, 380, 360, 440, 500, 590, 650, 720, 400, 370];
```

## 1. Mejor semana (ventana deslizante de tamaño fijo)

### 1.1 Fuerza bruta — `mejorSemanaBruta(dias, k)` (`src/ventanas.js`)
- **Idea:** para cada inicio posible se suman desde cero los `k` días del bloque y se conserva el máximo.
- **Complejidad:** tiempo **O(n·k)**, espacio auxiliar **O(1)**.
- **Casos borde:** `k <= 0` o `k > dias.length` → `null`.

### 1.2 Ventana deslizante — `mejorSemana(dias, k)` (`src/ventanas.js`)
- **Idea:** se calcula la suma de la primera ventana `[0, k-1]`; luego la ventana avanza una posición: `suma += dias[i] - dias[i-k]` (entra el día derecho, sale el izquierdo). Se actualiza el máximo cuando la suma mejora.
- **Complejidad:** tiempo **O(n)** (cada elemento entra y sale a lo sumo una vez), espacio auxiliar **O(1)**.
- **Casos borde:** mismo tratamiento que la fuerza bruta (`k > n` → `null`).

### 1.3 Tres primeras posiciones de la ventana (k=7) — dibujo/traza
| Posición | Índice inicio (0-based) | Día inicio (1-based) | Ventana (valores) | Total |
|---:|---:|---:|---|---:|
| 1 | 0 | 1 | [320, 410, 280, 390, 510, 620, 700] | 3230 |
| 2 | 1 | 2 | [410, 280, 390, 510, 620, 700, 300] | 3210 (3230 + 300 - 320) |
| 3 | 2 | 3 | [280, 390, 510, 620, 700, 300, 290] | 3090 (3210 + 290 - 410) |

Se observa la mecánica: al pasar de la posición 1 a la 2 entra 300 y sale 320; de la 2 a la 3 entra 290 y sale 410.

### 1.4 Comprobación y comparación de tiempos
Pruebas en `src/pruebasVentanas.js` (`node src/pruebasVentanas.js`, medición con `console.time`):

- **Septiembre (30 días, k=7):** bruta y ventana coinciden → `{ total: 3670, inicio: 23 }` (índice 0-based 23 = **día 24**, ventana días 24-30: [440, 500, 590, 650, 720, 400, 370], total 3.670 miles). Tiempos ~0.044 ms (bruta) / ~0.05 ms (ventana).
- **100.000 días aleatorios (k=7):** ambas versiones coinciden en el mismo resultado (mismo `total` e `inicio`). Tiempos medidos en este entorno: **~1.84 ms (bruta)** vs **~0.49 ms (ventana)**. La ventana evita recalcular cada bloque y escala linealmente.
- **Caso borde:** `k=50` sobre 30 días → `null`.

## 2. Par más cercano al presupuesto — `parMasCercano(productos, presupuesto)` (`src/ventanas.js`)

### 2.1 Técnica (dos punteros sobre arreglo ordenado)
1. Se ordena una copia de los productos por `precio` ascendente (`sort` numérico: `(a,b)=>a.precio-b.precio`).
2. Dos punteros: `izquierda = 0`, `derecha = n-1`. Mientras `izquierda < derecha`:
   - `suma = precios[izq] + precios[der]`.
   - Si `suma <= presupuesto`: es candidata; si mejora (mayor suma sin superar), se guarda. Se hace `izquierda++` para intentar aumentar la suma.
   - Si `suma > presupuesto`: excede, se hace `derecha--` para reducir la suma.
3. Si no hay par válido → `null` (nunca se supera el presupuesto).

### 2.2 Pruebas
- Presupuesto **100.000** → `Filtros de papel x100 ($18000) + Origen Huila 1 kg ($79000) = $97000`.
- Presupuesto **140.000** → `Origen Sierra 500 g ($45000) + Prensa francesa ($95000) = $140000`.
- Presupuesto **40.000** (insuficiente, ningún par ≤ 40.000) → `null`.

### 2.3 Traza de los punteros para presupuesto 100.000
Catálogo ordenado por precio:  
`[Filtros de papel x100(18000), Origen Nariño 250 g(26000), Taza de cerámica(35000), Origen Huila 500 g(42000), Origen Sierra 500 g(45000), Origen Huila 1 kg(79000), Prensa francesa(95000), Molino manual(120000)]`

| Paso | i (producto) | j (producto) | suma | Decisión | Por qué se mueve |
|---:|---|---|---:|---|---|
| 1 | 0 Filtros (18000) | 7 Molino (120000) | 138000 | j-- | 138000 > 100000, excede → bajar el mayor (derecha) para reducir suma |
| 2 | 0 Filtros (18000) | 6 Prensa (95000) | 113000 | j-- | 113000 > 100000, excede → mover derecha |
| 3 | 0 Filtros (18000) | 5 Huila 1kg (79000) | 97000 | mejor=97000, i++ | 97000 ≤ 100000, candidata válida → intentar subir el menor (izquierda) para acercarse más |
| 4 | 1 Nariño (26000) | 5 Huila 1kg (79000) | 105000 | j-- | 105000 > 100000, excede → mover derecha |
| 5 | 1 Nariño (26000) | 4 Sierra (45000) | 71000 | i++ | 71000 ≤ 100000 pero no mejora (≤97000) → mover izquierda |
| 6 | 2 Taza (35000) | 4 Sierra (45000) | 80000 | i++ | 80000 ≤ 100000, no mejora → mover izquierda |
| 7 | 3 Huila 500g (42000) | 4 Sierra (45000) | 87000 | i++ | 87000 ≤ 100000, no mejora → mover izquierda (y termina i>=j) |

**Resultado:** Filtros de papel x100 + Origen Huila 1 kg = $97.000 (máxima suma ≤ 100.000).

## 3. Clasificación de complejidad
| Función | Tiempo | Espacio | Justificación |
|---|---:|---:|---|
| `mejorSemanaBruta` | O(n·k) | O(1) | suma cada bloque de k desde cero |
| `mejorSemana` (ventana deslizante) | **O(n)** | O(1) | una pasada; cada día entra y sale una vez de la ventana |
| `parMasCercano` | **O(n log n)** | O(n) | `sort` numérico domina (O(n log n)); el recorrido de dos punteros es O(n) y la copia ordenada usa O(n) |

## 4. Archivos y verificación
- Implementación: `src/ventanas.js` (`mejorSemanaBruta`, `mejorSemana`, `parMasCercano`).
- Pruebas/trazas/tiempos: `src/pruebasVentanas.js` (`npm run ventanas`).
- Catálogo reutilizado: `src/catalogo.js`.
- Verificación: `node src/pruebasVentanas.js` (coincidencias OK, mejor semana septiembre total 3670 inicio día 24, parMasCercano correcto y `null` en presupuesto insuficiente).
