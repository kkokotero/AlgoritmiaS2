/**
 * Generador de ventas sintéticas para pruebas de rendimiento y reportes.
 */

const PRODUCTOS = [
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Filtros de papel x100", precio: 18000 },
  { producto: "Taza de cerámica", precio: 35000 },
  { producto: "Origen Huila 1 kg", precio: 79000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 },
];

const CIUDADES = ["Medellín", "Bogotá", "Cali", "Pereira", "Barranquilla"];

/**
 * Genera un número pseudoaleatorio determinista simple (LCG) para reproducibilidad.
 * @param {number} semilla
 * @returns {() => number} Función que devuelve valores en [0,1).
 */
function crearRng(semilla) {
  let estado = semilla >>> 0;
  return () => {
    estado = (1664525 * estado + 1013904223) >>> 0;
    return estado / 0x100000000;
  };
}

/**
 * Formatea una fecha Date (UTC base) a YYYY-MM-DD sumando días.
 * @param {number} offsetDias
 * @returns {string}
 */
function fechaDesdeBase(offsetDias) {
  const base = new Date(Date.UTC(2026, 8, 1)); // 2026-09-01
  base.setUTCDate(base.getUTCDate() + offsetDias);
  return base.toISOString().slice(0, 10);
}

/**
 * Genera n ventas sintéticas realistas.
 * @param {number} n
 * @returns {import('./datos.js').Venta[]}
 */
function generarVentas(n) {
  const rng = crearRng(12345);
  /** @type {import('./datos.js').Venta[]} */
  const ventas = new Array(n);
  const clientesUnicos = Math.max(50, Math.floor(n / 3));

  for (let i = 0; i < n; i++) {
    const prod = PRODUCTOS[Math.floor(rng() * PRODUCTOS.length)];
    const ciudad = CIUDADES[Math.floor(rng() * CIUDADES.length)];
    const cliente = `C${String(1 + Math.floor(rng() * clientesUnicos)).padStart(5, "0")}`;
    const dia = Math.floor(rng() * 30); // 30 días
    const cantidad = 1 + Math.floor(rng() * 4);
    ventas[i] = {
      id: i + 1,
      fecha: fechaDesdeBase(dia),
      cliente,
      producto: prod.producto,
      ciudad,
      cantidad,
      precio: prod.precio,
    };
  }

  return ventas;
}

/**
 * Calcula totales por día (clave YYYY-MM-DD) en orden de fecha.
 * @param {import('./datos.js').Venta[]} ventas
 * @returns {{ fechas: string[], totales: number[] }}
 */
function totalesPorDia(ventas) {
  /** @type {Map<string, number>} */
  const mapa = new Map();
  for (const v of ventas) {
    mapa.set(v.fecha, (mapa.get(v.fecha) || 0) + v.cantidad * v.precio);
  }
  const fechas = [...mapa.keys()].sort();
  const totales = fechas.map((f) => mapa.get(f) || 0);
  return { fechas, totales };
}

module.exports = {
  PRODUCTOS,
  CIUDADES,
  generarVentas,
  totalesPorDia,
};
