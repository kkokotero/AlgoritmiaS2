# Bitácora — Ruta Paisa Planificador (Semana 4, Día 2)

## Contexto
El equipo entregó las conexiones directas entre estaciones incluyendo la **línea T de tranvía** (además de A, B y K). Cada par de estaciones consecutivas de una línea es una conexión directa (arista).

| Línea | Estaciones en orden |
|---|---|
| A | Niquía (10) · Bello (20) · Caribe (30) · Universidad (35) · Hospital (40) · Parque Berrío (45) · San Antonio (50) · Exposiciones (60) · Industriales (65) · Poblado (70) · Itagüí (80) · La Estrella (90) |
| B | San Antonio (50) · Cisneros (52) · Suramericana (54) · Estadio (56) · Floresta (58) · San Javier (59) |
| K | Caribe (30) · Acevedo (25) · Andalucía (27) · Santo Domingo (29) |
| T | Hospital (40) · Estadio (56) · Industriales (65) |

## Objetivo
Representar la red como un **grafo no dirigido** con **lista de adyacencia** y analizar sus propiedades básicas.

## Implementación
- `src/Grafo.js`: clase `Grafo` con lista de adyacencia `Map<código, arreglo de vecinos>`.
  - `agregarEstacion(codigo)`: agrega el vértice si no existe.
  - `conectar(a, b)`: crea la arista **en ambos sentidos** y **no duplica** vecinos (verifica con `indexOf` antes de agregar).
  - `vecinos(codigo)`: devuelve una copia del arreglo de vecinos.
  - `grado(codigo)`: número de vecinos.
  - `numeroEstaciones()` (|V|) y `numeroConexiones()` (|E| = suma de grados / 2).
- `src/red.js`: construye el grafo a partir de las líneas (cada par consecutivo es una conexión), reutiliza el **índice del Día 1** (`construirIndiceOriginal()` de `src/indice.js`) para traducir códigos a nombres y reporta estaciones/transbordos y lista de adyacencia.

## Resultados (`node src/red.js`)
- **V (estaciones): 20**
- **E (conexiones): 21**

**Estaciones de transbordo (grado > 2):**

| Estación | Código | Grado | Vecinos (códigos) |
|---|---:|---:|---|
| Caribe | 30 | 3 | 20, 35, 25 |
| Hospital | 40 | 3 | 35, 45, 56 |
| San Antonio | 50 | 3 | 45, 60, 52 |
| Industriales | 65 | 3 | 60, 70, 56 |
| Estadio | 56 | 4 | 54, 58, 40, 65 |

Detectadas: **Caribe, Hospital, San Antonio, Estadio e Industriales** (coincide con lo requerido).

**Lista de adyacencia (coincide con el programa):**
- 10 (Niquía): [20]
- 20 (Bello): [10, 30]
- 30 (Caribe): [20, 35, 25]
- 35 (Universidad): [30, 40]
- 40 (Hospital): [35, 45, 56]
- 45 (Parque Berrío): [40, 50]
- 50 (San Antonio): [45, 60, 52]
- 60 (Exposiciones): [50, 65]
- 65 (Industriales): [60, 70, 56]
- 70 (Poblado): [65, 80]
- 80 (Itagüí): [70, 90]
- 90 (La Estrella): [80]
- 52 (Cisneros): [50, 54]
- 54 (Suramericana): [52, 56]
- 56 (Estadio): [54, 58, 40, 65]
- 58 (Floresta): [56, 59]
- 59 (San Javier): [58]
- 25 (Acevedo): [30, 27]
- 27 (Andalucía): [25, 29]
- 29 (Santo Domingo): [27]

## Dibujo del grafo (coincide con la lista de adyacencia)

```text
Línea A (horizontal) y transbordos:

  (10)---(20)---(30)---(35)---(40)---(45)---(50)---(60)---(65)---(70)---(80)---(90)
 Niquía Bello Caribe Univ.  Hospital P.Berrío S.Ant. Expos. Industr. Poblado Itagüí L.Estr.
                 |             \               |               /
                 |              \              |              /   (conexión T: 40-56-65)
Línea K:      (25)               \             |             /
Acevedo        |                  \            |            /
             (27)                  \           |           /
Andalucía      |                    \          |          /
             (29)                    '-------(56)-------'
Santo Dom.                                      |
                                             (54)  Línea B (vertical desde 50)
                                                |
                                             (52)
                                                |
                                             (50) San Antonio (también en A)

Detalle de líneas:
- A: 10-20-30-35-40-45-50-60-65-70-80-90
- B: 50-52-54-56-58-59 (se une a A en San Antonio 50)
- K: 30-25-27-29        (se une a A en Caribe 30)
- T: 40-56-65           (conecta Hospital 40, Estadio 56 e Industriales 65)
```

