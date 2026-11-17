# Patitas — Bitácora Semana 2, Día 3

**Proyecto:** `patitas/` (motor de historial clínico)  
**Tema:** Recorridos recursivos sobre estructuras anidadas (catálogo de servicios).

## Contexto
La directora entregó el catálogo de servicios en JSON: cada categoría tiene `nombre`, `servicios` (nombre y precio) y `subcategorias` con la misma forma, con profundidades variables.

## Diseño previo de las funciones recursivas

### 1. `contarServicios(categoria)`
- **Caso base (implícito):** si la categoría no tiene subcategorías, el `for...of` sobre `subcategorias` no realiza iteraciones y la función devuelve solo la cantidad de servicios propios (`categoria.servicios.length`).
- **Reducción:** el problema se reduce a contar los servicios de cada subcategoría, que es una estructura más pequeña del mismo tipo (un nivel menos de contexto por llamada).
- **Combinación:** `total = servicios propios + Σ contarServicios(subcategoria)` para cada subcategoría. Se suman los resultados parciales al acumulador local.

### 2. `listarCatalogo(categoria, nivel = 0)`
- **Caso base (implícito):** cuando no hay subcategorías, tras imprimir la categoría y sus servicios no se hacen llamadas recursivas adicionales.
- **Reducción:** listar cada subcategoría equivale al mismo problema aplicado a una categoría hija, aumentando el nivel de profundidad.
- **Combinación:** se imprime la categoría actual con sangría `"  ".repeat(nivel)`, se imprimen sus servicios con sangría `nivel + 1`, y luego se invoca recursivamente `listarCatalogo(sub, nivel + 1)` para cada subcategoría en orden, componiendo así el listado completo.

### 3. `profundidad(categoria)`
- **Caso base:** si `categoria.subcategorias` está vacía, la profundidad desde esa categoría es `1` (solo el nivel actual).
- **Reducción:** la profundidad total depende de la profundidad de cada subcategoría (subproblemas del mismo tipo).
- **Combinación:** `1 + max(profundidad(sub))` sobre todas las subcategorías. Si no hay subcategorías, se toma 1. Así se obtiene el número de niveles desde la categoría dada hasta la rama más profunda.

## Catálogo
Guardado en `patitas/src/catalogo.js` (estructura original entregada por la directora).

## Implementación y verificación
Funciones recursivas con `for...of` sobre `subcategorias` (sin ciclos anidados de profundidad fija) y sangría con `"  ".repeat(nivel)`.

- **`contarServicios(catalogo)` (original):** `9`.
- **`profundidad(catalogo)` (original):** `3` niveles (Patitas → Consultas → Especializada).
- **`listarCatalogo(catalogo)`:** muestra jerarquía completa con precios y sangría correcta.

### Actualización sin cambiar código
Se agrega dentro de “Especializada” la subcategoría “Oftalmología” con el servicio `{ nombre: "Consulta oftalmológica", precio: 120000 }`. Sin modificar las funciones:
- `contarServicios(catalogo)` pasa de `9` a `10`.
- `profundidad(catalogo)` pasa de `3` a `4`.
- `listarCatalogo(catalogo)` incluye la nueva rama con sangría adicional.

Esto confirma que la recursión recorre cualquier profundidad/aridad nueva basada en la estructura de datos.

## Traza de la pila de llamadas: `contarServicios` sobre “Cirugías”

Categoría “Cirugías”: `servicios=[]`, `subcategorias=[Esterilización, Limpieza dental]`.

```
Llamada 1: contarServicios(Cirugías)
  servicios propios = 0, total = 0
  → itera subcategorías, primera: Esterilización
    Llamada 2: contarServicios(Esterilización)
      servicios propios = 2 (Gata, Perra), total = 2
      → subcategorias = [] (caso base implícito, no itera)
    ← retorna 2 a Llamada 1  (total de Cirugías = 0 + 2 = 2)
  → segunda subcategoría: Limpieza dental
    Llamada 3: contarServicios(Limpieza dental)
      servicios propios = 1 (Con anestesia), total = 1
      → subcategorias = [] (caso base implícito)
    ← retorna 1 a Llamada 1  (total de Cirugías = 2 + 1 = 3)
  → no hay más subcategorías
← retorna 3
```

