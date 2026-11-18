# Bitácora — Ruta Paisa Planificador (Semana 4, Día 1)

## Objetivo
Crear el proyecto y representar la jerarquía de la red Ruta Paisa como un **árbol general**, recorriéndolo de forma recursiva.

## Implementación
- `src/NodoArbol.js`: clase `NodoArbol` con `valor`, arreglo `hijos` y método `agregarHijo(nodo)`.
- `src/red.js`: construcción del árbol de la red piloto y funciones recursivas:
  - `imprimirArbol(nodo, nivel)` — impresión con sangría por nivel.
  - `contarNodos(nodo)` — cuenta total de nodos.
  - `contarHojas(nodo)` — cuenta nodos sin hijos.
  - `altura(nodo)` — altura en número de aristas (hoja = 0).

## Construcción del árbol (red piloto)
- **Raíz:** `Red Ruta Paisa`
  - **Línea A:** Niquía (10), Bello (20), Caribe (30), Universidad (35), Hospital (40), Parque Berrío (45), San Antonio (50), Exposiciones (60), Industriales (65), Poblado (70), Itagüí (80), La Estrella (90)
  - **Línea B:** San Antonio (50), Cisneros (52), Suramericana (54), Estadio (56), Floresta (58), San Javier (59)
  - **Línea K:** Caribe (30), Acevedo (25), Andalucía (27), Santo Domingo (29)
- **Servicios (hijos de estaciones):** San Antonio (aparición en Línea A) → `Bicicletas públicas`, `Ascensor`; Poblado → `Parqueadero`.

## Dibujo del árbol e identificación de terminología

```text
Nivel 0 (raíz)
Red Ruta Paisa                                          [nodo interno, raíz]
  Nivel 1 (líneas)
  - Línea A                                             [nodo interno]
    Nivel 2 (estaciones)
    - Niquía (10)                                       [hoja]
    - Bello (20)                                        [hoja]
    - Caribe (30)                                       [hoja]
    - Universidad (35)                                  [hoja]
    - Hospital (40)                                     [hoja]
    - Parque Berrío (45)                                [hoja]
    - San Antonio (50)                                  [nodo interno]
      Nivel 3 (servicios)
      - Bicicletas públicas                             [hoja]
      - Ascensor                                        [hoja]
    - Exposiciones (60)                                 [hoja]
    - Industriales (65)                                 [hoja]
    - Poblado (70)                                      [nodo interno]
      Nivel 3 (servicios)
      - Parqueadero                                     [hoja]
    - Itagüí (80)                                       [hoja]
    - La Estrella (90)                                  [hoja]
  - Línea B                                             [nodo interno]
    Nivel 2 (estaciones)
    - San Antonio (50)                                  [hoja]
    - Cisneros (52)                                     [hoja]
    - Suramericana (54)                                 [hoja]
    - Estadio (56)                                      [hoja]
    - Floresta (58)                                     [hoja]
    - San Javier (59)                                   [hoja]
  - Línea K                                             [nodo interno]
    Nivel 2 (estaciones)
    - Caribe (30)                                       [hoja]
    - Acevedo (25)                                      [hoja]
    - Andalucía (27)                                    [hoja]
    - Santo Domingo (29)                                [hoja]
```

- **Raíz:** `Red Ruta Paisa` (nivel 0), único nodo sin padre.
- **Nodos internos:** nodos con al menos un hijo → `Red Ruta Paisa`, `Línea A`, `Línea B`, `Línea K`, `San Antonio (50)` (Línea A) y `Poblado (70)` (6 nodos internos).
- **Hojas:** nodos sin hijos → todas las estaciones sin servicios, los servicios y las apariciones de estaciones compartidas sin hijos en su línea (23 hojas).
- **Niveles:** 0 = raíz, 1 = líneas, 2 = estaciones, 3 = servicios.
- **Altura (en aristas):** 3 (camino más largo raíz → línea → estación → servicio, p. ej. Red Ruta Paisa → Línea A → San Antonio (50) → Bicicletas públicas).

**Verificación con funciones recursivas (`node src/red.js`):**
- `contarNodos`: **29** (1 raíz + 3 líneas + 22 apariciones de estaciones + 3 servicios).
- `contarHojas`: **23** (coincide con el conteo del dibujo).
- `altura`: **3** aristas.
- Apariciones de estaciones: 12 (A) + 6 (B) + 4 (K) = **22**; servicios: **3**. `imprimirArbol` muestra tres niveles de sangría para líneas, estaciones y servicios.

