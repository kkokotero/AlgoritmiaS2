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
