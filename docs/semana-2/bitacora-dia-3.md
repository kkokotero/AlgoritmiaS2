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
