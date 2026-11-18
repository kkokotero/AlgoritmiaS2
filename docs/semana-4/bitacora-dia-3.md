# Bitácora Día 3 — Semana 4: Simulacro de entrevista (duplicados en torniquetes)

**Fecha:** 2026-11-18  
**Proyecto:** `ruta-paisa-planificador` — Reto `src/retos/duplicados.js`

## Contexto
Primera entrevista (simulacro). Los torniquetes a veces registran dos veces la misma validación cuando el pasajero acerca la tarjeta dos veces en el mismo minuto. Recaudo necesita detectar esos registros duplicados (**misma tarjeta, misma estación, mismo minuto**) para no cobrar doble.

**Datos de ejemplo:**

| Tarjeta | Estación | Hora  | Valor |
|---------|----------|-------|------:|
| T-101   | 50       | 07:02 | 3.000 |
| T-205   | 30       | 07:02 | 3.000 |
| T-101   | 50       | 07:02 | 3.000 |
| T-330   | 56       | 07:05 | 3.000 |
| T-205   | 30       | 07:09 | 3.000 |
| T-412   | 10       | 07:10 | 3.000 |
| T-330   | 56       | 07:05 | 3.000 |
| T-101   | 60       | 07:31 | 3.000 |

**Esperado:** 2 registros duplicados (T-101 en 50 a las 07:02 y T-330 en 56 a las 07:05) y monto a corregir **$6.000**. **T-205** en estación 30 a las 07:02 y a las 07:09 **no** es duplicado (minuto distinto).

---

## Protocolo de resolución en voz alta

### 1) Repetición del problema (con mis palabras)
Dada una lista de validaciones de torniquete (tarjeta, estación, hora/minuto, valor), debo identificar los cobros repetidos que corresponden a la misma persona validando dos veces en el mismo lugar y en el mismo minuto. Debo devolver esos registros duplicados y calcular cuánto dinero se cobró de más para corregirlo.

### 2) Restricciones y preguntas (clarificación)
- **Volumen:** ¿cuántas validaciones hay por día? (pueden ser cientos de miles o millones) → la solución debe escalar bien en tiempo y memoria.
- **Definición de duplicado:** misma `tarjeta` + misma `estación` + misma `hora` (al minuto). La primera aparición es válida; las siguientes en la misma clave se consideran duplicadas.
- **Entrada/salida:** arreglo de objetos en memoria; devolver lista de duplicados y el monto total a corregir.
- **Formato de hora:** cadena `"HH:MM"` (minuto exacto). No se agrupan minutos distintos.
- **Orden:** se recorre en orden de llegada para marcar como duplicada toda aparición posterior a la primera.

### 3) Ejemplos y casos borde
- **Caso del enunciado:** 2 duplicados, $6.000.
- **Misma tarjeta, misma estación, hora distinta:** T-205 (30, 07:02) vs (30, 07:09) → **no** duplicado.
- **Misma tarjeta, hora igual, estación distinta:** T-101 (50, 07:02) vs (60, 07:31) → no duplicado (estación y hora difieren).
- **Lista vacía:** `[]` → sin duplicados, monto 0.
- **Sin duplicados:** todas las claves distintas → resultado vacío, monto 0.
- **Más de dos repeticiones de la misma clave:** la 2.ª, 3.ª, etc., se cuentan como duplicados (todas las posteriores a la primera).

### 4) Solución por fuerza bruta y complejidad
Comparar cada validación `i` con todas las anteriores (o con todas las demás) y verificar si coinciden tarjeta, estación y hora sin haberla contado ya.
- **Tiempo:** O(n²) por los pares comparados.
- **Espacio:** O(k) para llevar control de cuáles ya se marcaron (o O(1) adicional según implementación). Ineficiente para volúmenes diarios altos.

### 5) Optimización y justificación de la estructura
Usar un **`Set` de claves compuestas** ya vistas: `clave = tarjeta|estacion|hora`.
- Recorrer la lista una sola vez, en orden.
- Si la `clave` **no** está en el `Set`: es la primera vez → agregarla a vistas (validación válida).
- Si la `clave` **ya** está en el `Set`: es una repetición → registrar como duplicado (cobro de más).

**Por qué `Set`:** ofrece pertenencia e inserción en **O(1)** promedio por operación, evitando comparaciones cuadráticas. La clave compuesta codifica exactamente la regla del negocio (misma tarjeta, misma estación, mismo minuto).

### 6) Implementación
Archivo: `ruta-paisa-planificador/src/retos/duplicados.js`

- `claveValidacion(v)` → `"${tarjeta}|${estacion}|${hora}"`.
- `validacionesDuplicadas(validaciones)` → recorre, usa `Set` de vistas y acumula duplicados. **O(n)** tiempo, **O(n)** espacio.
- `montoACorregir(validaciones)` → suma `valor` de los duplicados devueltos.

