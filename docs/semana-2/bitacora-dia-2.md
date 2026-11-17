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