## Análisis: estaciones compartidas (San Antonio y Caribe)

**Observación:** `San Antonio (50)` aparece en la Línea A y en la Línea B; `Caribe (30)` aparece en la Línea A y en la Línea K.

**Problema que genera en un árbol:** un árbol general impone una jerarquía estricta donde cada nodo (excepto la raíz) tiene **un único padre** y representa contención. Para modelar que la misma estación pertenece a dos líneas se debe **duplicar el nodo** (dos apariciones independientes). Esto produce:
- **Duplicación e inconsistencia de datos:** la misma estación física queda representada por nodos distintos; atributos o servicios agregados/actualizados en una aparición no se reflejan en la otra (p. ej. los servicios se asociaron a San Antonio de la Línea A, pero la aparición en la Línea B no los tiene, aunque es la misma estación de transferencia).
- **Pérdida de identidad/relación de transferencia:** el árbol no expresa que ambas apariciones son la *misma* estación ni permite modelar directamente la conexión entre líneas (transbordo) como una relación entre iguales.
- **Ambigüedad para recorridos/rutas:** al planificar trayectos, no es trivial reconocer que se puede cambiar de línea en una estación compartida porque estructuralmente son nodos separados.

**Estructura alternativa (anticipación):** un **grafo** (red/grafo no dirigido o dirigido, posiblemente etiquetado por línea) donde las estaciones se modelan como **vértices únicos** y las conexiones entre estaciones consecutivas como **aristas**. Una estación de transferencia tendría aristas hacia estaciones de distintas líneas, representando naturalmente que es el mismo nodo compartido sin duplicación. Esto facilitará modelar adyacencias, transbordos y el cálculo de rutas en las siguientes etapas del planificador.

---

## Día 1 (continuación): Árbol binario de búsqueda (ABB) de estaciones

### Contexto
Las estaciones se identifican por código numérico y se requiere búsqueda eficiente por código. Se modela un **árbol binario de búsqueda**: códigos menores a la izquierda y mayores a la derecha.

**Orden de inserción (20 estaciones):**  
50 San Antonio, 30 Caribe, 70 Poblado, 20 Bello, 40 Hospital, 60 Exposiciones, 80 Itagüí, 10 Niquía, 25 Acevedo, 35 Universidad, 45 Parque Berrío, 52 Cisneros, 56 Estadio, 65 Industriales, 90 La Estrella, 27 Andalucía, 29 Santo Domingo, 54 Suramericana, 58 Floresta, 59 San Javier.

### Implementación (`src/ArbolBusqueda.js`)
- `NodoBinario(codigo, estacion, izquierdo, derecho)`: almacena la clave `codigo`, el nombre `estacion` y referencias `izquierdo`/`derecho` (inicialmente `null`).
- `ArbolBusqueda` con propiedad `raiz`.
- `insertar(codigo, estacion)` (iterativa): respeta la propiedad de orden (menor → izquierda, mayor → derecha). **Códigos repetidos:** si el código ya existe en el árbol, **no se crea un nuevo nodo y se conserva la estación registrada originalmente** (el duplicado se ignora). Decisión documentada en el código para evitar sobrescribir datos sin intención y mantener una única entrada por clave.
- `buscar(codigo)`: recorre desde la raíz comparando la clave; devuelve `{ estacion, comparaciones }` si la encuentra, o `null` si no existe (sin errores).

### Dibujo del ABB resultante (inserción en el orden dado)

```text
(nivel 0)                        50 San Antonio
                                /               \
(nivel 1)                30 Caribe             70 Poblado
                        /         \           /           \
(nivel 2)          20 Bello    40 Hospital  60 Expos.    80 Itagüí
                  /      \      /      \    /       \          \
(nivel 3)   10 Niquía  25 Acevedo 35 Univ. 45 P.Berrío 52 Cisneros 65 Industriales  90 La Estrella
                          \                              \
(nivel 4)             27 Andalucía                    56 Estadio
                            \                          /         \
(nivel 5)            29 Santo Domingo           54 Suram.    58 Floresta
                                                                  \
(nivel 6)                                                    59 San Javier
```

El árbol construido por el programa (`node src/ArbolBusqueda.js`) coincide con este dibujo: 20 estaciones insertadas, mismo padre e hijos para cada nodo según la propiedad de orden.

### Búsquedas, comparaciones y relación con la profundidad