**Pila (máxima profundidad 2):** `contarServicios(Cirugías)` → `contarServicios(Esterilización)` (desapila) → `contarServicios(Limpieza dental)` (desapila) → resultado final `3`.

## Conclusión
Las tres funciones resuelven el recorrido del árbol n-cario de categorías mediante recursión: cada llamada procesa un nodo y delega en sus hijos, combinando resultados (suma, impresión ordenada, máximo de niveles) sin asumir una profundidad fija.

---

## Día 3 (continuación): Búsquedas, rutas, paquetes y rangos

### Implementación (`patitas/src/catalogo.js`)
- `buscarServicio(categoria, nombre)`: busca en los servicios propios y, si no está, recurre en subcategorías con **retorno temprano** en cuanto encuentra (`return encontrado`), evitando recorrer el resto.
- `rutaDeServicio(categoria, nombre)`: si el servicio está en la categoría devuelve `[categoria.nombre, servicio]`; si se halla en una subcategoría devuelve `[categoria.nombre, ...rutaSub]`; si no existe, `null`. Construcción de ruta con arreglos.
- `sumarServicios(categoria)` (auxiliar recursiva): suma todos los precios del subárbol.
- `precioPaquete(categoria)` (principal): obtiene el total con `sumarServicios` y aplica el **10% de descuento una sola vez al final** (`total * 0.9`), separando recursión de descuento.
- `serviciosEnRango(categoria, min, max)`: acumula servicios propios en rango y concatena recursivamente los de subcategorías (cualquier nivel).

### Pruebas realizadas
- **Primer nivel:** `buscarServicio('Rabia')` → `{Rabia,45000}`; `rutaDeServicio('Rabia')` → `['Patitas','Vacunas','Rabia']`.
- **Nivel más profundo:** `buscarServicio('Gata')` → `{Gata,280000}`; `rutaDeServicio('Gata')` → `['Patitas','Cirugías','Esterilización','Gata']`.
- **Inexistente:** `buscarServicio('Peluquería')` → `null`; `rutaDeServicio('Peluquería')` → `null`.
- **Paquete Cirugías:** servicios 280000+350000+150000 = **780000**, con 10% descuento una vez → **702000**. Vacunas 45000+85000=130000 → 117000.
- **Rango [80000,150000] en catálogo:** 5 servicios → Consulta a domicilio (90000), Dermatología (110000), Cardiología (130000), Con anestesia (150000), Triple felina (85000). Rango inexistente [1000,2000] → `[]`.

### Error común: aplicar el descuento en cada llamada recursiva (análisis)

**Enfoque incorrecto (ejemplo):** que cada llamada haga `return sumaLocal * 0.9` (o descuente al combinar), aplicando 10% en cada nivel.

**Cálculo con Cirugías (estructura):**
- `Esterilización` (servicios 280000 y 350000, suma 630000, sin subsubcategorías): devolvería 630000*0.9 = **567000**.
- `Limpieza dental` (150000): devolvería 150000*0.9 = **135000**.
- `Cirugías` combinaría (567000 + 135000) * 0.9 = 702000 * 0.9 = **631800**.

**Correcto:** sumar todo recursivamente (280000+350000+150000 = **780000**) y aplicar 10% **una sola vez** → 780000 * 0.9 = **702000**.

**Por qué es incorrecto:** el descuento se compone por nivel (se descuenta 10% sobre valores ya descontados). Con n niveles de composición se aplicaría (0.9)^n, reduciendo el precio más de lo debido (631800 en vez de 702000, diferencia de 70200). La regla de negocio pide 10% sobre el total del paquete, no un descuento acumulado por rama/nivel. Por eso se separa la suma recursiva (`sumarServicios`) de la función principal que aplica el descuento una única vez (`precioPaquete`).

---

## Día 3 (continuación): Recursión sobre la lista enlazada

### Idea
Una lista enlazada es recursiva por definición: es `null` (lista vacía) o un nodo seguido de otra lista (su `siguiente`). Por eso las operaciones pueden expresarse como funciones auxiliares que reciben un nodo.

