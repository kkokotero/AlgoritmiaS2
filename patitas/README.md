# Patitas — Motor de historial clínico (v1.0)

Motor de la veterinaria **Patitas** para gestionar historiales de atenciones, recepción con prioridad de urgencias, correcciones con deshacer/rehacer y catálogo de servicios, usando estructuras de datos propias.

## Descripción
El sistema:
- Modela **historiales clínicos** por mascota como listas enlazadas (registro cronológico, búsqueda y corrección).
- Gestiona la **recepción** con dos colas FIFO y prioridad: urgencias antes que generales, respetando el orden de llegada.
- Soporta **deshacer/rehacer** de acciones (pilas LIFO) sobre el registro.
- Recorre un **catálogo anidado** de servicios de forma recursiva (conteo, listado, profundidad, búsqueda, rutas, paquetes y rangos).
- Integra todo en una **simulación/demostración** de la jornada.

## Estructuras implementadas y su uso en Patitas

| Estructura | Principio | Uso en Patitas |
|---|---|---|
| `Nodo` | Secuencial (enlace) | Pieza básica (`dato`, `siguiente`) de listas y colas enlazadas. |
| `ListaEnlazada` | Secuencial (recorrido) | Historial de atenciones por mascota: insertar, buscar, eliminar, recorrer. |
| `Cola` | FIFO | Filas de espera en recepción (urgencias y generales). |
| `Pila` | LIFO | Historial de acciones para deshacer/rehacer. |
| `Recepcion` | FIFO con prioridad | Dos colas: atiende urgencias primero, luego generales (por orden de llegada). |
| `RegistroClinico` | Índice (`Map`) + lista | Asocia cada mascota con su `ListaEnlazada` de atenciones. |
| `Editor` | LIFO (dos pilas) | Acciones reversibles (agregar/eliminar) con deshacer/rehacer. |
| `catalogo` | Árbol n-ario (recursivo) | Servicios y subcategorías: conteo, listado, rutas, paquetes y rangos. |

## Tabla de operaciones y complejidad

| Estructura | Operación | Tiempo | Espacio extra | Nota |
|---|---|---:|---:|---|
| `Nodo` | crear | O(1) | O(1) | |
| `ListaEnlazada` | `agregarAlInicio/AlFinal`, `estaVacia`, `obtenerTamanio` | O(1) | O(1) | `cabeza`/`cola`/`tamanio` |
| `ListaEnlazada` | `recorrer`, `aArreglo`, `buscar`, `insertarDespuesDe`, `eliminar`, `insertarEn` | O(n) | O(1) (O(n) `aArreglo`) | recorrido/secuencial |
| `ListaEnlazada` (recursiva) | `tamanioRecursivo`, `costoTotalRecursivo`, `buscarRecursivo`, `imprimirAlReves` | O(n) | **O(n)** pila | riesgo de desbordamiento en n grande; iterativas son oficiales |
| `Cola` | `encolar`, `desencolar`, `verFrente`, `estaVacia`, `tamanio` | O(1) | O(1) | FIFO con `frente/final` |
| `Pila` | `apilar` | O(1) amort. | O(1) | arreglo, tope al final |
| `Pila` | `desapilar`, `verTope`, `estaVacia`, `tamanio`, `vaciar` | O(1) | O(1) | |
| `Recepcion` | `registrarLlegada`, `llamarSiguiente`, `llamarSiguienteSeguro`, `hayEsperando` | O(1) | O(1) | delega en colas |
| `RegistroClinico` | `registrarAtencion`, `obtenerHistorial` | O(1) amort. | O(1) | `Map` + insertar al final |
| `Editor` | `agregar` / `eliminar` | O(1)* / O(n)* | O(1) | *coste de la operación subyacente; gestiona pilas |
| `Editor` | `deshacer`, `rehacer` | O(1) pilas + coste inverso | O(1) | acción nueva vacía rehacer |
| `catalogo` (recursivo) | `contarServicios`, `buscarServicio`, `rutaDeServicio`, `sumarServicios`, `precioPaquete`, `serviciosEnRango`, `profundidad`, `listarCatalogo` | O(n) | O(h) pila / O(h) ruta | n nodos/servicios, h profundidad (árbol) |

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Cómo ejecutar

Desde la carpeta `patitas/`:

### Demostración (v1.0)
```bash
node demo.js
# o
npm run demo
```
Muestra 5 secciones: (1) catálogo con jerarquía, (2) simulación de la mañana con urgencias, (3) corrección con deshacer/rehacer, (4) historiales finales, (5) búsqueda de servicio con ruta y precio de paquete (+ validación de sala vacía).

### Pruebas
```bash
node pruebas/todo.js      # pruebas finales (OK/FALLA) por estructura
npm test                  # nodos, lista, casos borde, cola, editor
npm run todo              # alias de pruebas/todo.js
```

### Otros comandos
```bash
npm run nodos
npm run lista
npm run casos-borde
npm run reporte           # reporte v0.1
npm run cola
npm run editor
npm run recursivo         # recursión en lista y desbordamiento
npm run simulacion        # simulación integrada v0.2
npm run catalogo          # catálogo recursivo
```

## Estructura del proyecto
```
patitas/
├── demo.js                  # Demostración v1.0 (5 secciones)
├── src/
│   ├── estructuras/         # Nodo, ListaEnlazada, Cola, Pila
│   └── dominio/             # RegistroClinico, Recepcion, Editor, catalogo, reporte, simulacion
├── pruebas/                 # nodos, lista, casosBorde, cola, editor, recursivo, todo
├── package.json
└── README.md
```

## Bitácora
- [`docs/semana-2/bitacora-dia-1.md`](../docs/semana-2/bitacora-dia-1.md) — nodos, lista, casos borde, v0.1 y comparación lista/arreglo.
- [`docs/semana-2/bitacora-dia-2.md`](../docs/semana-2/bitacora-dia-2.md) — cola, recepción/prioridad, simulación, pila, deshacer/rehacer, v0.2 y tabla de estructuras.
- [`docs/semana-2/bitacora-dia-3.md`](../docs/semana-2/bitacora-dia-3.md) — catálogo recursivo, búsquedas/rutas/paquetes/rangos, recursión sobre lista, desbordamiento y cierre v1.0.

## Versión
- **v1.0** — Integración completa, demostración, pruebas finales y documentación de producto.
