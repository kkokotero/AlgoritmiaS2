# Planificador Ruta Paisa v1.0

## Descripción del producto
**Ruta Paisa Planificador** es un prototipo de planificador de viajes para la red piloto de transporte (líneas A, B, K, T y 20 estaciones). Permite consultar rutas con el menor número de paradas, considerar transbordos y estaciones cerradas, consultar el índice de estaciones, analizar estaciones críticas de la red y validar planes de mantenimiento con dependencias.

Integra estructuras y algoritmos vistos en la semana 4: árbol general, árbol binario de búsqueda (ABB), grafo no dirigido y dirigido, DFS, BFS, cola, Set/Map, ventana deslizante y conteo de frecuencias.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

No requiere dependencias externas.

## Estructura del repositorio
```
ruta-paisa-planificador/
├── src/
│   ├── estructuras/           # Estructuras de datos reutilizables
│   │   ├── NodoArbol.js       # Nodo de árbol general
│   │   ├── ArbolBusqueda.js   # ABB (NodoBinario, recorridos, búsqueda, rango, métricas)
│   │   ├── Grafo.js           # Grafo no dirigido (lista de adyacencia), DFS/BFS/componentes
│   │   ├── GrafoDirigido.js   # Grafo dirigido: detección de ciclos y orden topológico
│   │   └── Cola.js            # Cola FIFO (usada conceptualmente en BFS)
│   ├── dominio/               # Lógica del dominio y planificador
│   │   ├── indice.js          # Índice de estaciones (ABB), listado y rango
│   │   ├── red.js             # Construcción del grafo de la red (A,B,K,T)
│   │   ├── cierres.js         # Alcanzabilidad y análisis de estaciones críticas
│   │   ├── mantenimiento.js   # Validación de plan de obras (ciclos/orden)
│   │   └── planificador.js    # Funciones del planificador v1.0
│   ├── retos/                 # Soluciones de simulacros de entrevista
│   │   ├── duplicados.js      # Detección de duplicados con Set de claves compuestas
│   │   └── demanda.js         # Hora pico (ventana deslizante) y estaciones más usadas (Map)
│   ├── planificador.js        # CLI principal (punto de entrada)
│   ├── indice.js              # Compatibilidad/ejecución del reporte de índice
│   ├── red.js                 # Compatibilidad/ejecución del grafo de red
│   ├── cierres.js             # Compatibilidad/ejecución del análisis de cierres
│   ├── mantenimiento.js       # Compatibilidad
│   ├── redArbol.js            # Árbol general de la red y recorridos recursivos
│   ├── recorridos.js          # Verificación de recorridos del ABB y reconstrucción
│   └── ArbolBusqueda.js, Grafo.js, GrafoDirigido.js, NodoArbol.js  # Reexportaciones
├── pruebas/
│   └── todo.js                # Pruebas OK/FALLA (casos normal y borde por funcionalidad)
├── bitacora.md                # Índice de bitácoras de la semana
├── jsconfig.json
├── package.json
└── README.md
```

## Cómo ejecutar el planificador (5 funcionalidades)
Desde la carpeta `ruta-paisa-planificador/`:

```bash
# 1) Consulta de ruta con transbordos y cierres
node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]
# ejemplos
node src/planificador.js 10 59
node src/planificador.js 10 59 --cerradas 56

# 2) Listado ordenado de estaciones (inorden por código)
node src/planificador.js --listado

# 3) Consulta por rango de códigos
node src/planificador.js --rango <desde> <hasta>
# ejemplo
node src/planificador.js --rango 10 30

# 4) Análisis de estaciones críticas
node src/planificador.js --criticas

# 5) Validación del plan de mantenimiento (ciclos y orden de ejecución)
node src/planificador.js --mantenimiento
```

Scripts npm equivalentes: `npm test`, `npm run listado`, `npm run rango`, `npm run criticas`, `npm run mantenimiento`.

**Comportamiento esperado:**
- **Ruta:** valida códigos con el índice ABB; muestra nombres, líneas por tramo, número de paradas y transbordos; con `--cerradas` recalcula o informa viaje imposible. Maneja códigos inexistentes y cierres de origen/destino con mensajes claros.
- **Listado:** imprime las 20 estaciones en orden ascendente de código.
- **Rango:** imprime estaciones con código en `[desde, hasta]` en orden (poda en ABB).
- **Críticas:** lista estaciones cuyo cierre divide la red en 2 o más componentes.
- **Mantenimiento:** diagnostica el plan original (ciclo `T3 → T4 → T5 → T3`), propone corrección justificada y muestra orden topológico válido del plan corregido.

## Pruebas
```bash
node pruebas/todo.js
# o
npm test
```
Ejecuta casos normal y borde por funcionalidad y muestra `OK` o `FALLA` para cada prueba, con resumen final.

## Otros comandos
```bash
node src/indice.js      # reporte completo del índice y árbol degenerado
node src/red.js         # grafo de la red (V, E, transbordos, adyacencia)
node src/cierres.js     # alcanzabilidad DFS y cierre de Estadio
node src/redArbol.js    # árbol general de la red y métricas recursivas
node src/recorridos.js  # verificación de recorridos y reconstrucción
node src/retos/duplicados.js
node src/retos/demanda.js
```