(El dibujo esquemático respeta todas las adyacencias listadas; Estadio (56) conecta 54,58,40,65 y actúa como transbordo entre B y T.)

## Por qué el grafo resuelve el problema de las estaciones compartidas
En el **árbol general** del Día 1, cada nodo (salvo la raíz) tiene un único padre, por lo que estaciones de transferencia como **San Antonio** y **Caribe** debían **duplicarse** en distintas líneas, generando inconsistencia de datos, pérdida de identidad (no se reconoce que es la misma estación física) y dificultad para modelar transbordos. En el **grafo no dirigido**, cada estación es un **vértice único** identificado por su código y las conexiones son **aristas** entre pares de vértices: una estación compartida simplemente tiene aristas hacia vecinos de distintas líneas (p. ej. San Antonio conecta con 45 y 60 de la línea A y con 52 de la línea B; grado 3). Así no hay duplicación, la identidad es única y los transbordos y rutas quedan representados naturalmente por la adyacencia.

## Comparación: lista de adyacencia vs matriz de adyacencia (red de 20 estaciones)

Sea V = 20 estaciones y E = 21 conexiones (grafo no dirigido, disperso).

| Aspecto | Lista de adyacencia (usada) | Matriz de adyacencia |
|---|---|---|
| **Estructura** | `Map` de vértice → lista/arreglo de vecinos | Matriz V×V (booleana o 0/1) |
| **Memoria** | O(V + E): almacena vértices y, en total, 2E entradas de vecinos (una por extremo) = 20 + 42 ≈ 62 referencias/celdas | O(V²): siempre 20×20 = **400** celdas, la mayoría vacías (0) porque la red es dispersa (E ≪ V²) |
| **Consultar vecinos de una estación** | O(grado(v)): se accede a la lista y se recorren solo sus vecinos reales (en esta red grados 1–4, muy barato) | O(V): hay que recorrer toda la fila/columna de 20 posiciones para encontrar cuáles son 1 |
| **Verificar si existe conexión (u,v)** | O(grado(u)) (o O(1) con Set) buscando en la lista de vecinos | O(1) acceso directo a `mat[u][v]` |
| **Agregar conexión** | O(1) amortizado (agregar a las listas, verificando duplicado) | O(1) (marcar dos celdas simétricas) |

**Justificación para esta red:** con V=20 y E=21 el grafo es **muy disperso** (grado promedio 2.1). La **lista de adyacencia** es más adecuada: usa mucha menos memoria (~62 frente a 400 celdas) y consultar vecinos —operación central para recorridos y rutas— es proporcional al grado real (1–4) en lugar de recorrer siempre 20 posiciones como en la matriz. La matriz solo aventajaría si se requirieran muchas consultas de existencia de arista puntual O(1) o si el grafo fuera denso, lo que no es el caso de la red de transporte.

---

## DFS, componentes conectados y estaciones críticas (cierres)

### Implementación
- `src/Grafo.js`: se agregaron `dfs(inicio, cerradas)` (recursivo, con `Set` de visitados, devuelve estaciones alcanzables sin pasar por estaciones cerradas), `dfsIterativo(inicio, cerradas)` (pila explícita, mismo conjunto alcanzable) y `componentes(cerradas)` (grupos de estaciones conectadas entre sí excluyendo cerradas).
- `src/cierres.js` (`node src/cierres.js`): verificaciones de alcanzabilidad, comparación recursivo/iterativo, simulación del cierre de Estadio y listado de estaciones críticas con los componentes que genera cada cierre.

**Complejidad:** DFS visita cada vértice alcanzable una sola vez (control con `Set` de visitados) y recorre cada arista incidente al explorar vecinos, por lo que su complejidad es **O(V + E)** en tiempo (y O(V) en espacio auxiliar para visitados/pila/recursión). El cálculo de componentes repite este proceso sobre vértices no visitados cubriendo el grafo completo: **O(V + E)** en total.

