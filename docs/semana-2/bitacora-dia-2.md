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

---

## Día 2 (continuación): Recepción con prioridad y simulación

### Contexto
Política: las **urgencias** se atienden antes que cualquier consulta general; entre urgencias se respeta el orden de llegada y lo mismo entre generales. Cada atención dura 20 minutos y hay un solo consultorio.

**Llegadas (sábado):**
| Hora | Mascota | Tipo | Motivo |
|---|---|---|---|
| 8:00 | Toby | General | Control de vacunas |
| 8:05 | Max | General | Revisión de piel |
| 8:10 | Luna | Urgencia | Intoxicación |
| 8:20 | Simón | General | Corte de uñas |
| 8:25 | Kira | Urgencia | Herida en pata |
| 8:40 | Nala | General | Desparasitación |
| 9:00 | Rocky | Urgencia | Dificultad para respirar |

### Cálculo manual previo (traza)
Regla clave: **solo se puede atender a quien ya llegó**. Se registran llegadas al ocurrir y, cuando el consultorio queda libre, se llama al siguiente (primero cola de urgencias, si no, generales).

| Paso | Tiempo (consultorio) | Llegadas registradas hasta poder atender | Cola urgencias (orden) | Cola generales (orden) | Se atiende | Inicio–Fin | Espera |
|---:|---|---|---|---|---|---:|---:|
| 1 | 8:00 libre | 8:00 Toby(G), 8:05 Max(G), 8:10 Luna(U) llegan antes de 8:20? se atiende 8:00: Toby ya llegó | [Luna]* | [Max]* | **Toby** (G, llegó 8:00) | 8:00–8:20 | 0 |
| 2 | 8:20 libre | Ya en colas: Max(G,8:05), Luna(U,8:10); llega 8:20 Simón(G) | [Luna] | [Max, Simón] | **Luna** (U, llegó 8:10) | 8:20–8:40 | 10 |
| 3 | 8:40 libre | En colas: Max(G), Simón(G); llegan 8:25 Kira(U), 8:40 Nala(G) | [Kira] | [Max, Simón, Nala] | **Kira** (U, llegó 8:25) | 8:40–9:00 | 15 |
| 4 | 9:00 libre | En colas: Max(G), Simón(G), Nala(G); llega 9:00 Rocky(U) | [Rocky] | [Max, Simón, Nala] | **Rocky** (U, llegó 9:00) | 9:00–9:20 | 0 |
| 5 | 9:20 libre | Sin urgencias; generales en orden llegada | [] | [Max, Simón, Nala] | **Max** (G, llegó 8:05) | 9:20–9:40 | 75 |
| 6 | 9:40 libre | — | [] | [Simón, Nala] | **Simón** (G, llegó 8:20) | 9:40–10:00 | 80 |
| 7 | 10:00 libre | — | [] | [Nala] | **Nala** (G, llegó 8:40) | 10:00–10:20 | 80 |

\*Paso 1 detallado: 8:00 llega Toby y el consultorio está libre → se atiende de inmediato (8:00). Mientras Toby está en consulta (hasta 8:20) llegan Max (8:05) y Luna (8:10), que esperan en sus colas. A las 8:20, al quedar libre, ya está registrada también la llegada de Simón (8:20) y hay una urgencia (Luna) esperando → se prioriza Luna.

**Orden manual:** Toby, Luna, Kira, Rocky, Max, Simón, Nala.  
**Promedios manuales:** Urgencias = (10+15+0)/3 = **8.33 min**. Generales = (0+75+80+80)/4 = **58.75 min**.

### Implementación
- `patitas/src/Recepcion.js`: dos colas (`urgencias`, `generales`). `registrarLlegada(turno)` encola según tipo; `llamarSiguiente()` atiende primero urgencias y luego generales (`desencolar` de la cola correspondiente); `hayEsperando()`.
- `patitas/src/simulacion.js`: simulación por eventos con horas en minutos (duración 20 min, 1 consultorio). Recorre el tiempo registrando llegadas a medida que ocurren y, cuando el consultorio queda libre, llama al siguiente. Reporta por mascota: llegada, hora de atención y minutos de espera; calcula promedios de urgencias y generales.

**Ejecución:** `node patitas/src/simulacion.js`

**Salida del programa:**
```
Orden de atención:
Toby    General   8:00  8:00   0
Luna    Urgencia  8:10  8:20   10
Kira    Urgencia  8:25  8:40   15
Rocky   Urgencia  9:00  9:00   0
Max     General   8:05  9:20   75
Simón   General   8:20  9:40   80
Nala    General   8:40  10:00  80

Promedios de espera:
Urgencias: 8.33 minutos (25/3)
Generales: 58.75 minutos (235/4)
```

