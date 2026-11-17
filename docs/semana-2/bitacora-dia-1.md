# Patitas — Bitácora Semana 2, Día 1

**Proyecto:** `patitas/` (motor de historial clínico)  
**Tema:** Nodo y recorrido de una lista enlazada.

## Contexto
La directora médica describe el historial como una carpeta donde “cada atención apunta a la siguiente; si alguien saca una hoja, ya no sabemos qué pasó después”. Esa estructura corresponde a una **lista enlazada**. La pieza mínima es el **nodo**.

## Objetivo
Representar atenciones clínicas como nodos enlazados manualmente y recorrerlos de principio a fin sin usar índices ni arreglos.

## Implementación
- `patitas/src/Nodo.js`: clase `Nodo` con propiedades `dato` (objeto de la atención) y `siguiente` (referencia al próximo nodo, inicialmente `null`).
- `patitas/pruebas/nodos.js`: creación de tres nodos con las atenciones de Lola (gata, 4 años), enlace manual en orden cronológico y dos recorridos con `while (actual !== null)`.

**Atenciones (datos):**
1. `{ fecha: "02/02", motivo: "Vacunación", veterinario: "Dra. Ríos", costo: 85000 }`
2. `{ fecha: "15/03", motivo: "Control de peso", veterinario: "Dr. Gómez", costo: 40000 }`
3. `{ fecha: "20/05", motivo: "Limpieza dental", veterinario: "Dra. Ríos", costo: 150000 }`

**Enlaces:**
```js
nodo1.siguiente = nodo2;
nodo2.siguiente = nodo3;
const cabeza = nodo1;
```

## Diagrama de nodos y flechas

![Diagrama de nodos y flechas](./images/dia-1-nodos-flechas.png)

Representación compacta:
`cabeza → [02/02 Vacunación, $85000 | •] → [15/03 Control de peso, $40000 | •] → [20/05 Limpieza dental, $150000 | null]`

## Recorridos (sin índices ni arreglos)
1. **Impresión:** `actual = cabeza; while (actual !== null) { imprimir(actual.dato); actual = actual.siguiente; }` → imprime las 3 atenciones en orden.
2. **Costo total:** segundo recorrido acumulando `actual.dato.costo` → **$275.000** (85.000 + 40.000 + 150.000).

Ejecución: `node patitas/pruebas/nodos.js` (o desde `patitas/`: `node pruebas/nodos.js`).

**Salida obtenida:**
```
=== Historial de atenciones (Lola) ===
02/02 - Vacunación - Dra. Ríos - $85000
15/03 - Control de peso - Dr. Gómez - $40000
20/05 - Limpieza dental - Dra. Ríos - $150000

Costo total del historial: $275000
```

## Experimento: enlace perdido
**Cambio realizado (a propósito):** `nodo1.siguiente = null;` (se pierde el enlace del primer nodo al segundo).

**Qué ocurre al recorrer desde `cabeza`:**
- `actual` inicia en `nodo1` (no es `null`), se imprime la primera atención (Vacunación).
- Luego `actual = actual.siguiente` pasa a ser `null` (porque rompimos el enlace).
- La condición `while (actual !== null)` resulta falsa y el ciclo termina.

**Resultado:** solo se visita/imprime la **primera** atención y el costo total calculado sería **$85.000**. Los nodos `nodo2` y `nodo3` siguen existiendo en memoria y aún están enlazados entre sí (`nodo2.siguiente === nodo3`), pero se vuelven **inaccesibles** desde `cabeza`.

**Por qué ocurre:** una lista enlazada no tiene acceso por índice; el único camino para llegar a los demás nodos es seguir la cadena de referencias `siguiente` desde la cabeza. Al asignar `null` al `siguiente` del primer nodo se corta esa cadena, por lo que el recorrido no tiene forma de “saltar” al resto del historial. Esto ilustra la fragilidad señalada: perder un enlace equivale a perder el acceso a todo lo que viene después.

---

## Día 1 (continuación): Lista enlazada con cabeza, cola e inserción O(1)

### Objetivo
Implementar una estructura `ListaEnlazada` que agregue atenciones al inicio y al final en tiempo constante (sin recorrer), manteniendo `cabeza`, `cola` y `tamanio`, y que permita recorrer/convertir a arreglo.

### Diseño previo: referencias que cambian (6 casos)

#### Caso 1 — `agregarAlFinal` en lista vacía
**Antes:** `cabeza=null, cola=null, tamanio=0`  (vacía)
```
cabeza -> null
cola   -> null
```
**Después:** se crea `N1`; como está vacía, cabeza y cola apuntan al mismo nodo.
```
cabeza -> [N1 | null] <- cola    tamanio=1
```
Cambios: `cabeza = N1`, `cola = N1`, `N1.siguiente = null`, `tamanio++`.