### Traza DFS desde Santo Domingo (29) con la red completa
Lista de adyacencia relevante (orden de vecinos según el grafo construido): 29→[27], 27→[25,29], 25→[30,27], 30→[20,35,25], 20→[10,30], 10→[20], 35→[30,40], ...

Estado: `visitados` (Set), `resultado` (orden de visita), `Pila de llamadas` (tope a la derecha). La recursión explora los vecinos en el orden de la lista de adyacencia.

| Paso | Evento (llamada/retorno) | actual | Acción / vecinos considerados | visitados | resultado (orden visita) | Pila de llamadas |
|---:|---|---:|---|---|---|---|
| 1 | Llamada inicial `dfs(29)` | 29 | 29 no visitado ni cerrado → marcar y agregar | {29} | [29] | [dfs(29)] |
| 2 | Explora vecinos de 29: [27] | 29 | 27 libre → llamada recursiva | {29} | [29] | [dfs(29), dfs(27)] |
| 3 | Entra a `dfs(27)` | 27 | marcar y agregar; vecinos [25,29]; 29 ya visitado, 25 libre | {29,27} | [29,27] | [dfs(29), dfs(27)] → llama 25 ⇒ [dfs(29), dfs(27), dfs(25)] |
| 4 | Entra a `dfs(25)` | 25 | marcar y agregar; vecinos [30,27]; 27 visitado, 30 libre | {29,27,25} | [29,27,25] | [dfs(29), dfs(27), dfs(25), dfs(30)] |
| 5 | Entra a `dfs(30)` | 30 | marcar y agregar; vecinos [20,35,25]; 25 visitado, 20 libre (primero) | {29,27,25,30} | [29,27,25,30] | [dfs(29), dfs(27), dfs(25), dfs(30), dfs(20)] |
| 6 | Entra a `dfs(20)` | 20 | marcar y agregar; vecinos [10,30]; 30 visitado, 10 libre | {29,27,25,30,20} | [29,27,25,30,20] | [dfs(29), dfs(27), dfs(25), dfs(30), dfs(20), dfs(10)] |

(Evolución posterior: `dfs(10)` agrega 10 y retorna por no tener vecinos libres; `dfs(20)` termina y `dfs(30)` continúa con el vecino 35, etc., hasta visitar las 20 estaciones y desapilar todas las llamadas.)

**Orden completo obtenido (recursivo/iterativo, mismo conjunto):** [29, 27, 25, 30, 20, 10, 35, 40, 45, 50, 60, 65, 70, 80, 90, 56, 54, 52, 58, 59] — 20 estaciones alcanzables.

### Verificaciones
- **Red completa:** DFS desde **cualquier** estación alcanza las **20 estaciones** (verificado para todos los orígenes).
- **Recursivo vs iterativo:** ambas versiones encuentran el **mismo conjunto** de estaciones alcanzables desde todas las estaciones (el orden de visita coincide al apilar vecinos en orden inverso en la versión iterativa).

### Simulación: cierre de Estadio (56)
Al cerrar Estadio (`cerradas={56}`), `componentes` devuelve **2 componentes**:
1. **Componente principal (17 estaciones):** Acevedo (25), Andalucía (27), Bello (20), Caribe (30), Cisneros (52), Exposiciones (60), Hospital (40), Industriales (65), Itagüí (80), La Estrella (90), Niquía (10), Parque Berrío (45), Poblado (70), San Antonio (50), Santo Domingo (29), Suramericana (54), Universidad (35).
2. **Componente aislado (2 estaciones):** **Floresta (58), San Javier (59)**.

**Estaciones que quedan aisladas del resto de la red:** **Floresta (58) y San Javier (59)** (la línea B hacia el occidente dependía del paso por Estadio 56 para conectarse al resto; al cerrarse 56 se pierde ese único enlace).

### Estaciones críticas (su cierre divide la red en 2 o más componentes)
Se cerró una estación a la vez (todas las demás operativas) y se contaron los componentes resultantes. **11 estaciones críticas**:

| Estación crítica (cód.) | # Comp. | Componentes generados por su cierre (justificación) |
|---|---:|---|
| Bello (20) | 2 | {Niquía(10)} aislada del resto {Acevedo, Andalucía, Santo Domingo, Caribe, Universidad, Hospital, Parque Berrío, San Antonio, Cisneros, Suramericana, Estadio, Floresta, San Javier, Exposiciones, Industriales, Poblado, Itagüí, La Estrella}. |
| Acevedo (25) | 2 | {Andalucía(27), Santo Domingo(29)} separados del resto de la red. |
| Andalucía (27) | 2 | {Santo Domingo(29)} queda aislada (nodo terminal de la rama K). |
| Caribe (30) | 3 | Parte la red en 3: {Niquía,Bello} (tramo A norte), {Acevedo,Andalucía,Santo Domingo} (rama K) y el bloque restante {Universidad..La Estrella}. |
| Universidad (35) | 2 | Separa {Niquía,Bello,Acevedo,Andalucía,Santo Domingo,Caribe} del resto hacia el sur. |
| Hospital (40) | 2 | Separa {Niquía,Bello,Acevedo,Andalucía,Santo Domingo,Caribe,Universidad} del resto (corta el tramo A y la conexión con T/56). |
| Estadio (56) | 2 | {Floresta(58), San Javier(59)} aisladas del resto (cierre del acceso B-occidente y del paso por T). |
| Floresta (58) | 2 | {San Javier(59)} aislada del resto. |
| Industriales (65) | 2 | {Poblado, Itagüí, La Estrella} separados del resto (corta A sur y la conexión T con Estadio). |
| Poblado (70) | 2 | {Itagüí(80), La Estrella(90)} separados del resto. |
| Itagüí (80) | 2 | {La Estrella(90)} aislada (terminal de la línea A). |

Estas estaciones son puntos de articulación/cortes de la red piloto: su cierre (grado efectivo de conexión único entre subredes o nodos terminales encadenados) desconecta componentes, por lo que requieren planes de contingencia (buses de apoyo) ante cierres.

---

## Planificador de viajes v0.2 (BFS, rutas y transbordos)

### Integración (`src/planificador.js`)
Planificador ejecutable desde la terminal: `node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]` (usa `process.argv`).

- **Validación:** los códigos de origen y destino se validan con `buscar` del **índice ABB** (`ArbolBusqueda` del Día 1). Si algún código no existe se muestra un mensaje claro y no se produce un error no controlado. También se informa si origen/destino están cerrados.
- **Cálculo de ruta:** `Grafo.bfs(origen, destino, cerradas)` usa una **cola** y un `Map` de padres para encontrar la ruta con menor número de tramos, ignorando estaciones en el `Set` de cerradas. Reconstruye el camino destino→origen.
- **Líneas y transbordos:** cada conexión se etiqueta con su línea al construir el grafo (`conectar(a,b,linea)` en `red.js`). Se detectan transbordos comparando la línea de cada tramo con la del anterior e indicando la estación de cambio (p. ej. Línea A → Línea T).
- **Cierres:** con `--cerradas` se recalcula la ruta evitando esas estaciones; si no hay camino se informa **viaje imposible** con sugerencia de alternativa.

### Ejemplos de ejecución

**Ruta 10 → 59 (con nombres, paradas y transbordos):**
`node src/planificador.js 10 59`
- Ruta: Niquía(10) → Bello(20) → Caribe(30) → Universidad(35) → Hospital(40) [Transbordo A→T] → Estadio(56) [Transbordo T→B] → Floresta(58) → San Javier(59)
- Total de paradas (tramos): 7. Estaciones en el recorrido: 8. Transbordos: 2 (en Hospital: A a T; en Estadio: T a B).

**Código inexistente:** `node src/planificador.js 10 999` → `No se encontró la estación de destino con código 999. Verifique el código e intente de nuevo.`

**Con cierre que impide el viaje:** `node src/planificador.js 10 59 --cerradas 56` → `Viaje imposible: no hay ruta disponible... con las estaciones cerradas indicadas` (Floresta y San Javier quedan desconectadas por el cierre de Estadio).

**Con cierre que no bloquea la ruta:** `node src/planificador.js 10 59 --cerradas 50` → la ruta sigue disponible (San Antonio no está en el camino mínimo 10→59) y se muestra la misma ruta con transbordos.

### Traza BFS (ruta 10 → 59, sin cierres)
BFS explora por niveles usando **cola** (FIFO), `visitados` (Set) y `padre` (Map) para reconstruir el camino. Objetivo: encontrar 59 con el menor número de tramos.

