# Patitas — Bitácora Semana 2, Día 2

**Proyecto:** `patitas/` (motor de historial clínico)  
**Tema:** Cola (FIFO) basada en nodos, comparación con arreglos.

## Contexto
La recepción atiende por orden de llegada: quien llega primero es atendido primero (FIFO). Se necesita registrar llegadas, llamar al siguiente, ver quién sigue sin sacarlo y saber cuántos esperan, evitando el costo de `shift()` en arreglos.

## Objetivo
Implementar una cola basada en nodos con `encolar` y `desencolar` en tiempo constante, reutilizando `Nodo`.

## Diseño previo: estado de la cola (frente y final)

### 1) Cola vacía
```
frente -> null
final  -> null
tamanio = 0
```

### 2) Encolar a Lola (L)
```
frente -> [Lola | null] <- final      tamanio = 1
```
Cola vacía: `frente` y `final` apuntan al nuevo nodo.

### 3) Encolar a Toby (T)
```
frente -> [Lola | •] -> [Toby | null] <- final      tamanio = 2
```
`final.siguiente = Toby` (enlace desde el antiguo final) y `final = Toby`.

### 4) Encolar a Mía (M)
```
frente -> [Lola | •] -> [Toby | •] -> [Mía | null] <- final      tamanio = 3
```
Mismo mecanismo: se enlaza desde `final` y se actualiza `final`.

### 5) Desencolar una vez (sale Lola, FIFO)
```
Antes:   frente -> [Lola | •] -> [Toby | •] -> [Mía | null] <- final
Acción:  dato = frente.dato (Lola); frente = frente.siguiente
Después: frente -> [Toby | •] -> [Mía | null] <- final      tamanio = 2
```
Sale quien llegó primero (Lola). `final` no cambia. Si al desencolar la cola quedara vacía, se haría `frente = null` y `final = null`.

## Implementación (`patitas/src/Cola.js`)
- Propiedades: `frente`, `final`, `_tamanio`.
- `encolar(dato)`: crea nodo; si vacía `frente=final=nuevo`, si no `final.siguiente=nuevo; final=nuevo`; `_tamanio++`. **Sin ciclos, O(1)**.
- `desencolar()`: si vacía retorna `null`; toma `frente.dato`, avanza `frente`; si `frente` queda `null` hace `final=null`; `_tamanio--`; retorna dato. **Sin ciclos, O(1)**.
- `verFrente()`: retorna dato del frente o `null` sin retirar. **O(1)**.
- `estaVacia()` y `tamanio()`: **O(1)**.
- Reutiliza `Nodo` (`patitas/src/Nodo.js`, genérico).

## Pruebas (`patitas/pruebas/cola.js`)
- 5 turnos encolados: `{mascota,tutor,horaLlegada,motivo}` (Lola, Toby, Mía, Rocky, Nala).
- Verificaciones: cola vacía inicial → `desencolar()` devuelve `null` y deja `frente/final` en `null`; tras encolar, `verFrente()` es Lola y `final` es Nala; al desencolar todos salen en orden **FIFO** `[Lola, Toby, Mía, Rocky, Nala]`; al quedar vacía `frente/final` son `null` y `desencolar()` devuelve `null`.
- **Ejecución:** `node patitas/pruebas/cola.js` → `OK - Cola FIFO: 5 turnos atendidos en orden de llegada`.

## Comparación con arreglos (100.000 turnos)

Medición con `console.time` (mismo entorno de ejecución):

| Implementación | Operación | Tiempo (100.000) |
|---|---|---:|
| Cola (nodos) | encolar | 23.078 ms |
| Cola (nodos) | desencolar | 1.523 ms |
| Arreglo (`push`/`shift`) | `push` (encolar) | 12.154 ms |
| Arreglo (`push`/`shift`) | `shift` (desencolar) | 619.727 ms |

### Complejidad y explicación

| Estructura | `encolar` / `push` | `desencolar` / `shift` | `verFrente` | Espacio |
|---|---:|---:|---:|---:|
| **Cola (nodos, `frente/final`)** | **O(1)** | **O(1)** | **O(1)** | O(n) |
| **Arreglo (`push`/`shift`)** | **O(1)** amortizado | **O(n)** | O(1) (`arr[0]`) | O(n) |

**Diferencia:** en la cola enlazada, `encolar` ajusta `final.siguiente` y `final`, y `desencolar` avanza `frente`; ambas tocan solo referencias locales sin importar cuántos elementos haya (tiempo constante). En un arreglo, `push` agrega al final en O(1) amortizado, pero `shift` elimina el primer elemento y **debe desplazar todos los demás una posición a la izquierda** para mantener los índices contiguos, lo que cuesta O(n) por operación. Por eso, al desencolar 100.000 turnos el arreglo acumula desplazamientos (~O(n²) en total) y resulta mucho más lento (~620 ms) frente a la cola por nodos (~1.5 ms), mientras que encolar es comparable.

## Conclusión
La cola basada en nodos cumple FIFO con operaciones de inserción/extracción en O(1) y maneja correctamente el caso vacío (devuelve `null` y deja `frente/final` en `null`), siendo adecuada para la fila de recepción.