### Implementación en `ListaEnlazada` (`patitas/src/ListaEnlazada.js`)
- `tamanioRecursivo()` / `_tamanioNodo(nodo)`: caso base `nodo === null → 0`; reducción `nodo.siguiente`; combinación `1 + _tamanioNodo(nodo.siguiente)`.
- `costoTotalRecursivo()` / `_costoNodo(nodo)`: base `null → 0`; combinación `nodo.dato.costo + _costoNodo(nodo.siguiente)`.
- `buscarRecursivo(condicion)` / `_buscarNodo(nodo, condicion)`: base `null → null`; si cumple retorna el dato, si no reduce a `nodo.siguiente`.
- `imprimirAlReves()` / `_imprimirNodoAlReves(nodo)`: base `null`; llama primero a `_imprimirNodoAlReves(nodo.siguiente)` y **luego** imprime el nodo actual.

### ¿Por qué `imprimirAlReves` funciona sin estructuras auxiliares?
Cada llamada recursiva queda **suspendida** en la pila de llamadas esperando a que termine la llamada sobre `nodo.siguiente`. La recursión avanza hasta el final (base `null`) apilando un marco por nodo; al retornar, los marcos se desapilan en orden inverso (LIFO) al que se apilaron, ejecutándose la instrucción de impresión pendiente en cada retorno. Así, la propia pila de llamadas almacena implícitamente el camino recorrido y produce la salida de la atención más reciente a la más antigua, sin necesidad de arreglos ni pilas explícitas.

### Verificación (mismos resultados que iterativos)
Con los historiales de Lola, Toby y Mía (`node pruebas/recursivo.js`):
- Lola: tamaño iter/rec = 3/3, costo 275000/275000, búsqueda (vacunación) coincide. Inverso: 20/05, 15/03, 02/02.
- Toby: 3/3, 265000/265000, coincide. Inverso: 05/04, 12/01, 10/01.
- Mía: 2/2, 280000/280000, coincide (sin vacunación → `null`). Inverso: 25/02, 18/02.

### Prueba de desbordamiento (100.000 atenciones)
Se crea una lista con 100.000 atenciones y `obtenerTamanio()` (iterativo) devuelve 100000. Al ejecutar `tamanioRecursivo()`:
```
Lista creada con tamanio (iterativo): 100000
Error capturado: RangeError: Maximum call stack size exceeded
```
**Causa:** cada llamada recursiva reserva un marco en la pila de llamadas (parámetros, dirección de retorno, variables locales). La profundidad de recursión es igual al número de nodos `n`, por lo que la memoria de pila crece como **O(n)**. Al superar el límite de la pila del motor (Node/V8, del orden de miles de llamadas), se produce el desbordamiento. La versión iterativa usa un puntero `actual` y consume memoria auxiliar **O(1)**, independiente de `n`.

### Comparación de complejidad

| Operación | Iterativa — Tiempo | Iterativa — Memoria | Recursiva — Tiempo | Recursiva — Memoria (pila) |
|---|---:|---:|---:|---:|
| Tamaño (`obtenerTamanio` / `tamanioRecursivo`) | O(n) / O(1)* | O(1) | O(n) | **O(n)** |
| Costo total (`recorrer`+acum / `costoTotalRecursivo`) | O(n) | O(1) | O(n) | **O(n)** |
| Búsqueda (`buscar` / `buscarRecursivo`) | O(n) | O(1) | O(n) | **O(n)** (O(k) hasta hallar) |
| Imprimir al revés (`imprimirAlReves`) | O(n) con pila/arreglo auxiliar: O(n) | O(n) | O(n) | **O(n)** (pila implícita) |

\*`obtenerTamanio()` iterativo es O(1) por mantener contador; el conteo por recorrido sería O(n).

### Decisión oficial en el motor (justificación)
- **Tamaño:** `obtenerTamanio()` (contador, O(1) tiempo y memoria) como oficial.
- **Costo total / búsqueda:** versiones **iterativas** (`recorrer`/acumulación y `buscar`) como oficiales: mismo O(n) en tiempo pero O(1) en memoria y sin riesgo de desbordar la pila con historiales grandes.
- **Imprimir al revés:** versión **recursiva** como utilitaria/demostrativa para historiales acotados (aprovecha la pila de llamadas sin estructuras auxiliares explícitas), pero no recomendada para listas muy grandes por el costo O(n) en pila y el riesgo de `RangeError`; para producción se preferiría una alternativa iterativa con estructura auxiliar explícita si se requiriera escalar.
- **En general:** se dejan las versiones iterativas como oficiales en el motor por seguridad y consumo de memoria constante; las recursivas se conservan con fines didácticos y de comparación.
