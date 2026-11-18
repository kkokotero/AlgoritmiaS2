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