### 7) Recorrido en voz alta con los datos de ejemplo (traza)

| Paso | Validación | Clave | ¿En vistas? | Acción | vistas (claves) |
|---:|---|---|---|---|---|
| 1 | T-101,50,07:02 | `T-101|50|07:02` | No | agregar | {T-101\|50\|07:02} |
| 2 | T-205,30,07:02 | `T-205|30|07:02` | No | agregar | +T-205\|30\|07:02 |
| 3 | T-101,50,07:02 | `T-101|50|07:02` | **Sí** | **duplicado** | — |
| 4 | T-330,56,07:05 | `T-330|56|07:05` | No | agregar | +T-330\|56\|07:05 |
| 5 | T-205,30,07:09 | `T-205|30|07:09` | No | agregar (hora distinta a 07:02) | +T-205\|30\|07:09 |
| 6 | T-412,10,07:10 | `T-412|10|07:10` | No | agregar | +T-412\|10\|07:10 |
| 7 | T-330,56,07:05 | `T-330|56|07:05` | **Sí** | **duplicado** | — |
| 8 | T-101,60,07:31 | `T-101|60|07:31` | No | agregar (estación/hora distintas) | +T-101\|60\|07:31 |

**Resultado:** duplicados = [ (T-101,50,07:02,$3000), (T-330,56,07:05,$3000) ], monto = **$6.000**. T-205 en 30 a las 07:09 no se marca porque su clave difiere de 07:02.

### 8) Complejidad final
- **Tiempo:** **O(n)**, un recorrido con operaciones de `Set` (`has`/`add`) en O(1) promedio.
- **Espacio:** **O(n)** en el peor caso para almacenar las claves vistas (y O(k) para la lista de duplicados). Justificado frente a O(n²) de la fuerza bruta para el volumen diario esperado.

### Verificación
Ejecución: `node ruta-paisa-planificador/src/retos/duplicados.js`
```
Registros duplicados encontrados: 2
- T-101 | estación 50 | 07:02 | $3000
- T-330 | estación 56 | 07:05 | $3000
Monto a corregir: $6000
```
`node --check src/retos/duplicados.js` sin errores.

---

## Evaluación de rúbrica (simulacro de entrevista)

> Simulacro documentado siguiendo el protocolo (entrevistador, candidato, observador) y la rúbrica: comprensión, diseño, corrección, complejidad y comunicación.

### Evaluación recibida como candidato
| Criterio | Nivel | Observación |
|---|---|---|
| Comprensión | Cumple | Reformuló el problema con precisión (misma tarjeta, estación y minuto), identificó el objetivo de negocio (no cobrar doble) y aclaró restricciones de volumen y formato. |
| Diseño | Cumple | Contrastó fuerza bruta O(n²) con la solución óptima; justificó correctamente el `Set` y la clave compuesta `tarjeta|estacion|hora`. |
| Corrección | Cumple | Detecta los 2 duplicados del ejemplo y monto $6.000; maneja el caso T-205 07:02 vs 07:09 como no duplicado y considera casos borde. |
| Complejidad | Cumple | Declaró y justificó O(n) tiempo y O(n) espacio, relacionándolo con el volumen diario. |
| Comunicación | Cumple | Explicó el razonamiento paso a paso y realizó traza en voz alta sobre los datos de ejemplo antes de cerrar. |

**Fortaleza:** justificación clara del paso de fuerza bruta a estructura hash (`Set`) alineada a la regla del dominio.  
**Oportunidad de mejora:** explicitar desde el inicio el supuesto de "primera válida, siguientes duplicadas" y preguntar por validaciones con valores distintos en la misma clave.

### Autoevaluación
| Criterio | Nivel | Evidencia / reflexión |
|---|---|---|
| Comprensión | Cumple | Paráfrasis del enunciado, preguntas de restricciones y casos borde (vacío, sin duplicados, misma clave repetida >2 veces, hora/estación distinta). |
| Diseño | Cumple | Elección de clave compuesta y `Set` para pertenencia O(1) promedio, adecuada al patrón de deduplicación por identidad compuesta. |
| Corrección | Cumple | Implementación probada con el ejemplo oficial: 2 duplicados y $6.000; T-205 30 07:09 no contado como duplicado de 07:02. |
| Complejidad | Cumple | Análisis de fuerza bruta vs optimizada y complejidad final O(n)/O(n) documentada y coherente con el código. |
| Comunicación | Cumple | Bitácora con protocolo completo, tabla de traza y cierre de complejidad; código con nombres descriptivos y ejecución demostrativa. |

**Fortaleza:** recorrido (traza) detallado que evidencia corrección y manejo del caso no duplicado por diferencia de minuto.  
**Oportunidad de mejora:** en una entrevista real, verbalizar más temprano alternativas de clave (p. ej. tupla/serialización) y confirmar el separador para evitar colisiones hipotéticas de formato.

