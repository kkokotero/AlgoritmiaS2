# Planificador Ruta Paisa v0.2 (Semana 4)

## Qué es el proyecto
**Ruta Paisa Planificador** modela la red piloto de transporte (líneas A,B,K,T) y permite consultar viajes como lo haría un pasajero. Integra el **índice de estaciones** (árbol binario de búsqueda por código) con el **grafo no dirigido** de la red para validar códigos, calcular rutas con BFS, mostrar estaciones con nombres y líneas, detectar transbordos y considerar estaciones cerradas.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

No requiere dependencias externas.

## Cómo ejecutarlo
Desde la carpeta `ruta-paisa-planificador/`:

```bash
# v0.2: planificador de viajes (origen, destino y cierres opcionales)
node src/planificador.js <origen> <destino> [--cerradas cod1,cod2,...]
# ejemplos
node src/planificador.js 10 59
node src/planificador.js 10 59 --cerradas 56
# o
npm start -- 10 59

# Diagnóstico de mantenimiento: dependencias, detección de ciclos y orden de ejecución
node src/planificador.js --mantenimiento

# Índice consultable y reporte de consultas (búsquedas, mínimo, máximo, rango, listado)
node src/indice.js

# Grafo no dirigido de la red (lista de adyacencia, V/E y transbordos)
node src/red.js

# DFS, componentes conectados y estaciones críticas por cierres
node src/cierres.js

# Árbol general de la red y métricas recursivas
node src/redArbol.js

# ABB: inserción de las 20 estaciones y búsquedas por código con comparaciones
node src/ArbolBusqueda.js

# Recorridos (inorden, preorden, postorden), exportación/reconstrucción y métricas
node src/recorridos.js
```

**Salida esperada (`planificador.js`):** validación de códigos con el índice (mensaje claro si no existen), ruta calculada con BFS mostrando nombres de estaciones, líneas por tramo, **número total de paradas**, **transbordos** (cambio de línea) y, con `--cerradas`, una ruta alternativa o aviso de **viaje imposible**. Con `--mantenimiento` muestra diagnóstico de dependencias, detección del ciclo del plan original y orden topológico del plan corregido.  
**Salida esperada (`indice.js`):** búsquedas por código, `minimo`/`maximo`, rango zona norte (10–30), listado inorden y análisis de árbol degenerado.  
**Salida esperada (`red.js`):** V=20, E=21, transbordos y lista de adyacencia. **`cierres.js`:** alcanzabilidad DFS, cierre de Estadio (aisladas Floresta y San Javier) y estaciones críticas.



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
│   ├── Grafo.js           # Grafo no dirigido con lista de adyacencia, DFS/BFS y componentes
│   ├── GrafoDirigido.js   # Grafo dirigido de dependencias: detección de ciclos y orden topológico (DFS)
│   ├── red.js             # Construcción del grafo de la red (líneas A,B,K,T) con línea por arista
│   ├── cierres.js         # Análisis de cierres: alcanzabilidad, componentes y estaciones críticas
│   ├── mantenimiento.js   # Plan de mantenimiento: diagnóstico, ciclo y orden de ejecución
│   ├── planificador.js    # Planificador de viajes v0.2 (CLI: rutas, cierres y --mantenimiento)
│   ├── ArbolBusqueda.js   # ABB: NodoBinario, insertar, buscar, recorridos, min/max, rango, métricas
│   ├── recorridos.js      # Verificación de recorridos y reconstrucción
│   └── indice.js          # Índice v0.1 y reporte de consultas
├── bitacora.md            # Índice de bitácoras
├── jsconfig.json
├── package.json
└── README.md
```

## Bitácora
Bitácoras detalladas (dibujos, trazas DFS/BFS, análisis y tabla de estructuras) en [`../docs/semana-4/`](../docs/semana-4/):
- [Día 1: árbol general, ABB, recorridos y consultas](../docs/semana-4/bitacora-dia-1.md)
- [Día 2: grafo, DFS/componentes, BFS, transbordos y planificador](../docs/semana-4/bitacora-dia-2.md)
- [Día 3: simulacros (duplicados, demanda) y mantenimiento (ciclos/orden topológico)](../docs/semana-4/bitacora-dia-3.md)

`bitacora.md` en este proyecto actúa como índice/enlace.
