# Planificador Ruta Paisa v0.1 (Semana 4)

## Qué es el proyecto
**Ruta Paisa Planificador** modela la red piloto de transporte (líneas, estaciones y servicios) y provee un **índice de estaciones consultable** basado en un **árbol binario de búsqueda (ABB)** por código numérico. Permite representar la jerarquía de la red como árbol general, indexar estaciones para búsquedas eficientes, generar listados ordenados/exportables y analizar el impacto del orden de inserción en el rendimiento del árbol.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Cómo ejecutarlo
Desde la carpeta `ruta-paisa-planificador/`:

```bash
# v0.1: índice consultable y reporte de consultas (búsquedas, mínimo, máximo, rango, listado)
node src/indice.js
# o
npm start

# Grafo no dirigido de la red (lista de adyacencia, V/E y transbordos)
node src/red.js
# o
npm run grafo

# Árbol general de la red y métricas recursivas
node src/redArbol.js

# ABB: inserción de las 20 estaciones y búsquedas por código con comparaciones
node src/ArbolBusqueda.js

# Recorridos (inorden, preorden, postorden), exportación/reconstrucción y métricas
node src/recorridos.js
```

**Salida esperada (`indice.js`):** reporte con búsquedas por código (y comparaciones), `minimo()`/`maximo()`, rango de zona norte (10–30), listado completo inorden, métricas del índice y análisis del árbol degenerado al insertar en orden ascendente (altura, comparaciones para San Javier y La Estrella).  
**Salida esperada (`red.js`):** árbol general con sangría y métricas (`contarNodos`, `contarHojas`, `altura`).  
**Salida esperada (`ArbolBusqueda.js`):** búsquedas con comparaciones (San Antonio 1, San Javier 7, Niquía 4, Hospital 3, código 33 → `null`).  
**Salida esperada (`recorridos.js`):** secuencias inorden/preorden/postorden, verificación ascendente, reconstrucción idéntica desde preorden, conteo postorden y altura/hojas (altura 6, 8 hojas, mínima teórica `floor(log2(20))=4`).

## Consultas soportadas por el índice
Implementadas en `src/ArbolBusqueda.js` y expuestas en el reporte `src/indice.js`:

| Consulta | Método | Descripción |
|---|---|---|
| Búsqueda por código | `buscar(codigo)` | Devuelve `{ estacion, comparaciones }` o `null` si no existe (O(h)). |
| Mínimo | `minimo()` | Estación con menor código (extremo izquierdo), sin recorrer todo el árbol. |
| Máximo | `maximo()` | Estación con mayor código (extremo derecho), sin recorrer todo el árbol. |
| Rango | `rango(desde, hasta)` | Estaciones con código en `[desde, hasta]` **en orden**, con poda de ramas que no pueden contener resultados. |
| Listado completo | `inorden(callback)` | Recorre en orden ascendente de código (útil para tableros informativos). |
| Exportar índice | `preorden(callback)` | Secuencia para reconstruir un árbol con la misma forma en otro servidor. |
| Liberación segura | `postorden(callback)` | Procesa hijos antes que el padre (apropiado para liberar/reiniciar el índice). |
| Métricas | `altura()`, `contarHojas()`, `contarNodos()` | Altura en aristas, hojas y total de nodos. |

**Datos de la red piloto (20 estaciones):** 50 San Antonio, 30 Caribe, 70 Poblado, 20 Bello, 40 Hospital, 60 Exposiciones, 80 Itagüí, 10 Niquía, 25 Acevedo, 35 Universidad, 45 Parque Berrío, 52 Cisneros, 56 Estadio, 65 Industriales, 90 La Estrella, 27 Andalucía, 29 Santo Domingo, 54 Suramericana, 58 Floresta, 59 San Javier.

## Estructura
```
ruta-paisa-planificador/
├── src/
│   ├── NodoArbol.js       # Árbol general (valor, hijos, agregarHijo)
│   ├── redArbol.js        # Construcción de la red como árbol general y funciones recursivas
│   ├── Grafo.js           # Grafo no dirigido con lista de adyacencia (Map)
│   ├── red.js             # Construcción del grafo de la red (líneas A,B,K,T)
│   ├── ArbolBusqueda.js   # ABB: NodoBinario, insertar, buscar, recorridos, min/max, rango, métricas
│   ├── recorridos.js      # Verificación de recorridos y reconstrucción
│   └── indice.js          # Índice v0.1 y reporte de consultas
├── bitacora.md            # Índice de bitácoras
├── jsconfig.json
├── package.json
└── README.md
```

## Bitácora
Bitácoras detalladas (dibujos, predicciones, verificaciones y análisis del árbol degenerado) en [`../docs/semana-4/`](../docs/semana-4/):
- [Día 1: árbol general, ABB, recorridos y consultas](../docs/semana-4/bitacora-dia-1.md)

`bitacora.md` en este proyecto actúa como índice/enlace.