---

# Segundo simulacro — Demanda: hora pico y estaciones más usadas

**Proyecto:** `ruta-paisa-planificador` — Reto `src/retos/demanda.js`

## Contexto
Segunda entrevista (nivel intermedio). Operaciones quiere programar más trenes en los momentos de mayor demanda.
- Dato: validaciones de toda la red, minuto a minuto, entre las 6:00 y las 6:19:  
  `const porMinuto = [120, 135, 150, 180, 210, 260, 310, 340, 330, 300, 280, 250, 240, 260, 290, 320, 350, 360, 310, 270];`
- Pregunta 1: “¿Cuáles son los 5 minutos consecutivos con más validaciones?” → `horaPico(porMinuto, k)`.
- Pregunta 2: “Con el registro de validaciones del día, ¿cuáles son las tres estaciones más usadas?” → generar 50.000 validaciones con estaciones al azar de la red e implementar `estacionesMasUsadas(validaciones, k)`.

**Esperado:** `horaPico(porMinuto, 5)` → ventana que inicia a las **6:14** con **1.630** validaciones. Ventana deslizante en un solo recorrido. `estacionesMasUsadas` devuelve tres estaciones con sus conteos y complejidad justificada. Alternativa para obtener solo las tres primeras explicada con complejidad.

## Protocolo de resolución en voz alta

### 1) Señales del enunciado (identificación)
- **“minutos consecutivos”** → sugiere **ventana deslizante** de tamaño fijo `k` (subarreglo contiguo).
- **“más usadas”** → sugiere **conteo de frecuencias** (histograma por estación) con un `Map`, y luego seleccionar las mayores.

### 2) Restricciones y preguntas
- `porMinuto`: n valores (20 en el ejemplo) desde 6:00 (índice 0 = 6:00). `k` fijo (5). Se requiere inicio en formato `6:mm` y total de la ventana.
- Registro del día: 50.000 validaciones con estaciones al azar de la red (códigos de la red del grafo). Se piden las 3 más usadas con sus conteos.
- Escala: solución debe ser eficiente; la ventana no debe recalcular sumas desde cero en cada posición.

### 3) Ejemplos y casos borde
- Ejemplo: ventana máxima de 5 es índices 14–18 → 290+320+350+360+310 = **1630**, inicio **6:14**.
- Borde: `k <= 0` o arreglo vacío → total 0; `k > n` → tomar ventana de tamaño `n`; empates → se conserva la primera ventana máxima encontrada.

### 4) `horaPico`: fuerza bruta vs ventana deslizante
- **Fuerza bruta:** para cada inicio posible calcular la suma de los `k` elementos → O(n·k) tiempo.
- **Optimización (ventana deslizante):** calcular la suma de la primera ventana `[0,k)`; luego deslizar una posición: `suma = suma - sale + entra`. Cada elemento entra y sale a lo sumo una vez → **un solo recorrido O(n)** tiempo y **O(1)** espacio adicional.
- Conversión de índice a hora: índice `i` → `6:${mm}` con `mm` de dos dígitos.

**Traza (k=5):**
| Paso | Ventana (índices) | Minutos | Suma | Máximo |
|---:|---|---|---:|---|
| inicial | 0–4 | 6:00–6:04 | 120+135+150+180+210 = **795** | 795 (inicio 0) |
| i=5  | 1–5  | 6:01–6:05 | 795-120+260 = 935 | 935 (1) |
| i=6  | 2–6  | 6:02–6:06 | 935-135+310 = 1110 | 1110 (2) |
| i=7  | 3–7  | 6:03–6:07 | 1110-150+340 = 1300 | 1300 (3) |
| i=8  | 4–8  | 6:04–6:08 | 1300-180+330 = 1450 | 1450 (4) |
| i=9  | 5–9  | 6:05–6:09 | 1450-210+300 = 1540 | 1540 (5) |
| i=10 | 6–10 | 6:06–6:10 | 1540-260+280 = 1560 | 1560 (6) |
| i=11 | 7–11 | 6:07–6:11 | 1560-310+250 = 1500 | 1560 (6) |
| i=12 | 8–12 | 6:08–6:12 | 1500-340+240 = 1400 | 1560 (6) |
| i=13 | 9–13 | 6:09–6:13 | 1400-330+260 = 1330 | 1560 (6) |
| i=14 | 10–14| 6:10–6:14 | 1330-300+290 = 1320 | 1560 (6) |
| i=15 | 11–15| 6:11–6:15 | 1320-280+320 = 1360 | 1560 (6) |
| i=16 | 12–16| 6:12–6:16 | 1360-250+350 = 1460 | 1560 (6) |
| i=17 | 13–17| 6:13–6:17 | 1460-240+360 = 1580 | 1580 (13) |
| i=18 | 14–18| 6:14–6:18 | 1580-260+310 = **1630** | **1630 (inicio 14 → 6:14)** |
| i=19 | 15–19| 6:15–6:19 | 1630-290+270 = 1610 | 1630 (14) |