#### Caso 2 — `agregarAlInicio` en lista vacía
**Antes:** vacía. **Después:** igual estado final que caso 1.
```
cabeza -> [N1 | null] <- cola    tamanio=1
```
Cambios: `cabeza = N1`, `cola = N1`, `N1.siguiente = null`, `tamanio++`.

#### Caso 3 — `agregarAlFinal` en lista con un nodo
**Antes:** `cabeza -> [N1|null] <- cola` (tamanio 1)
**Después:** se crea `N2`, se enlaza la antigua cola a `N2` y se mueve `cola`.
```
cabeza -> [N1 | •] -> [N2 | null] <- cola    tamanio=2
```
Cambios: `cola.siguiente = N2` (N1→N2), `cola = N2`, `tamanio++`. (`cabeza` no cambia).

#### Caso 4 — `agregarAlInicio` en lista con un nodo
**Antes:** `cabeza -> [N1|null] <- cola` (tamanio 1)
**Después:** se crea `N0`, su `siguiente` apunta a la antigua cabeza y se mueve `cabeza`.
```
cabeza -> [N0 | •] -> [N1 | null] <- cola    tamanio=2
```
Cambios: `N0.siguiente = cabeza` (antigua), `cabeza = N0`, `tamanio++`. (`cola` no cambia).

#### Caso 5 — `agregarAlFinal` en lista con varios nodos
**Antes:** `cabeza -> [N1|•]->[N2|null] <- cola` (tamanio 2)
**Después:** se enlaza `N2` al nuevo `N3` y se actualiza `cola`.
```
cabeza -> [N1|•]->[N2|•]->[N3|null] <- cola    tamanio=3
```
Cambios: `cola.siguiente = N3`, `cola = N3`, `tamanio++`.

#### Caso 6 — `agregarAlInicio` en lista con varios nodos
**Antes:** `cabeza -> [N2|•]->[N3|null] <- cola` (tamanio 2)
**Después:** nuevo `N1` apunta a antigua cabeza y `cabeza` se actualiza.
```
cabeza -> [N1|•]->[N2|•]->[N3|null] <- cola    tamanio=3
```
Cambios: `N1.siguiente = cabeza` (antigua), `cabeza = N1`, `tamanio++`.

**Invariante verificada en todos los casos:** si la lista queda con 1 elemento, `cabeza === cola`; si queda vacía, ambas `null`; `tamanio` coincide con la cantidad real de nodos.

### Implementación
- `patitas/src/ListaEnlazada.js`: propiedades `cabeza`, `cola`, `tamanio`.
  - `agregarAlFinal(dato)`: crea nodo; si vacía cabeza=cola=nuevo, si no `cola.siguiente=nuevo; cola=nuevo`; `tamanio++`. **Sin ciclos (O(1))**.
  - `agregarAlInicio(dato)`: crea nodo; si vacía cabeza=cola=nuevo, si no `nuevo.siguiente=cabeza; cabeza=nuevo`; `tamanio++`. **Sin ciclos (O(1))**.
  - `recorrer(callback)`: ejecuta `callback(dato)` por cada nodo (recorrido lineal).
  - `aArreglo()`: acumula datos usando `recorrer`.
  - `estaVacia()`, `obtenerTamanio()`.

### Pruebas
- `patitas/pruebas/lista.js`: ejecuta y verifica los 6 casos (estado de `cabeza`, `cola`, `tamanio`, `estaVacia()` y orden de `aArreglo()` tras cada operación).

**Ejecución:** `node patitas/pruebas/lista.js`
```
OK - Caso 1: agregarAlFinal en lista vacía
OK - Caso 2: agregarAlInicio en lista vacía
OK - Caso 3: agregarAlFinal en lista con un nodo
OK - Caso 4: agregarAlInicio en lista con un nodo
OK - Caso 5: agregarAlFinal en lista con varios nodos
OK - Caso 6: agregarAlInicio en lista con varios nodos

Todos los casos pasaron.
```

### Complejidad de cada método

| Método | Tiempo | Espacio extra | Justificación |
|---|---:|---:|---|
| `constructor` | O(1) | O(1) | Inicializa tres referencias/contador |
| `estaVacia` | O(1) | O(1) | Compara el contador |
| `obtenerTamanio` | O(1) | O(1) | Retorna el contador |
| `agregarAlFinal` | **O(1)** | O(1) | Usa `cola` directamente, no recorre la lista |
| `agregarAlInicio` | **O(1)** | O(1) | Usa `cabeza` directamente, no recorre la lista |
| `recorrer` | O(n) | O(1) | Visita cada uno de los n nodos una vez |
| `aArreglo` | O(n) | O(n) | Recorre n nodos y crea un arreglo de n elementos |

---

## Día 1 (continuación): Búsqueda, inserción intermedia y eliminación

