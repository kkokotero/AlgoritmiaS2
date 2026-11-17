# Patitas — Motor de historial clínico (v0.2)

Proyecto de la veterinaria **Patitas** para modelar historiales de atenciones, gestionar la recepción con prioridades y soportar correcciones con deshacer/rehacer, usando estructuras de datos enlazadas, colas y pilas.

## ¿Qué es este proyecto?
Un motor que:
- Registra atenciones por mascota en orden cronológico (lista enlazada).
- Atiende la recepción con política de prioridad: **urgencias antes que generales**, respetando el orden de llegada en cada tipo (colas FIFO).
- Permite corregir errores con **deshacer/rehacer** (pilas LIFO) sin perder consistencia.
- Simula la mañana completa: reporte de atención (orden, horas, esperas, promedios) e historiales actualizados.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Cómo ejecutarlo
Desde la carpeta `patitas/`:

```bash
# Pruebas Día 1
node pruebas/nodos.js
node pruebas/lista.js
node pruebas/casosBorde.js

# Reporte de historiales base (v0.1)
node src/reporte.js

# Pruebas Día 2
node pruebas/cola.js          # Cola FIFO + comparación push/shift (100.000)
node pruebas/editor.js        # Deshacer/rehacer: traza de 8 pasos

# Simulación integrada (v0.2): mañana del sábado
node src/simulacion.js
```

**`src/simulacion.js` (v0.2):** ejecuta la mañana completa sin errores; simula un registro erróneo corregido con deshacer; muestra reporte (orden, horas, esperas y promedios de urgencias/generales) e historiales actualizados de las 7 mascotas atendidas. Incluye validación segura al llamar con sala vacía.

## Estructuras y módulos
| Módulo | Descripción |
|---|---|
| `src/Nodo.js` | Nodo enlazado genérico: `dato` y `siguiente`. |
| `src/ListaEnlazada.js` | Lista con `cabeza`, `cola`, `tamanio`: inserción O(1) en extremos, `recorrer`, `aArreglo`, `buscar`, `insertarDespuesDe`, `eliminar`, `insertarEn`. |
| `src/RegistroClinico.js` | `Map` mascota → `ListaEnlazada` (historial por mascota). |
| `src/Cola.js` | Cola FIFO con `frente`/`final`: `encolar`, `desencolar`, `verFrente` (O(1)). |
| `src/Pila.js` | Pila LIFO (arreglo): `apilar`, `desapilar`, `verTope` (O(1)). |
| `src/Recepcion.js` | Dos colas (urgencias/generales): `registrarLlegada`, `llamarSiguiente`, `llamarSiguienteSeguro`. |
| `src/Editor.js` | Deshacer/rehacer sobre `RegistroClinico` con dos pilas de acciones reversibles. |
| `src/reporte.js` | Reporte v0.1 de historiales base. |
| `src/simulacion.js` | Simulación integrada v0.2 (recepción + atención + registro + corrección). |
| `pruebas/*.js` | Pruebas de nodos, lista, casos borde, cola y editor. |

## Bitácora
Documentación detallada (diagramas, trazas, complejidades y tablas) en:
- [`docs/semana-2/bitacora-dia-1.md`](../docs/semana-2/bitacora-dia-1.md) — nodos, lista enlazada, casos borde y v0.1.
- [`docs/semana-2/bitacora-dia-2.md`](../docs/semana-2/bitacora-dia-2.md) — cola, recepción/prioridad, simulación manual, pila, deshacer/rehacer, integración y tabla de estructuras (v0.2).

## Versión
- **v0.2** — Integración de colas, pilas y listas: simulación con prioridad de urgencias, registro en historiales y corrección con deshacer.
