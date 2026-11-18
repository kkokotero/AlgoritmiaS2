# Bitácora — Ruta Paisa Planificador (Semana 4)

Las bitácoras detalladas se registran en `docs/` organizada por semana y día:

- [../docs/semana-4/bitacora-dia-1.md](../docs/semana-4/bitacora-dia-1.md)

## Día 1 — Árbol general de la red
- **NodoArbol:** clase con `valor`, arreglo de `hijos` y `agregarHijo(nodo)` (`src/NodoArbol.js`).
- **Red:** raíz "Red Ruta Paisa", hijos Líneas A/B/K con sus estaciones (22 apariciones) y servicios en San Antonio (Bicicletas públicas, Ascensor) y Poblado (Parqueadero) (`src/red.js`).
- **Funciones recursivas:** `imprimirArbol(nodo, nivel)`, `contarNodos(nodo)`, `contarHojas(nodo)`, `altura(nodo)`.
- **Métricas:** 29 nodos, 23 hojas, altura 3 (aristas).
- **Análisis:** San Antonio y Caribe aparecen en dos líneas → duplicación/inconsistencia en un árbol; alternativa propuesta: **grafo**. Dibujo y terminología en docs.

## Día 1 (continuación) — Árbol binario de búsqueda (ABB)
- **`src/ArbolBusqueda.js`:** `NodoBinario(codigo, estacion, izquierdo, derecho)` y `ArbolBusqueda` (`raiz`) con `insertar(codigo, estacion)` iterativo y `buscar(codigo)` → `{estacion, comparaciones}` o `null`.
- **Claves repetidas:** si el código ya existe se ignora el duplicado y se conserva la estación original (documentado).
- **Inserción (20 estaciones):** árbol coincide con el dibujo de la bitácora. Búsquedas: `buscar(50)`→1 comp., `buscar(59)`→7, `buscar(10)`→4, `buscar(40)`→3, `buscar(33)`→`null` (4 comparaciones). Comparaciones = profundidad + 1.
- **Ejecución:** `node src/ArbolBusqueda.js`.
