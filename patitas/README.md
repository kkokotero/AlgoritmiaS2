# Patitas — Motor de historial clínico (v0.1)

Proyecto de la veterinaria **Patitas** para modelar y reportar historiales de atenciones clínicas usando una **lista enlazada**.

## ¿Qué es este proyecto?
Un motor que registra atenciones por mascota en orden cronológico, permite corregir el historial (buscar, insertar, eliminar) y genera un reporte por consola con historial, número de atenciones, costo total y última vacunación.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Cómo ejecutarlo
Desde la carpeta `patitas/`:

```bash
# Pruebas de nodos y recorridos (Día 1)
node pruebas/nodos.js

# Pruebas de lista enlazada (inserción O(1), 6 casos)
node pruebas/lista.js

# Pruebas de búsqueda/inserción intermedia/eliminación (casos borde)
node pruebas/casosBorde.js

# Reporte v0.1 (historiales de Lola, Toby y Mía)
node src/reporte.js
```

**Reporte esperado:** Lola $275.000 (3 atenciones), Toby $265.000 (3), Mía $280.000 (2) y última vacunación por mascota (o "sin registro").

## Estructuras y módulos
| Módulo | Descripción |
|---|---|
| `src/Nodo.js` | Nodo de lista enlazada: `dato` (atención) y `siguiente`. |
| `src/ListaEnlazada.js` | Lista con `cabeza`, `cola`, `tamanio`: inserción al inicio/fin O(1), `recorrer`, `aArreglo`, `buscar`, `insertarDespuesDe`, `eliminar`. |
| `src/RegistroClinico.js` | Composición: índice (`Map`) de mascota → `ListaEnlazada`. `registrarAtencion` crea el historial si no existe y agrega al final. |
| `src/reporte.js` | Carga datos de la clínica y genera el reporte (historial, conteo, total, última vacunación vía `buscar`). |
| `pruebas/*.js` | Pruebas de nodos, lista y casos borde. |

## Bitácora
- `bitacora.md` (en `patitas/`) y documentación detallada en `docs/semana-2/bitacora-dia-1.md` (diagramas, casos borde, complejidades y tabla comparativa lista vs. arreglo).

## Versión
- **v0.1** — Registro clínico, historiales de varias mascotas y reporte por consola.