### Comparación manual vs programa
| Mascota | Tipo | Llegada | Atención (manual) | Espera (manual) | Atención (prog.) | Espera (prog.) | Coincide |
|---|---|---|---|---:|---|---:|:--:|
| Toby | General | 8:00 | 8:00 | 0 | 8:00 | 0 | ✓ |
| Luna | Urgencia | 8:10 | 8:20 | 10 | 8:20 | 10 | ✓ |
| Kira | Urgencia | 8:25 | 8:40 | 15 | 8:40 | 15 | ✓ |
| Rocky | Urgencia | 9:00 | 9:00 | 0 | 9:00 | 0 | ✓ |
| Max | General | 8:05 | 9:20 | 75 | 9:20 | 75 | ✓ |
| Simón | General | 8:20 | 9:40 | 80 | 9:40 | 80 | ✓ |
| Nala | General | 8:40 | 10:00 | 80 | 10:00 | 80 | ✓ |

**Resultado:** el programa coincide con el cálculo manual (orden, horas y promedios). No se detectaron errores; no fue necesaria corrección (no hay síntoma/hipótesis/corrección que documentar). Se verifica que ninguna mascota es atendida antes de llegar, ninguna general se atiende con urgencias esperando y dentro de cada tipo se respeta el orden de llegada.

---

## Día 2 (continuación): Pila (LIFO) y deshacer/rehacer

### Contexto
La recepcionista necesita deshacer la última acción y rehacer si deshizo de más. Regla: si después de deshacer se realiza una acción nueva, ya no se puede rehacer lo anterior.

### Decisión de implementación de la Pila
- **Implementación:** `patitas/src/Pila.js` construida con un **arreglo** interno (`_elementos`).
- **Justificación:** una pila solo opera en el tope. `push` (apilar) y `pop` (desapilar) actúan sobre el final del arreglo en **O(1)** amortizado, sin desplazamientos de elementos ni asignación de nodos por operación, lo que resulta simple y eficiente. `verTope`, `estaVacia` y `tamanio` son accesos/lecturas directas **O(1)**. Una versión con nodos enlazados también sería O(1), pero añade mayor complejidad y sobrecarga de memoria por referencias; para el caso de uso (historial de acciones) el arreglo es la opción más clara. `vaciar()` reasigna en O(1).

| Operación | Tiempo | Detalle |
|---|---:|---|
| `apilar` | O(1) | `push` al final |
| `desapilar` | O(1) | `pop` del final, `null` si vacía |
| `verTope` | O(1) | lectura del último índice |
| `estaVacia` | O(1) | compara longitud |
| `tamanio` | O(1) | retorna longitud |

### Editor con dos pilas (`patitas/src/Editor.js`)
- Envuelve `RegistroClinico` y mantiene `pilaDeshacer` y `pilaRehacer` (acciones reversibles).
- `agregar(mascota, atencion)`: registra en el historial, apila acción `{tipo:"agregar", mascota, atencion}` en deshacer y **vacía rehacer**.
- `eliminar(mascota, condicion)`: localiza índice, elimina la primera coincidencia y apila `{tipo:"eliminar", mascota, atencion, indice}` en deshacer y **vacía rehacer**.
- `deshacer()`: desapila de deshacer y revierte (si fue agregar → elimina esa atención; si fue eliminar → reinserta en `indice` con `insertarEn`) y mueve la acción a rehacer. Devuelve `false` si no hay nada.
- `rehacer()`: desapila de rehacer y reaplica la acción, moviéndola a deshacer. Devuelve `false` si no hay nada.
- Se agregó `insertarEn(indice, dato)` en `ListaEnlazada` para restaurar eliminaciones en su posición original.

### Traza de la secuencia (estado tras cada paso)
Secuencia: (1) agregar A, (2) agregar B, (3) eliminar A, (4) deshacer, (5) deshacer, (6) rehacer, (7) agregar C, (8) rehacer.  
Datos: A=`{01/01}`, B=`{02/02}`, C=`{03/03}` sobre mascota Lola. Pilas mostradas base → tope.

| Paso | Acción | Historial Lola | Pila deshacer (base→tope) | Pila rehacer (base→tope) |
|---:|---|---|---|---|
| 1 | agregar A | `[01/01]` | `[agregar(Lola:01/01)]` | `[]` |
| 2 | agregar B | `[01/01, 02/02]` | `[agregar(Lola:01/01), agregar(Lola:02/02)]` | `[]` |
| 3 | eliminar A | `[02/02]` | `[agregar(Lola:01/01), agregar(Lola:02/02), eliminar(Lola:01/01@0)]` | `[]` |
| 4 | deshacer | `[01/01, 02/02]` | `[agregar(Lola:01/01), agregar(Lola:02/02)]` | `[eliminar(Lola:01/01@0)]` |
| 5 | deshacer | `[01/01]` | `[agregar(Lola:01/01)]` | `[eliminar(Lola:01/01@0), agregar(Lola:02/02)]` |
| 6 | rehacer | `[01/01, 02/02]` | `[agregar(Lola:01/01), agregar(Lola:02/02)]` | `[eliminar(Lola:01/01@0)]` |
| 7 | agregar C | `[01/01, 02/02, 03/03]` | `[agregar(Lola:01/01), agregar(Lola:02/02), agregar(Lola:03/03)]` | `[]` |
| 8 | rehacer | `[01/01, 02/02, 03/03]` | `[agregar(Lola:01/01), agregar(Lola:02/02), agregar(Lola:03/03)]` | `[]` |

