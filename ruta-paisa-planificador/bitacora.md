# Bitácora — Ruta Paisa Planificador (Semana 4)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-4/bitacora-dia-1.md](../docs/semana-4/bitacora-dia-1.md)

## Día 1 — Árbol general de la red
- **NodoArbol:** clase con `valor`, arreglo de `hijos` y `agregarHijo(nodo)` (`src/NodoArbol.js`).
- **Red:** raíz "Red Ruta Paisa", hijos Líneas A/B/K con sus estaciones (22 apariciones) y servicios en San Antonio (Bicicletas públicas, Ascensor) y Poblado (Parqueadero) (`src/red.js`).
- **Funciones recursivas:** `imprimirArbol(nodo, nivel)`, `contarNodos(nodo)`, `contarHojas(nodo)`, `altura(nodo)`.
- **Métricas:** 29 nodos, 23 hojas, altura 3 (aristas).
- **Análisis:** San Antonio y Caribe aparecen en dos líneas → duplicación/inconsistencia y pérdida de identidad de transferencia en un árbol; estructura alternativa propuesta: **grafo** (vértices únicos y aristas por conexiones/transbordos). Dibujo y terminología (raíz, nodos internos, hojas, niveles, altura) en la bitácora de docs.