Resultado: inicio **6:14**, total **1630**.

### 5) `estacionesMasUsadas`: conteo y complejidad
- **Conteo de frecuencias:** recorrer las `n` validaciones y acumular en `Map<estacion, conteo>` (`get`/`set` O(1) promedio) → **O(n)**.
- **Ordenamiento de entradas:** convertir a arreglo y ordenar por conteo descendente → **O(u log u)**, con `u` = estaciones distintas.
- **Tomar k:** `slice(0,k)` → O(k).
- **Total:** **O(n + u log u)** tiempo, **O(u)** espacio (Map + arreglo de entradas).

Implementación: genera 50.000 validaciones con estaciones al azar tomadas de `construirGrafoRed().adyacencia.keys()` y devuelve el top 3 con sus conteos (los conteos varían por aleatoriedad, la lógica y complejidad se mantienen).

### 6) Alternativa si solo se necesitaran las tres primeras (sin ordenar todas)
- **Mantener un top-k fijo en una pasada:** tras construir el conteo O(n), recorrer las `u` entradas del `Map` manteniendo las 3 mayores (comparaciones constantes por entrada) → **O(n + u)** tiempo, **O(u)** espacio. Para `k=3` es lineal en `u` y evita el `log u` del ordenamiento total.
- **Min-heap de tamaño k:** insertar/actualizar entradas en un heap mínimo limitado a `k` elementos: O(log k) por entrada → **O(n + u log k)** tiempo, **O(u)** espacio. Con `k=3`, `log k` es constante, equivalente en orden a **O(n + u)**. Ventaja: escala bien si `k` crece pero sigue siendo `k << u`.

### 7) Pistas progresivas (registro)
- **Pistas usadas:** **0**. El candidato identificó las señales (“minutos consecutivos” → ventana deslizante, “más usadas” → frecuencias/Map), planteó la optimización y las complejidades sin bloquearse más de tres minutos. El entrevistador no requirió entregar pistas progresivas.

### Verificación
Ejecución: `node ruta-paisa-planificador/src/retos/demanda.js`
```
-- Hora pico (ventana deslizante, k=5) --
Ventana con más validaciones: inicia a las 6:14, total 1630 validaciones (índice inicio 14).
-- Estaciones más usadas (50.000 validaciones, top 3) --
1. Estación <código>: <conteo> validaciones (varía por aleatoriedad)
2. Estación <código>: <conteo> validaciones
3. Estación <código>: <conteo> validaciones
Complejidad estacionesMasUsadas: O(n + u log u) tiempo y O(u) espacio...
Alternativa: mantener top-3 en una pasada O(n+u) o min-heap de tamaño k O(n + u log k).
```
`horaPico(porMinuto, 5)` = **6:14, 1630** (un recorrido). `node --check` sin errores.

---

## Evaluación de rúbrica — Segundo simulacro

> Rúbrica: comprensión, diseño, corrección, complejidad y comunicación. Pistas progresivas registradas.

### Evaluación recibida como candidato
| Criterio | Nivel | Observación |
|---|---|---|
| Comprensión | Cumple | Identificó correctamente las señales del enunciado: “minutos consecutivos” → ventana deslizante y “más usadas” → conteo de frecuencias. Aclaró formato de hora y alcance del registro. |
| Diseño | Cumple | Propuso ventana deslizante (actualización por resta/suma) frente a recomputar sumas; usó `Map` para frecuencias y ordenamiento de entradas para el top-k. |
| Corrección | Cumple | `horaPico(porMinuto,5)` devuelve 6:14 y 1630; `estacionesMasUsadas` genera 50.000 validaciones y retorna 3 estaciones con conteos. |
| Complejidad | Cumple | Justificó O(n) y recorrido único en `horaPico`, y O(n + u log u) / O(u) en `estacionesMasUsadas`; explicó alternativa O(n+u) u O(n + u log k) para solo las tres primeras. |
| Comunicación | Cumple | Comunicó señales, decisiones y trazó la ventana deslizante en voz alta; cerró con complejidades y alternativa. |

**Pistas progresivas usadas:** 0.  
**Fortaleza:** mapeo rápido de palabras clave del problema a técnicas (ventana deslizante / hashing-frecuencias) y comparación de enfoques con complejidad.  
**Oportunidad de mejora:** mencionar explícitamente el manejo de empates y validar entradas (k, arreglos vacíos) al inicio de la explicación.