### Objetivo
Agregar operaciones de corrección al historial sin dejarlo “cortado”: buscar una atención, insertar después de un nodo dado y eliminar un nodo, cubriendo casos borde de cabeza, cola y lista vacía.

### Implementación (`patitas/src/ListaEnlazada.js`)
- `buscar(condicion)`: recorre desde `cabeza` con `actual` y devuelve el primer `dato` que cumple la condición, o `null`.
- `insertarDespuesDe(condicion, dato)`: recorre hasta hallar el nodo; crea `nuevo`, hace `nuevo.siguiente = actual.siguiente` y `actual.siguiente = nuevo`; si `actual === cola` actualiza `cola = nuevo`; incrementa `tamanio`. Devuelve `true/false`.
- `eliminar(condicion)`: si vacía retorna `null`; si la cabeza cumple, avanza `cabeza` (y si queda vacía `cola = null`); si no, recorre con `anterior` y `actual` para desenganchar (`anterior.siguiente = actual.siguiente`) y si `actual === cola` actualiza `cola = anterior`; decrementa `tamanio` y devuelve el dato eliminado.

### Dibujos previos: tres casos de eliminación
Estado inicial de referencia: `cabeza -> [A|•]->[B|•]->[C|null] <- cola`, `tamanio=3`.

#### 1. Eliminar la cabeza (A)
```
Antes:   cabeza -> [A|•] -> [B|•] -> [C|null] <- cola
Acción:  cabeza = cabeza.siguiente  (cabeza pasa a B)
Después: cabeza -> [B|•] -> [C|null] <- cola    (A queda fuera)  tamanio=2
```
No se necesita `anterior`. Si además era el único nodo, `cabeza` queda `null` y se hace `cola = null`.

#### 2. Eliminar un nodo intermedio (B)
```
Antes:   cabeza -> [A|•] -> [B|•] -> [C|null] <- cola
                 anterior  actual
Acción:  anterior.siguiente = actual.siguiente  (A apunta a C)
Después: cabeza -> [A|•] -> [C|null] <- cola    (B queda fuera)  tamanio=2
```
`cola` no cambia porque el eliminado no era la cola.

#### 3. Eliminar la cola (C)
```
Antes:   cabeza -> [A|•] -> [B|•] -> [C|null] <- cola
                 anterior  actual(==cola)
Acción:  anterior.siguiente = actual.siguiente (B->null), cola = anterior
Después: cabeza -> [A|•] -> [B|null] <- cola    (C queda fuera)  tamanio=2
```
La nueva cola (`B`) queda con `siguiente === null`, manteniendo el historial íntegro.

### Pruebas de casos borde (`patitas/pruebas/casosBorde.js`)
Se verifica después de cada prueba `cabeza`, `cola`, `tamanio`/`estaVacia()` y orden (`aArreglo()`), y que `cola.siguiente === null` cuando aplica.

| Prueba | Resultado esperado | Estado |
|---|---|---|
| 1. Eliminar en lista vacía | devuelve `null`, lista sigue vacía | OK |
| 2. Eliminar el único nodo | devuelve dato, `cabeza=cola=null`, tamanio 0 | OK |
| 3. Eliminar la cabeza | cabeza avanza, orden y referencias correctos | OK |
| 4. Eliminar la cola | nueva cola correcta y `cola.siguiente === null` | OK |
| 5. Eliminar algo que no existe | devuelve `null`, lista sin cambios | OK |
| 6. Insertar después de la cola | inserta al final y actualiza `cola` | OK |
| Extra. Buscar / insertar en medio / no encontrado | comportamientos correctos | OK |

**Ejecución:** `node patitas/pruebas/casosBorde.js` → todas las pruebas pasaron.

### Complejidad de las operaciones

| Método | Tiempo | Espacio extra | Justificación |
|---|---:|---:|---|
| `buscar(condicion)` | O(n) | O(1) | Recorre secuencialmente hasta hallar o llegar a `null` |
| `insertarDespuesDe(condicion, dato)` | O(n) | O(1) | Debe buscar el nodo objetivo; el re-enlace es O(1) |
| `eliminar(condicion)` | O(n) | O(1) | Búsqueda secuencial con `anterior/actual`; re-enlace O(1) |

### ¿Por qué eliminar la cola en una lista simplemente enlazada requiere recorrerla?
En una lista **simplemente enlazada** cada nodo solo conoce su `siguiente`, no su anterior. Aunque tengamos referencia directa a la `cola`, para eliminarla debemos hacer que el **penúltimo** nodo pase a ser la nueva cola y que su `siguiente` sea `null`. Pero el penúltimo no es accesible desde la cola (no hay enlace hacia atrás), así que la única forma de encontrarlo es recorrer desde la `cabeza` llevando un puntero `anterior` hasta que `actual === cola`. Por eso la eliminación de la cola cuesta **O(n)**. (En una lista doblemente enlazada, el penúltimo sería `cola.anterior` y podría hacerse en O(1).)