En cada paso se realiza **1 comparación** de igualdad (y se decide ir a izquierda/derecha si no coincide). Por tanto, **comparaciones = profundidad del nodo + 1** (contando la raíz en profundidad 0). Si el código no existe, se comparan todos los nodos del camino hasta llegar a una referencia `null`.

| Búsqueda (código) | Estación | Resultado | Comparaciones | Camino (nodos comparados) | Profundidad en el dibujo |
|---:|---|---|---:|---|---:|
| 50 | San Antonio | encontrada | 1 | 50 | 0 (raíz) |
| 59 | San Javier | encontrada | 7 | 50 → 70 → 60 → 52 → 56 → 58 → 59 | 6 |
| 10 | Niquía | encontrada | 4 | 50 → 30 → 20 → 10 | 3 |
| 40 | Hospital (intermedia) | encontrada | 3 | 50 → 30 → 40 | 2 |
| 33 | (inexistente) | `null` | 4 | 50 → 30 → 40 → 35 → `null` | — (ausente; caería como hijo izq. de 35) |

**Relación observada:** las comparaciones coinciden con `profundidad + 1` para las estaciones presentes (50: 0+1=1, 40: 2+1=3, 10: 3+1=4, 59: 6+1=7). Para el código inexistente 33, la búsqueda realiza 4 comparaciones siguiendo el camino dictado por la propiedad de orden hasta alcanzar un enlace nulo, confirmando su ausencia sin errores. Esto evidencia que el costo de búsqueda en un ABB depende de la altura/profundidad del nodo, determinada por el orden de inserción.

---

### Recorridos en profundidad (inorden, preorden, postorden), altura y hojas

**Predicciones (según el dibujo del ABB, antes de ejecutar los recorridos):**

- **Inorden** (izquierdo, raíz, derecho) — debe producir los códigos en orden ascendente:  
  `10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90`
- **Preorden** (raíz, izquierdo, derecho) — útil para exportar y reconstruir la misma forma:  
  `50, 30, 20, 10, 25, 27, 29, 40, 35, 45, 70, 60, 52, 56, 54, 58, 59, 65, 80, 90`
- **Postorden** (izquierdo, derecho, raíz) — procesa hijos antes que el padre:  
  `10, 29, 27, 25, 20, 35, 45, 40, 30, 54, 59, 58, 56, 52, 65, 60, 90, 80, 70, 50`

**Verificación con el programa (`node src/recorridos.js`):** las tres secuencias obtenidas coinciden exactamente con las predicciones.

| Recorrido | Secuencia obtenida (códigos) | Coincide con predicción |
|---|---|:---:|
| Inorden (20) | 10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90 | Sí |
| Preorden (20) | 50, 30, 20, 10, 25, 27, 29, 40, 35, 45, 70, 60, 52, 56, 54, 58, 59, 65, 80, 90 | Sí |
| Postorden (20) | 10, 29, 27, 25, 20, 35, 45, 40, 30, 54, 59, 58, 56, 52, 65, 60, 90, 80, 70, 50 | Sí |

**Usos en Ruta Paisa (asociación por recorrido):**
- **Inorden → listado ordenado por código para tableros informativos:** en un ABB, el inorden visita los nodos en orden ascendente de clave. Verificación: produce los **20 códigos en orden ascendente de 10 a 90**.
- **Preorden → exportar el índice para reconstruirlo idéntico en otro servidor:** al listar raíz antes que sus subárboles, al insertar los códigos en ese mismo orden en un ABB vacío se recrea la misma estructura. Verificación: exportación `[50,30,20,10,25,27,29,40,35,45,70,60,52,56,54,58,59,65,80,90]`, árbol reconstruido con **exactamente la misma forma** que el original (preorden e inorden idénticos).
- **Postorden → recorrido seguro para liberar el índice al reiniciar el sistema:** procesa primero subárbol izquierdo y derecho y **al final el padre**, garantizando que un nodo se libere solo cuando sus hijos ya fueron procesados (evita perder referencias a subárboles). También permite contar nodos agregando al visitar cada uno (postorden: 20 nodos, igual a `contarNodos()`).

**Altura y hojas (`altura()`, `contarHojas()`):**
- Altura (en aristas): **6** — coincide con el dibujo (camino más largo 50→70→60→52→56→58→59, de nivel 0 a 6).
- Hojas: **8**.
- Nodos (n): **20**.
- Altura mínima posible para 20 nodos (árbol binario lo más balanceado): `floor(log2(n)) = floor(log2(20)) = 4` aristas (equivalente a ⌊log₂ n⌋).
- **Comparación:** altura real **6 > 4** mínima teórica → el árbol está **desbalanceado** debido al orden de inserción, lo que explica búsquedas más costosas en ramas profundas (p. ej. San Javier a profundidad 6).

