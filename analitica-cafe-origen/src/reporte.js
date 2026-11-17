/**
 * Reporte de negocio de Café Origen (v1.0).
 *
 * Ejecutable con:
 *   node src/reporte.js          -> datos reales (Día 1)
 *   node src/reporte.js 100000   -> n ventas generadas
 *
 * Integra funciones optimizadas (O(n) / O(n log n)) y nuevas secciones.
 */

const { VENTAS } = require("./datos.js");
const { CATALOGO, comboRegaloOptimizado } = require("./catalogo.js");
const { generarVentas, totalesPorDia } = require("./generarVentas.js");
const { mejorSemana } = require("./ventanas.js");
const {
  clientesRecurrentesSet,
  fechasConVentas,
  formatearMoneda,
  formatearNumero,
  primerClienteUnico,
  productoEstrellaPorCiudad,
  resumenDelDia,
  resumenPorCiudad,
  resumenPorProducto,
  ticketPromedio,
  topProductosPorValor,
  totalVendidoM,
  unidadesVendidasM,
  ventaMayor,
} = require("./analitica.js");

const ANCHO = 78;
const ETIQUETAS = 38;

const LINEA = "═".repeat(ANCHO);
const SEPARADOR = "─".repeat(ANCHO);

const VENTAS_DIARIAS_SEPTIEMBRE = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370,
];

/**
 * Obtiene el conjunto de ventas a analizar según argumentos CLI.
 * @returns {{ ventas: import('./datos.js').Venta[], etiqueta: string }}
 */
function obtenerVentas() {
  const arg = process.argv[2];
  if (arg === undefined) {
    return { ventas: VENTAS, etiqueta: "datos reales (Día 1)" };
  }
  const n = Number(arg);
  if (!Number.isFinite(n) || n <= 0) {
    return { ventas: VENTAS, etiqueta: "datos reales (Día 1)" };
  }
  return { ventas: generarVentas(Math.floor(n)), etiqueta: `${Math.floor(n)} ventas generadas` };
}

const { ventas, etiqueta: etiquetaDatos } = obtenerVentas();
const inicioTotal = process.hrtime.bigint();

/**
 * Imprime el encabezado del reporte.
 * @param {string} version
 * @returns {void}
 */
function encabezado(version) {
  const generado = new Date().toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  console.log(LINEA);
  console.log(`  CAFÉ ORIGEN · REPORTE DE VENTAS · ${version}`);
  console.log(
    `  Generado: ${generado} · Registros analizados: ${formatearNumero(ventas.length)} (${etiquetaDatos})`
  );
  console.log(LINEA);
}

/**
 * @param {string | number} numero
 * @param {string} titulo
 * @returns {void}
 */
function seccion(numero, titulo) {
  console.log("");
  console.log(SEPARADOR);
  console.log(` ${numero}. ${titulo.toLocaleUpperCase("es")}`);
  console.log(SEPARADOR);
}

/**
 * @param {string} etiqueta
 * @param {string} valor
 * @returns {void}
 */
function fila(etiqueta, valor) {
  const puntos = ".".repeat(Math.max(3, ETIQUETAS - etiqueta.length));
  console.log(`  ${etiqueta} ${puntos} ${valor}`);
}

/**
 * @param {string} fecha
 * @returns {string}
 */
function formatearFecha(fecha) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!coincidencia) return fecha;
  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
}

/**
 * @param {string} fecha
 * @returns {string}
 */
function diaSiguiente(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const siguiente = new Date(Date.UTC(anio, mes - 1, dia + 1));
  return siguiente.toISOString().slice(0, 10);
}

function seccionResumenGeneral() {
  const total = totalVendidoM(ventas);
  const unidades = unidadesVendidasM(ventas);
  const ticket = ticketPromedio(ventas);
  const mayor = ventaMayor(ventas);

  seccion(1, "Resumen general");

  fila("Ventas registradas", formatearNumero(ventas.length));
  fila("Unidades vendidas", formatearNumero(unidades));
  fila("Total vendido", formatearMoneda(total));
  fila("Ticket promedio", formatearMoneda(ticket));

  if (mayor) {
    fila(
      "Venta mayor",
      `${formatearMoneda(mayor.cantidad * mayor.precio)} · #${mayor.id} · ${mayor.producto}`
    );
    fila("  Fecha de la venta mayor", formatearFecha(mayor.fecha));
  } else {
    fila("Venta mayor", "Sin ventas registradas");
  }

  const ciudades = resumenPorCiudad(ventas);
  fila("Ciudades con ventas", formatearNumero(ciudades.length));
  fila(
    "Ciudad líder",
    ciudades.length > 0 ? `${ciudades[0].ciudad} (${formatearMoneda(ciudades[0].total)})` : "—"
  );
}