**Verificaciones:** el historial coincide en cada paso; el paso 8 (`rehacer`) retorna `false` y no modifica nada (pila de rehacer vacía por la acción nueva del paso 7). `deshacer`/`rehacer` con pilas vacías no producen errores. Prueba: `node patitas/pruebas/editor.js`.

---

## Día 2 (cierre): Integración y motor Patitas v0.2

### Integración completa
- `patitas/src/simulacion.js` extendido: cada atención terminada se registra en el historial de la mascota a través de `Editor` (`RegistroClinico` + `ListaEnlazada`).
- **Error simulado y corrección:** se registra por equivocación la atención de Toby en el historial de Max, se detecta, se corrige con `deshacer()` y luego se registra correctamente en Toby. (Ver salida de `node src/simulacion.js`).
- Al final se muestra el reporte de atención (orden, horas, esperas, promedios) y los historiales actualizados de las mascotas atendidas (7 atenciones, cada una en su historial correcto).
- **Validación de seguridad:** `Recepcion.llamarSiguienteSeguro()` — si la sala/espera está vacía muestra un aviso y devuelve `null` sin fallar (probado al final de la simulación).

**Ejecución:** `node patitas/src/simulacion.js` → mañana completa sin errores, corrección aplicada y las 7 atenciones registradas correctamente.

### Tabla de estructuras del motor

| Estructura | Principio | Uso en Patitas | Operaciones principales y complejidad |
|---|---|---|---|
| `Nodo` | Secuencial (enlace) | Unidad básica que almacena `dato` y referencia `siguiente`; base de listas y colas enlazadas | Creación: O(1) tiempo/espacio |
| `ListaEnlazada` | Secuencial (acceso por recorrido) | Historial cronológico de atenciones por mascota (insertar, buscar, eliminar, recorrer) | `agregarAlInicio/AlFinal`: O(1); `estaVacia/obtenerTamanio`: O(1); `recorrer/aArreglo`: O(n); `buscar/insertarDespuesDe/eliminar/insertarEn`: O(n); espacio O(n) |
| `Cola` | **FIFO** (primero en entrar, primero en salir) | Filas de espera en recepción (urgencias y generales) | `encolar`: O(1); `desencolar`: O(1); `verFrente`: O(1); `estaVacia/tamanio`: O(1); espacio O(n) |
| `Pila` | **LIFO** (último en entrar, primero en salir) | Historial de acciones para deshacer/rehacer | `apilar`: O(1) amort.; `desapilar`: O(1); `verTope`: O(1); `estaVacia/tamanio`: O(1); `vaciar`: O(1); espacio O(n) |
| `Recepcion` | FIFO con prioridad (dos colas) | Gestiona llegadas: urgencias antes que generales, respetando orden de llegada en cada tipo | `registrarLlegada`: O(1); `llamarSiguiente/llamarSiguienteSeguro`: O(1); `hayEsperando`: O(1); espacio O(n) |
| `RegistroClinico` | Índice (Map) + secuencial | Agrupa el historial (`ListaEnlazada`) de cada mascota | `registrarAtencion`: O(1) (amort. por `Map` + agregar al final); `obtenerHistorial/mascotas`: O(1)/O(m); espacio O(total atenciones) |
| `Editor` | LIFO (dos pilas) sobre registro | Envuelve `RegistroClinico` para acciones reversibles (agregar/eliminar) con deshacer/rehacer | `agregar`: O(1)*; `eliminar`: O(n)*; `deshacer/rehacer`: O(1) en pilas (la operación inversa sobre la lista puede ser O(n)); `vaciar` rehacer en acción nueva: O(1). \*excluye costo de la operación subyacente en lista |

*Nota:* las complejidades indicadas son de las operaciones de cada estructura; las operaciones compuestas heredan el costo de las estructuras que coordinan.

### Versión
- **v0.2**: integración de `Nodo`, `ListaEnlazada`, `Cola`, `Pila`, `RegistroClinico`, `Recepcion` y `Editor`; simulación completa de la mañana con política de urgencias, registro en historiales y corrección con deshacer.