## Tabla de decisiones técnicas

| Problema | Estructura / algoritmo elegido | Alternativa descartada | Complejidad (elegido) | Justificación |
|---|---|---|---|---|
| Modelar la jerarquía de la red (red → líneas → estaciones → servicios) | **Árbol general** (`NodoArbol`, recorridos recursivos) | Lista plana o grafo directo sin jerarquía | Recorridos O(n), altura/hojas/nodos O(n), espacio O(h) pila | Representa naturalmente niveles y pertenencia; facilita métricas recursivas. No modela bien estaciones compartidas entre líneas (eso motivó el grafo). |
| Índice consultable de estaciones por código (búsqueda, mín/máx, rango, listado) | **Árbol binario de búsqueda (ABB)** con recorridos inorden/preorden/postorden | Arreglo sin ordenar + búsqueda lineal; arreglo ordenado + búsqueda binaria | Búsqueda/insertar O(log n) prom., O(n) peor; rango/listado O(n) con poda/recorrido; espacio O(n) | Permite búsquedas, extremos y rangos ordenados con la misma estructura; inorden da listado ascendente. Requiere control del orden de inserción (árbol degenerado degrada a O(n)). |
| Modelar conexiones de la red con transbordos y líneas | **Grafo no dirigido con lista de adyacencia** (`Map<código, {codigo,linea}[]>`) | Matriz de adyacencia; modelo solo de árbol | Espacio O(V+E); vecinos O(grado(v)); agregar/conectar O(1) prom. | La red tiene ciclos y estaciones compartidas (transbordos), no es un árbol. Lista de adyacencia es eficiente para grafo disperso (E≈V) y permite etiquetar aristas por línea. |
| Determinar alcanzabilidad ante cierres y estaciones críticas | **DFS** (recursivo e iterativo) + componentes conectados, usando `Set` de visitados/cerradas | BFS para alcanzabilidad (equivalente en no ponderado) sin beneficio aquí; revisar pares manualmente | O(V+E) tiempo, O(V) espacio | DFS explora componentes completos y detecta particiones por cierres de forma natural; mismo costo asintótico que BFS para conectividad. |
| Calcular ruta con menor número de paradas (y transbordos) | **BFS** sobre grafo no dirigido con **cola** y `Map` de padres | DFS (no garantiza camino más corto en aristas); Dijkstra (innecesario sin pesos) | O(V+E) tiempo, O(V) espacio | En grafo no ponderado BFS garantiza el mínimo número de tramos; la reconstrucción por padres permite reportar estaciones, líneas y transbordos. |
| Detectar ciclos y obtener orden válido de ejecución en plan de mantenimiento | **Grafo dirigido** + **DFS con 3 estados** (sin visitar, en proceso, terminada) y orden topológico por orden inverso de finalización | Algoritmo de Kahn (BFS por grados de entrada); verificación ad-hoc | O(V+E) tiempo, O(V) espacio | Las dependencias son un DAG deseado; DFS detecta aristas de retorno (ciclos) y produce orden topológico en una misma pasada, facilitando reportar el ciclo al usuario. |
| Detectar validaciones duplicadas (misma tarjeta, estación y minuto) | **`Set` con clave compuesta** `tarjeta|estacion|hora` (hash) | Fuerza bruta comparando pares; ordenar y comparar adyacentes | O(n) tiempo, O(n) espacio (Set O(1) prom. por operación) | La identidad es compuesta y se requiere respuesta en tiempo lineal para grandes volúmenes; fuerza bruta O(n²) no escala. |
| Hora pico (k minutos consecutivos) y estaciones más usadas | **Ventana deslizante** (suma incremental) y **`Map` de frecuencias** + ordenamiento de entradas | Recalcular suma por ventana O(n·k); ordenar todo el registro de validaciones | Hora pico O(n), O(1) extra; más usadas O(n + u log u), O(u) (n validaciones, u estaciones) | La señal “consecutivos” habilita actualización O(1) por paso; para top-k fijo existe alternativa O(n+u) manteniendo k mejores o min-heap O(n+u log k), pero ordenar entradas es simple y suficiente con u pequeño (20). |

## Bitácora y sustentación
- Bitácoras detalladas en `../docs/semana-4/` (días 1, 2 y 3) con dibujos, trazas, análisis de complejidad, evaluaciones de simulacros y cierre con resumen de los 12 MiniRetos y reflexión.
- `bitacora.md` actúa como índice.
- **Sustentación (5 minutos):** problema del cliente, demostración en vivo de dos consultas (`node src/planificador.js 10 59` y `node src/planificador.js --mantenimiento` o `--criticas`), una decisión técnica justificada con complejidad (p. ej. BFS para menor número de paradas, O(V+E)) y una mejora futura (p. ej. pesos por tiempo, balanceo del ABB o persistencia de datos).

## Estado
- **Versión:** v1.0.0 (Semana 4, cierre de ruta)
- **Pruebas:** `node pruebas/todo.js` → OK en todas las funcionalidades