function seccionVentasPorCiudad() {
  const ciudades = resumenPorCiudad(ventas);
  const total = totalVendidoM(ventas);

  seccion(2, "Ventas por ciudad");

  console.table(
    ciudades.map((ciudad) => ({
      Ciudad: ciudad.ciudad,
      Ventas: formatearNumero(ciudad.ventas),
      Unidades: formatearNumero(ciudad.unidades),
      Total: formatearMoneda(ciudad.total),
      Participación: `${total > 0 ? ((ciudad.total / total) * 100).toFixed(1) : "0.0"}%`,
    }))
  );
}

function seccionUnidadesPorProducto() {
  const productos = resumenPorProducto(ventas);

  seccion(3, "Unidades por producto");

  console.table(
    productos.map((producto) => ({
      Producto: producto.producto,
      Unidades: formatearNumero(producto.unidades),
      Valor: formatearMoneda(producto.total),
      Participación: `${producto.participacion.toFixed(1)}%`,
    }))
  );
}

function seccionTopProductos() {
  const top = topProductosPorValor(ventas, 3);
  const total = totalVendidoM(ventas);

  seccion(4, "Top 3 de productos por valor");

  if (top.length === 0) {
    fila("Resultado", "Sin ventas registradas");
    return;
  }

  top.forEach((producto, indice) => {
    const participacion = total > 0 ? (producto.total / total) * 100 : 0;
    const etiqueta = `${indice + 1}. ${producto.producto}`;
    const puntos = ".".repeat(Math.max(3, ETIQUETAS + 2 - etiqueta.length));
    console.log(
      `  ${etiqueta} ${puntos} ${formatearMoneda(producto.total)} (${participacion.toFixed(1)}%)`
    );
  });
}

function seccionClientesRecurrentes() {
  const recurrentes = clientesRecurrentesSet(ventas);
  seccion(5, "Clientes recurrentes");
  fila("Total clientes recurrentes", formatearNumero(recurrentes.size));
  const muestra = [...recurrentes].slice(0, 10);
  fila("Muestra", muestra.length > 0 ? muestra.join(", ") + (recurrentes.size > 10 ? ", ..." : "") : "—");
}

function seccionProductoEstrellaPorCiudad() {
  const estrellas = productoEstrellaPorCiudad(ventas);
  seccion(6, "Producto estrella por ciudad");
  const filas = Object.entries(estrellas).map(([ciudad, producto]) => ({ Ciudad: ciudad, "Producto estrella": producto }));
  if (filas.length === 0) {
    fila("Resultado", "Sin ventas registradas");
  } else {
    console.table(filas);
  }
}

function seccionComboRegalo() {
  const combo = comboRegaloOptimizado(CATALOGO, 87000);
  seccion(7, "Combo de regalo sugerido (tarjeta $87.000)");
  if (!combo) {
    fila("Sugerencia", "No hay combinación disponible");
  } else {
    fila("Producto 1", `${combo[0].producto} (${formatearMoneda(combo[0].precio)})`);
    fila("Producto 2", `${combo[1].producto} (${formatearMoneda(combo[1].precio)})`);
    fila("Total", formatearMoneda(combo[0].precio + combo[1].precio));
  }
}

function seccionClienteCupon() {
  const cliente = primerClienteUnico(ventas);
  seccion(8, "Cliente para cupón (primera compra única)");
  fila("Cliente", cliente ?? "Ninguno (todos recurrentes o sin ventas)");
}

