# Ruta Paisa — Planificador (Semana 4)

## Descripción
Proyecto para modelar la red piloto **Ruta Paisa** como un **árbol general** (jerarquía: red → líneas → estaciones → servicios) y recorrerla con funciones recursivas. Incluye `NodoArbol` y utilidades para imprimir, contar nodos, contar hojas y calcular la altura.

## Requisitos
- [Node.js](https://nodejs.org/) >= 18
- Git

## Estructura
```
ruta-paisa-planificador/
├── src/
│   ├── NodoArbol.js       # Clase NodoArbol (valor, hijos, agregarHijo)
│   ├── red.js             # Árbol general de la red y funciones recursivas
│   └── ArbolBusqueda.js   # ABB por código: NodoBinario, insertar y buscar
├── bitacora.md            # Bitácora (dibujos, métricas y análisis)
├── jsconfig.json
├── package.json
└── README.md
```

## Ejecución
Desde la carpeta `ruta-paisa-planificador/`:

```bash
# Árbol general de la red y métricas recursivas
node src/red.js
# o
npm start

# Árbol binario de búsqueda por código de estación (inserción y búsqueda)
node src/ArbolBusqueda.js
```

**Salida esperada (`red.js`):** impresión del árbol con sangría (3 niveles para líneas, estaciones y servicios) y métricas recursivas: `contarNodos`, `contarHojas` y `altura`.  
**Salida esperada (`ArbolBusqueda.js`):** inserción de 20 estaciones y resultados de búsqueda (estación y comparaciones) para San Antonio (1), San Javier (7), Niquía (4), Hospital (3) y código 33 inexistente (`null`).

## Red piloto modelada
- **Línea A:** Niquía (10), Bello (20), Caribe (30), Universidad (35), Hospital (40), Parque Berrío (45), San Antonio (50), Exposiciones (60), Industriales (65), Poblado (70), Itagüí (80), La Estrella (90)
- **Línea B:** San Antonio (50), Cisneros (52), Suramericana (54), Estadio (56), Floresta (58), San Javier (59)
- **Línea K:** Caribe (30), Acevedo (25), Andalucía (27), Santo Domingo (29)

**Servicios:** San Antonio → Bicicletas públicas, Ascensor; Poblado → Parqueadero.

## Bitácora
- Detalle en [`bitacora.md`](bitacora.md) y en [`../docs/semana-4/bitacora-dia-1.md`](../docs/semana-4/bitacora-dia-1.md): dibujo del árbol, terminología (raíz, nodos internos, hojas, niveles, altura) y análisis de estaciones compartidas.