| Paso | Dequeue (actual) | Vecinos considerados (no visitados) | Enqueue / padre | Cola (frente→fondo) | visitados |
|---:|---:|---|---|---|---|
| 0 | — | inicio 10 | padre(10)=— | [10] | {10} |
| 1 | 10 | 20 | padre(20)=10 | [20] | {10,20} |
| 2 | 20 | 10(vis), 30 | padre(30)=20 | [30] | {10,20,30} |
| 3 | 30 | 20(vis), 35, 25 | padre(35)=30, padre(25)=30 | [35,25] | {10,20,30,35,25} |
| 4 | 35 | 30(vis), 40 | padre(40)=35 | [25,40] | {10,20,30,35,25,40} |
| 5 | 25 | 30(vis), 27 | padre(27)=25 | [40,27] | {10,20,30,35,25,40,27} |
| 6 | 40 | 35(vis), 45, 56 | padre(45)=40, padre(56)=40 | [27,45,56] | {… ,40,27,45,56} |
| 7 | 27 | 25(vis), 29 | padre(29)=27 | [45,56,29] | {… ,27,45,56,29} |
| 8 | 45 | 40(vis), 50 | padre(50)=45 | [56,29,50] | {… ,45,56,29,50} |
| 9 | 56 | 54(vis en paso sig? no, 54 libre), 58, 40(vis), 65 | padre(54)=56, padre(58)=56, padre(65)=56 | [29,50,54,58,65] | {… ,56,54,58,65} |
| 10 | 29 | 27(vis) | — | [50,54,58,65] | — |
| 11 | 50 | 45(vis), 60, 52 | padre(60)=50, padre(52)=50 | [54,58,65,60,52] | {… ,50,60,52} |
| 12 | 54 | 52,56(vis) → 52 ya visitado? (52 visitado en 11) | — | [58,65,60,52] | — |
| 13 | 58 | 56(vis), 59 | padre(59)=58 → **destino encontrado**, se detiene | — | {… ,58,59} |

**Reconstrucción (siguiendo `padre` desde 59):** 59←58←56←40←35←30←20←10 ⇒ camino **[10,20,30,35,40,56,58,59]** (7 tramos). BFS garantiza el mínimo número de aristas en grafo no ponderado. Las líneas por tramo son A,A,A,A,T,B,B, por lo que hay transbordos en 40 (A→T) y 56 (T→B).

### Tabla de estructuras del planificador

| Estructura | Dónde se usa en el planificador | Para qué se usa | Operación principal y complejidad |
|---|---|---|---|
| **Árbol general (`NodoArbol`)** | Modelo de la red jerárquica (red→líneas→estaciones→servicios, `redArbol.js`) | Representar la jerarquía de la red y soportar recorridos recursivos descriptivos | Recorridos/consultas recursivas sobre n nodos: **O(n)** tiempo, **O(h)** pila |
| **Árbol binario de búsqueda (`ArbolBusqueda`, `NodoBinario`)** | Índice de estaciones por código (`indice.js`), validación de códigos en `planificador.js` | Traducir/validar códigos a nombres y consultas por clave (búsqueda, mín/máx, rango) | `buscar`/`insertar`: **O(log n)** promedio, **O(n)** peor caso (degenerado); `minimo`/`maximo`: **O(h)** |
| **Grafo (`Grafo`, lista de adyacencia `Map`)** | Red de conexiones (`red.js`, `Grafo.js`) para rutas y cierres | Modelar estaciones (vértices) y conexiones con línea (aristas) para DFS/BFS/componentes | `bfs`/`dfs`/`componentes`: **O(V+E)** tiempo, **O(V)** espacio; consultar vecinos: **O(grado(v))** |
| **Cola** | `bfs` en `Grafo` (arreglo con índice cabeza) | Explorar por niveles (FIFO) y hallar ruta con menos tramos | `enqueue`/`dequeue`: **O(1)** amortizado |
| **Pila** | `dfsIterativo`, `componentes` y pila de llamadas de DFS recursivo | Explorar en profundidad (LIFO) y backtracking | `push`/`pop`: **O(1)** |
| **Set** | `visitados` en DFS/BFS, `cerradas` (cierres/parámetro `--cerradas`), control de transbordos | Pertenencia rápida y evitar revisitar o transitar estaciones cerradas | `has`/`add`: **O(1)** promedio |
| **Map** | Lista de adyacencia (`Map<código, vecinos>`), `padre` en BFS, `indice.buscar` usa recorrido del ABB; pares clave-valor de nombres/componentes | Asociar código→vecinos/línea y código→padre para reconstruir rutas y mapear resultados | `get`/`set`/`has`: **O(1)** promedio |

(V = estaciones, E = conexiones, n = nodos, h = altura del árbol).