---

### Consultas del índice: mínimo, máximo y rango (v0.1)

**Implementación (`src/ArbolBusqueda.js`):**
- `minimo()`: sigue siempre al hijo izquierdo hasta el extremo (sin recorrer todo el árbol) → menor código.
- `maximo()`: sigue siempre al hijo derecho hasta el extremo → mayor código.
- `rango(desde, hasta)`: recorrido inorden con **poda** — si `nodo.codigo <= desde` no explora la izquierda (no hay valores menores dentro del rango), y si `nodo.codigo >= hasta` no explora la derecha; solo agrega nodos con código en `[desde, hasta]`, devolviéndolos en orden.

**Reporte de consultas (`node src/indice.js`):**
- Búsquedas por código: `buscar(50)` San Antonio (1 comp.), `buscar(59)` San Javier (7), `buscar(10)` Niquía (4), `buscar(40)` Hospital (3), `buscar(33)` → `null`.
- `minimo()` → **Niquía (10)**. `maximo()` → **La Estrella (90)**.
- `rango(10, 30)` (zona norte), en orden: **10 Niquía, 20 Bello, 25 Acevedo, 27 Andalucía, 29 Santo Domingo, 30 Caribe**.
- Listado completo (inorden): 20 estaciones de 10 a 90.
- Métricas índice original: altura 6 aristas, 8 hojas.

### Efecto del orden de inserción: árbol degenerado

**Experimento:** se construyó un segundo árbol insertando las 20 estaciones en **orden ascendente de código**:  
`10 Niquía, 20 Bello, 25 Acevedo, 27 Andalucía, 29 Santo Domingo, 30 Caribe, 35 Universidad, 40 Hospital, 45 Parque Berrío, 50 San Antonio, 52 Cisneros, 54 Suramericana, 56 Estadio, 58 Floresta, 59 San Javier, 60 Exposiciones, 65 Industriales, 70 Poblado, 80 Itagüí, 90 La Estrella`.

**Resultados:**
- Altura (aristas): **19** → **20 niveles** (uno por estación).
- `buscar(59)` San Javier: **15 comparaciones**.
- `buscar(90)` La Estrella: **20 comparaciones**.

**Por qué se degeneró en una lista:** la propiedad del ABB inserta todo código **mayor** que el actual a la derecha. Al llegar los datos ya ordenados de menor a mayor, cada nuevo código es mayor que todos los anteriores, por lo que siempre se inserta como **hijo derecho** del último nodo (que es el máximo actual). Ningún nodo llega a tener hijo izquierdo: la estructura pierde ramificación y colapsa en una cadena lineal hacia la derecha (equivalente a una **lista enlazada**).

**Complejidad:**
- En este árbol degenerado, la búsqueda debe seguir el único camino descendente nodo a nodo: en el peor caso recorre **n** nodos → **O(n)** en tiempo (y O(n) comparaciones, como 20 para La Estrella con n=20).
- En un árbol balanceado, la altura es ~log₂(n) y la búsqueda descarta aproximadamente la mitad en cada paso → **O(log n)**. El índice original (altura 6, desbalanceado pero no degenerado) ya muestra costos menores (p. ej. San Javier en 7 comparaciones) que el degenerado (15 para el mismo código).

**Conclusión:** el rendimiento del ABB depende críticamente del **orden de inserción**; cargar datos ordenados degrada la búsqueda de O(log n) a O(n), lo que explica la lentitud reportada y motiva estructuras/estrategias de balanceo.

### Resumen Día 1 (v0.1)
- Árbol general de la red (`NodoArbol`, `red.js`) y métricas recursivas.
- ABB por código (`ArbolBusqueda.js`): inserción, búsqueda con comparaciones, recorridos inorden/preorden/postorden, `altura`, `contarHojas`, `minimo`, `maximo`, `rango` con poda.
- `indice.js`: reporte de consultas (búsquedas, mínimo/máximo, rango 10–30, listado completo) y análisis del árbol degenerado (20 niveles, O(n) vs O(log n)).
- Bitácora con dibujos, predicciones/verificaciones de recorridos y análisis de degeneración.