### Autoevaluación
| Criterio | Nivel | Evidencia / reflexión |
|---|---|---|
| Comprensión | Cumple | Señales identificadas y traducidas a estructuras/algoritmos adecuados; alcance de n, u, k aclarado. |
| Diseño | Cumple | Ventana deslizante de tamaño fijo con actualización incremental y `Map` + ordenamiento de entradas, coherente con lo solicitado. |
| Corrección | Cumple | Resultado esperado verificado (6:14, 1630); generación de 50.000 registros y top 3 funcional; `node --check` correcto. |
| Complejidad | Cumple | Análisis fuerza bruta O(n·k) vs O(n) y justificación O(n + u log u); alternativa top-k sin ordenar todo explicada (O(n+u) / O(n + u log k)). |
| Comunicación | Cumple | Traza tabulada de la ventana, explicación de decisiones y registro explícito de pistas (0). |

**Fortaleza:** traza completa que evidencia el recorrido único y la actualización constante de la ventana.  
**Oportunidad de mejora:** en contexto real, discutir costo práctico de `Math.random`/distribución y, si aplica, estabilidad o criterio de desempate en el top.

---

# Mantenimiento: dependencias, ciclos y orden de ejecución

**Proyecto:** `ruta-paisa-planificador` — `src/GrafoDirigido.js`, `src/mantenimiento.js`, comando `node src/planificador.js --mantenimiento`

## Contexto
El equipo de mantenimiento planea las obras del próximo mes. Algunas tareas dependen de otras (no se puede probar la señalización antes de cambiar los rieles). Sospechan que el plan tiene un error porque nadie logra decidir por dónde empezar.

**Plan original:**

| Tarea | Descripción                         | Requiere terminar antes |
|-------|-------------------------------------|-------------------------|
| T1    | Cerrar el tramo Caribe–Universidad  | —                       |
| T2    | Cambiar rieles del tramo            | T1                      |
| T3    | Actualizar el software de señalización | T5                   |
| T4    | Probar la señalización              | T2, T3                  |
| T5    | Instalar sensores nuevos            | T4                      |
| T6    | Reabrir el tramo                    | T4                      |

## Grafo dirigido del plan original (dibujo)
Se modelan dependencias como **grafo dirigido**: una flecha de cada tarea requerida hacia la tarea que la necesita (arista `requerida → dependiente`).

Aristas: `T1→T2`, `T2→T4`, `T5→T3`, `T3→T4`, `T4→T5`, `T4→T6`.

```
Plan original (arista: requisito -> tarea dependiente)

        T1
         │
         ▼
        T2 ────────────┐
                       ▼
   ┌───── T5 ◄─────── T4 ──────► T6
   │                   ▲
   │                   │
   └─────► T3 ─────────┘

Ciclo dirigido detectado: T3 → T4 → T5 → T3
  (T3 necesita T5, T5 necesita T4, T4 necesita T3: ninguna puede iniciar)
```

Lectura del ciclo:
- `T3` requiere `T5`  ⇒ arista `T5 → T3` (y T3 depende de T5)
- `T4` requiere `T3`  ⇒ arista `T3 → T4`
- `T5` requiere `T4`  ⇒ arista `T4 → T5`
Por tanto existe el ciclo `T3 → T4 → T5 → T3` en el grafo de dependencias.

## Modelado e implementación

### Grafo dirigido (`src/GrafoDirigido.js`)
- **Lista de adyacencia** `Map<id, vecinos[]>` con conexiones en **un solo sentido** (`agregarArista(desde,hasta)`, sin duplicar aristas). Vértices = tareas, aristas = dependencias `requerida → dependiente`.

### Detección de ciclos — `tieneCiclo()` (DFS con tres estados)
DFS con tres estados por tarea:
- `sin_visitar`: no explorada.
- `en_proceso`: en la pila/recursión actual (ancestro en el camino DFS).
- `terminada`: todos sus sucesores ya fueron explorados.

Si durante el recorrido se alcanza un vértice en estado **`en_proceso`**, se encontró una arista de retorno y existe un **ciclo**. La función devuelve `{ hayCiclo, ciclo }` donde `ciclo` es el arreglo de tareas que forman el ciclo (reconstruido siguiendo padres), o `null` si no hay ciclo.

### Orden de ejecución — `ordenDeEjecucion()` (ordenamiento topológico)
Usa el **orden de finalización** del DFS: al terminar de explorar un vértice (pasa a `terminada`) se registra en una pila/lista; el **inverso** de ese orden de finalización es un **orden topológico** válido (cada tarea aparece después de todas sus dependencias/requisitos). Si hay ciclo, no existe orden válido y se informa el error.

### Complejidad
- **Tiempo:** **O(V + E)** — cada vértice y cada arista se visitan/procesan una vez en el DFS (detección de ciclos y ordenamiento topológico).
- **Espacio:** **O(V)** — estados, estructura de padres/pila de finalización y pila de recursión en el peor caso.