function seccionMejorSemana() {
  seccion(9, "Mejor semana");
  if (ventas.length === VENTAS.length && etiquetaDatos.includes("datos reales")) {
    const mejor = mejorSemana(VENTAS_DIARIAS_SEPTIEMBRE, 7);
    if (mejor) {
      const diaInicio = mejor.inicio + 1; // 1-based
      fila("Fuente", "Totales diarios de septiembre (miles de pesos)");
      fila("Mejor semana (7 días)", `Días ${diaInicio}–${diaInicio + 6}`);
      fila("Total", `${formatearNumero(mejor.total)} (miles de pesos)`);
      fila("Índice inicio (0-based)", String(mejor.inicio));
    } else {
      fila("Resultado", "No disponible");
    }
  } else {
    const { fechas, totales } = totalesPorDia(ventas);
    if (fechas.length < 7) {
      fila("Resultado", "Menos de 7 días de datos para evaluar ventana");
      return;
    }
    const mejor = mejorSemana(totales, 7);
    if (!mejor) {
      fila("Resultado", "No disponible");
      return;
    }
    const inicio = fechas[mejor.inicio];
    const fin = fechas[Math.min(mejor.inicio + 6, fechas.length - 1)];
    fila("Fuente", "Totales diarios calculados sobre las ventas analizadas");
    fila("Mejor semana (7 días)", `${formatearFecha(inicio)} a ${formatearFecha(fin)}`);
    fila("Total", formatearMoneda(mejor.total));
    fila("Índice inicio (0-based)", String(mejor.inicio));
  }
}

function seccionResumenPorDia() {
  const fechas = fechasConVentas(ventas);
  seccion(10, "Resumen por día (día con ventas y día sin ventas)");

  if (fechas.length === 0) {
    fila("Resultado", "Sin ventas registradas");
    return;
  }

  const diaConVentas = fechas[0];
  const diaSinVentas = diaSiguiente(fechas[fechas.length - 1]);

  const conVentas = resumenDelDia(ventas, diaConVentas);
  const sinVentas = resumenDelDia(ventas, diaSinVentas);

  console.log(`  Día con ventas · ${formatearFecha(conVentas.fecha)}`);
  fila("    Ventas registradas", formatearNumero(conVentas.ventas));
  fila("    Unidades vendidas", formatearNumero(conVentas.unidades));
  fila("    Total vendido", formatearMoneda(conVentas.total));
  fila("    Ticket promedio", formatearMoneda(conVentas.ticketPromedio));
  fila(
    "    Venta mayor",
    conVentas.ventaMayor
      ? `${formatearMoneda(conVentas.ventaMayor.cantidad * conVentas.ventaMayor.precio)} · #${conVentas.ventaMayor.id} · ${conVentas.ventaMayor.producto}`
      : "Sin ventas registradas"
  );

  console.log("");
  console.log(`  Día sin ventas · ${formatearFecha(sinVentas.fecha)}`);
  fila("    Ventas registradas", formatearNumero(sinVentas.ventas));
  fila("    Unidades vendidas", formatearNumero(sinVentas.unidades));
  fila("    Total vendido", formatearMoneda(sinVentas.total));
  fila("    Ticket promedio", formatearMoneda(sinVentas.ticketPromedio));
  fila(
    "    Estado",
    sinVentas.ventas === 0
      ? "Sin ventas registradas para esta fecha (valores en cero, no es un error)"
      : "Con ventas registradas"
  );

  console.log("");
  console.table([
    {
      Fecha: formatearFecha(conVentas.fecha),
      Situación: "Con ventas",
      Ventas: formatearNumero(conVentas.ventas),
      Unidades: formatearNumero(conVentas.unidades),
      Total: formatearMoneda(conVentas.total),
      "Ticket promedio": formatearMoneda(conVentas.ticketPromedio),
    },
    {
      Fecha: formatearFecha(sinVentas.fecha),
      Situación: "Sin ventas",
      Ventas: formatearNumero(sinVentas.ventas),
      Unidades: formatearNumero(sinVentas.unidades),
      Total: formatearMoneda(sinVentas.total),
      "Ticket promedio": formatearMoneda(sinVentas.ticketPromedio),
    },
  ]);
}

encabezado("v1.0");
seccionResumenGeneral();
seccionVentasPorCiudad();
seccionUnidadesPorProducto();
seccionTopProductos();
seccionClientesRecurrentes();
seccionProductoEstrellaPorCiudad();
seccionComboRegalo();
seccionClienteCupon();
seccionMejorSemana();
seccionResumenPorDia();

const finTotal = process.hrtime.bigint();
const msTotal = Number(finTotal - inicioTotal) / 1e6;

console.log("");
console.log(LINEA);
console.log(`  Fin del reporte · Café Origen · v1.0 · Tiempo total: ${msTotal.toFixed(2)} ms`);
console.log(LINEA);
