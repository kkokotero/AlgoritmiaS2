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
- **`src/ArbolBusqueda.js`:** `NodoBinario(codigo, estacion, izquierdo, derecho)` y `ArbolBusqueda` (`raiz`) con `insertar`, `buscar`, recorridos `inorden/preorden/postorden(callback)`, `altura()` y `contarHojas()`/`contarNodos()`.
- **Claves repetidas:** si el código ya existe se ignora el duplicado y se conserva la estación original (documentado).
- **Inserción y búsqueda (20 estaciones):** árbol coincide con el dibujo. Búsquedas: `buscar(50)`→1 comp., `buscar(59)`→7, `buscar(10)`→4, `buscar(40)`→3, `buscar(33)`→`null`. Comparaciones = profundidad + 1.
- **Recorridos y usos:** inorden → listado ordenado para tableros (10–90, verificado); preorden → exportación/reconstrucción idéntica del árbol; postorden → liberación segura (hijos antes que padre) y conteo. Predicciones en bitácora coinciden con la ejecución (`src/recorridos.js`).
- **Altura/hojas:** altura 6 aristas (coincide con dibujo), 8 hojas, n=20; mínima teórica `floor(log2(20))=4` → árbol desbalanceado por orden de inserción.
- **Ejecución:** `node src/ArbolBusqueda.js`, `node src/recorridos.js`.