## Diagnóstico del plan original (`node src/planificador.js --mantenimiento`)
```
DIAGNÓSTICO: Se detectó un ciclo de dependencias. No es posible determinar un inicio válido.
Ciclo detectado: T3 → T4 → T5 → T3
Tareas involucradas en el ciclo:
  * T3 - Actualizar el software de señalización
  * T4 - Probar la señalización
  * T5 - Instalar sensores nuevos
```
Se muestra al equipo de mantenimiento el ciclo que impide iniciar el plan.

## Corrección del plan y justificación

**Propuesta razonable:** `T5` (Instalar sensores nuevos) pasa a requerir `T2` en lugar de `T4`.

| Tarea | Descripción                         | Requiere terminar antes (corregido) |
|-------|-------------------------------------|-------------------------------------|
| T1    | Cerrar el tramo Caribe–Universidad  | —                                   |
| T2    | Cambiar rieles del tramo            | T1                                  |
| T3    | Actualizar el software de señalización | T5                               |
| T4    | Probar la señalización              | T2, T3                              |
| **T5**| **Instalar sensores nuevos**        | **T2** (antes T4)                   |
| T6    | Reabrir el tramo                    | T4                                  |

**Justificación:** los sensores son componentes físicos sobre la vía, por lo que se instalan después de **cambiar los rieles (T2)** y antes de **actualizar/probar el software de señalización (T3, T4)** que depende de ellos. Esto elimina la dependencia circular `T5 ← T4` (T5 ya no depende de T4) y rompe el ciclo `T3 → T4 → T5 → T3`, manteniendo una secuencia lógica de obra.

**Grafo corregido (sin ciclo):**
```
        T1
         │
         ▼
        T2 ────────────┬───────────┐
         │             ▼           ▼
         │            T5 ───────► T3
         │                         │
         └──────────────┐          ▼
                        └───────► T4 ──────► T6
(Aristas: T1→T2, T2→T5, T5→T3, T2→T4, T3→T4, T4→T6)
```

## Verificación del plan corregido y orden de ejecución
```
DIAGNÓSTICO: No se detectaron ciclos. El plan es ejecutable.
Orden de ejecución válido (ordenamiento topológico, respeta todas las dependencias):
  1. T1 - Cerrar el tramo Caribe–Universidad
  2. T2 - Cambiar rieles del tramo
  3. T5 - Instalar sensores nuevos
  4. T3 - Actualizar el software de señalización
  5. T4 - Probar la señalización
  6. T6 - Reabrir el tramo

Resumen: Plan original CON CICLO (T3 → T4 → T5 → T3).
         Plan corregido SIN CICLOS. Orden válido: T1 → T2 → T5 → T3 → T4 → T6.
```

**Validación de dependencias del orden:** T1 sin requisitos; T2 tras T1; T5 tras T2; T3 tras T5; T4 tras T2 y T3; T6 tras T4 → cada tarea aparece después de sus requisitos. ✅

## Integración en el planificador
- Comando: `node src/planificador.js --mantenimiento` (o `npm run mantenimiento` si se define script).
- Muestra diagnóstico del plan original (ciclo y tareas), propuesta de corrección justificada, diagnóstico del plan corregido y orden de ejecución válido. Implementación en `src/mantenimiento.js` usando `GrafoDirigido`.

---

# Ruta Paisa v1.0 — Integración, pruebas y cierre (MiniReto 12)

## Integración y organización del repositorio
Se reorganizó el proyecto en la estructura solicitada:
- `src/estructuras/`: `NodoArbol.js`, `ArbolBusqueda.js`, `Grafo.js` (no dirigido, DFS/BFS/componentes), `GrafoDirigido.js` (ciclos y orden topológico), `Cola.js`.
- `src/dominio/`: `indice.js` (ABB/listado/rango), `red.js` (grafo de líneas A,B,K,T), `cierres.js` (alcanzabilidad y estaciones críticas), `mantenimiento.js` (validación de plan), `planificador.js` (lógica v1.0).
- `src/retos/`: `duplicados.js` (Set, claves compuestas) y `demanda.js` (ventana deslizante, Map de frecuencias).
- `src/planificador.js`: CLI principal con compatibilidad de módulos anteriores (reexportaciones en `src/`).
- `pruebas/todo.js`: pruebas con casos normal y borde por funcionalidad, salida `OK`/`FALLA`.

### Funcionalidades ofrecidas por `node src/planificador.js`
1. **Consulta de ruta con transbordos y cierres:** `<origen> <destino> [--cerradas cod1,cod2,...]` (valida códigos con índice ABB, BFS con menor número de tramos, nombres/líneas/paradas/transbordos, mensajes claros para inexistentes o viaje imposible).
2. **Listado ordenado de estaciones:** `--listado` (inorden del ABB, 10–90).
3. **Consulta por rango de códigos:** `--rango <desde> <hasta>` (poda en ABB, resultado en orden).
4. **Análisis de estaciones críticas:** `--criticas` (cierre individual que divide la red en 2+ componentes, DFS/componentes).
5. **Validación del plan de mantenimiento:** `--mantenimiento` (grafo dirigido, detección de ciclo con DFS de 3 estados y orden topológico del plan corregido).

