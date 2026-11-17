/**
 * Verificación y medición de clientes recurrentes (original vs Set vs Map).
 * Ejecutar: node src/clientesRecurrentes.js
 */

const { VENTAS } = require("./datos.js");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  comprasPorCliente,
} = require("./analitica.js");

function normalizarResultado(valor) {
  if (valor instanceof Set) return [...valor].sort();
  return [...valor].sort();
}

function iguales(a, b) {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function generarVentas(n, clientesUnicos = 2000) {
  const ventas = [];
  for (let i = 0; i < n; i++) {
    ventas.push({
      id: i + 1,
      fecha: "2026-09-01",
      cliente: `C${i % clientesUnicos}`,
      producto: "Producto",
      ciudad: "Bogotá",
      cantidad: 1,
      precio: 1000,
    });
  }
  return ventas;
}

function medir(fn, ventas, etiqueta) {
  const inicio = process.hrtime.bigint();
  const resultado = fn(ventas);
  const fin = process.hrtime.bigint();
  const ms = Number(fin - inicio) / 1e6;
  return { ms, resultado, etiqueta };
}

function verificarConjunto(nombre, ventas) {
  const a = normalizarResultado(clientesRecurrentes(ventas));
  const b = normalizarResultado(clientesRecurrentesSet(ventas));
  const c = normalizarResultado(comprasPorCliente(ventas));
  const ok = iguales(a, b) && iguales(b, c);
  console.log(`${nombre}: ${ok ? "OK" : "DIFERENTE"}`);
  if (!ok) {
    console.log("original:", a);
    console.log("set:", b);
    console.log("map:", c);
  }
  return ok;
}

console.log("=== Verificación ===");
let ok = true;
ok = verificarConjunto("Datos Día 1 (VENTAS)", VENTAS) && ok;
const ventas5k = generarVentas(5000);
ok = verificarConjunto("5.000 ventas generadas", ventas5k) && ok;

console.log("\n=== Mediciones ===");
const tamanos = [1000, 10000, 100000];
const filas = [];

for (const n of tamanos) {
  const ventas = n === 5000 ? ventas5k : generarVentas(n);
  const fila = { n };

  if (n <= 10000) {
    const mOrig = medir(clientesRecurrentes, ventas, "original");
    fila.original = mOrig.ms;
  } else {
    fila.original = null; // no razonable
  }

  const mSet = medir(clientesRecurrentesSet, ventas, "set");
  const mMap = medir(comprasPorCliente, ventas, "map");
  fila.set = mSet.ms;
  fila.map = mMap.ms;

  const r1 = n <= 10000 ? normalizarResultado(medir(clientesRecurrentes, ventas).resultado) : normalizarResultado(mSet.resultado);
  const r2 = normalizarResultado(mSet.resultado);
  const r3 = normalizarResultado(mMap.resultado);
  if (!iguales(r2, r3) || (n <= 10000 && !iguales(r1, r2))) {
    console.error(`Resultados distintos en n=${n}`);
    ok = false;
  }

  filas.push(fila);
}

function fmt(ms) {
  if (ms == null) return "omitida (no razonable)";
  return ms < 1000 ? `${ms.toFixed(3)} ms` : `${(ms / 1000).toFixed(3)} s`;
}

console.log("\n| Ventas | Original (fuerza bruta) | Set | Map |");
console.log("|-------:|------------------------:|----:|----:|");
for (const f of filas) {
  console.log(`| ${f.n} | ${fmt(f.original)} | ${fmt(f.set)} | ${fmt(f.map)} |`);
}

console.log(`\nRESULTADO: ${ok ? "OK" : "FALLA"}`);
process.exitCode = ok ? 0 : 1;
