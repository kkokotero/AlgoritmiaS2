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