**Verificación:** `node src/planificador.js 10 59` (ruta con 2 transbordos), `--listado` (20 estaciones), `--rango 10 30` (6 estaciones), `--criticas` (11 críticas), `--mantenimiento` (ciclo `T3 → T4 → T5 → T3` y orden `T1 → T2 → T5 → T3 → T4 → T6`). `node pruebas/todo.js` → **14 OK, 0 FALLA** (normal y borde por cada funcionalidad y retos).

## Tabla de decisiones técnicas (resumen)
Documentada en `README.md` (≥6 problemas) con problema, estructura/algoritmo, alternativa descartada, complejidad y justificación: árbol general (jerarquía), ABB (índice/listado/rango), grafo no dirigido + lista de adyacencia (red/transbordos), DFS (alcanzabilidad/cierres/componentes), BFS+cola+padres (ruta mínima en tramos), grafo dirigido + DFS 3 estados/topológico (ciclos y orden de mantenimiento), Set con clave compuesta (duplicados O(n)), ventana deslizante y Map+ordenamiento (demanda, con alternativa top-k O(n+u)).

## Sustentación técnica (5 minutos) — guion preparado

**1. Problema del cliente (≈45 s):** Ruta Paisa necesita un planificador que permita a pasajeros y operación consultar viajes en la red piloto (líneas A,B,K,T, 20 estaciones), considerando transbordos y cierres, disponer de un índice consultable de estaciones, identificar puntos críticos de la red y validar planes de mantenimiento con dependencias sin bloqueos.

**2. Demostración en vivo de dos consultas (≈90 s):**
- `node src/planificador.js 10 59` → valida origen/destino con el índice ABB, calcula ruta con BFS, muestra estaciones por nombre, líneas por tramo, **7 paradas** y **2 transbordos** (Hospital A→T, Estadio T→B).
- `node src/planificador.js --mantenimiento` → modela dependencias como grafo dirigido, detecta el ciclo **T3 → T4 → T5 → T3** en el plan original, propone corrección justificada (T5 depende de T2 en vez de T4) y entrega orden topológico válido **T1 → T2 → T5 → T3 → T4 → T6**.

**3. Decisión técnica justificada con complejidad (≈75 s):** para “la ruta con menos paradas” se eligió **BFS** sobre un grafo no dirigido con lista de adyacencia, usando **cola** FIFO y `Map` de padres para reconstruir el camino. En grafos no ponderados, BFS explora por niveles y garantiza el **mínimo número de aristas (tramos)**. **Complejidad O(V+E)** tiempo y **O(V)** espacio. Alternativas descartadas: **DFS** (encuentra un camino, no necesariamente el más corto) y **Dijkstra** (sobrecosto innecesario al no haber pesos; sería pertinente si se optimizara por tiempo/distancia).

**4. Mejora futura (≈45 s):** incorporar **pesos** en las aristas (tiempo estimado, congestión, frecuencia) y usar **Dijkstra/A*** para rutas óptimas por tiempo; persistir el grafo/índice y telemetría de cierres en tiempo real; y balancear el índice (AVL/árbol rojo-negro) o usar un mapa ordenado para garantizar O(log n) aun con inserciones ordenadas.

**5. Cierre (≈15 s):** el producto integra árbol general, ABB, grafos, DFS/BFS, hashing y técnicas de entrevista (ventana deslizante/frecuencias) con pruebas y decisiones justificadas.

### Evaluación de la sustentación (rúbrica de la sesión)
| Criterio | Nivel | Observación |
|---|---|---|
| Claridad del problema y contexto | Cumple | Expone necesidad del cliente y alcance (rutas, cierres, índice, críticos, mantenimiento). |
| Demostración funcional | Cumple | Muestra dos consultas en vivo coherentes con las funcionalidades del planificador. |
| Decisión técnica y complejidad | Cumple | Justifica BFS frente a alternativas y declara O(V+E)/O(V) correctamente. |
| Mejora futura y visión | Cumple | Propone evolución realista (pesos/tiempos, balanceo, datos en tiempo real). |
| Comunicación y manejo del tiempo | Cumple | Estructura en 5 bloques dentro de ~5 minutos, lenguaje técnico preciso. |

**Fortaleza:** conexión clara entre la pregunta del usuario (“menos paradas”) y la elección algorítmica con complejidad.  
**Oportunidad de mejora:** incluir en la demo un caso borde en vivo (código inexistente o `--cerradas 56`) para evidenciar robustez.

## Resumen de lo construido en cada MiniReto de la semana (12)

| MiniReto | Qué se construyó | Aporte al producto | Evidencia (commit principal) |
|---:|---|---|---|
| 1. Estación base | Árbol general de la red (`NodoArbol`, `redArbol.js`) y recorridos recursivos (imprimir, contar nodos/hojas, altura) | Jerarquía red→líneas→estaciones→servicios; detecta límite para estaciones compartidas | `dcc9a23` feat(ruta-paisa): modelar red como árbol general con recorridos recursivos |
| 2. Índice de estaciones | ABB por código (`ArbolBusqueda.js`, `insertar`, `buscar` con comparaciones) | Búsqueda eficiente y validación de estaciones | `1e50024` feat(ruta-paisa): agregar ABB de estaciones con inserción y búsqueda |
| 3. Recorridos del índice | Inorden, preorden, postorden, altura y hojas; exportación/reconstrucción | Listados ordenados, exportación y métricas del índice | `23623d4` feat(ruta-paisa): recorridos inorden/preorden/postorden, altura y hojas del ABB |
| 4. Ruta Paisa v0.1 | Consultas mínimo/máximo/rango con poda, reporte de índice y análisis de árbol degenerado O(n) | Índice consultable integrado | `22cc16c` chore(release): ruta-paisa-planificador v0.1 - consultas mínimo/máximo/rango y reporte |
| 5. La red como grafo | Grafo no dirigido con lista de adyacencia y aristas etiquetadas por línea (`Grafo.js`, `red.js`) | Modelo correcto de transbordos y ciclos (V=20, E=21) | `d22c60b` feat(ruta-paisa): grafo no dirigido de la red con lista de adyacencia y transbordos |
| 6. DFS y cierres | DFS recursivo/iterativo, componentes conectados y estaciones críticas (`cierres.js`) | Alcanzabilidad y análisis de impacto de cierres | `f5d52b6` feat(ruta-paisa): DFS recursivo/iterativo, componentes y estaciones críticas |
| 7. Menos paradas | BFS con cola y reconstrucción de camino (ruta mínima en tramos) | Cálculo de rutas en grafo no ponderado | `584d6eb` chore(release): ruta-paisa-planificador v0.2 - planificador BFS con transbordos y cierres |
| 8. Ruta Paisa v0.2 | Integración índice+grafo, CLI con transbordos, nombres/líneas, cierres y manejo de imposibles | Planificador de viajes funcional | `584d6eb` chore(release): ruta-paisa-planificador v0.2 - planificador BFS con transbordos y cierres |
| 9. Simulacro I | Detección de duplicados con `Set` y clave compuesta, protocolo y rúbrica (`retos/duplicados.js`) | Solución O(n) y comunicación en entrevista | `9b15332` feat(ruta-paisa): reto duplicados con Set y evaluaciones Día 3 |
| 10. Simulacro II | Ventana deslizante (hora pico) y frecuencias con `Map` (`retos/demanda.js`), alternativas de complejidad | Análisis de demanda y decisiones técnicas | `9e93d25` feat(ruta-paisa): reto demanda ventana deslizante y frecuencias Día 3 |
| 11. Mantenimiento sin ciclos | Grafo dirigido, DFS de 3 estados para ciclos y orden topológico (`GrafoDirigido.js`, `mantenimiento.js`, `--mantenimiento`) | Validación de planes de obra y diagnóstico accionable | `b264aa4` feat(ruta-paisa): grafo dirigido, detección de ciclos y mantenimiento |
| 12. Ruta Paisa v1.0 | Integración en `estructuras/`, `dominio/`, `retos/`, 5 funcionalidades en CLI, pruebas `OK/FALLA`, README con decisiones, bitácora y sustentación | Producto final documentado y probado | `chore(release): ruta-paisa-planificador v1.0 - integración, pruebas y documentación` (commit de lanzamiento) |

> Nota: los MiniRetos 7 y 8 se consolidan en el release v0.2 (BFS y planificador integrado), según la traza de commits del repositorio.

## Reflexión de cierre
La estrategia que más me resultó útil en la ruta fue **elegir la estructura y el algoritmo a partir de las “señales” del problema** y validar la decisión con su complejidad y una traza pequeña: jerarquía → árbol, relaciones con ciclos/transbordos → grafo, “menos paradas” en grafo no ponderado → BFS, dependencias → grafo dirigido/topológico, unicidad/duplicados → `Set` hash, consecutivos → ventana deslizante y “más usados” → frecuencias con `Map`. Complementar esto con el protocolo en voz alta (aclarar restricciones, considerar fuerza bruta, optimizar y justificar) permitió pasar de soluciones correctas a soluciones eficientes y explicables, que es el objetivo central de la sustentación y del trabajo como desarrollador.
