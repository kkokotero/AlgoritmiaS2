/**
 * Comparación de estrategias Top-K: ordenamiento completo vs selección parcial.
 * Ejecutar: node src/medirTopK.js
 */

const { generarCatalogo } = require("./generador");
const { topPrestados, topPrestadosSeleccion } = require("./topk");

console.log("=== Top-K: comparación de estrategias (n = 10.000 libros) ===\n");
const n = 10000;
const catalogo = generarCatalogo(n);

const ks = [10, 5000];
console.log("| k | Estrategia | Comparaciones | Tiempo (ms) | Top-1 (préstamos) | ¿Top-k válido desc? |");
console.log("|---:|---|---:|---:|---:|:---:|");

for (const k of ks) {
  // Merge Sort completo + slice
  const t0 = process.hrtime.bigint();
  const rMerge = topPrestados(catalogo, k);
  const t1 = process.hrtime.bigint();
  const msMerge = Number(t1 - t0) / 1e6;
  let validoMerge = true;
  for (let i = 1; i < rMerge.resultado.length; i++) {
    if (rMerge.resultado[i - 1].prestamos < rMerge.resultado[i].prestamos) validoMerge = false;
  }
  const top1Merge = rMerge.resultado.length > 0 ? rMerge.resultado[0].prestamos : "-";
  console.log(`| ${k} | Merge Sort completo + top k (O(n log n)) | ${rMerge.comparaciones} | ${msMerge.toFixed(3)} | ${top1Merge} | ${validoMerge ? "Sí" : "No"} |`);

  // Selección parcial k pasadas
  const t2 = process.hrtime.bigint();
  const rSel = topPrestadosSeleccion(catalogo, k);
  const t3 = process.hrtime.bigint();
  const msSel = Number(t3 - t2) / 1e6;
  let validoSel = true;
  for (let i = 1; i < rSel.resultado.length; i++) {
    if (rSel.resultado[i - 1].prestamos < rSel.resultado[i].prestamos) validoSel = false;
  }
  const top1Sel = rSel.resultado.length > 0 ? rSel.resultado[0].prestamos : "-";
  console.log(`| ${k} | Selección parcial k pasadas (O(k·n)) | ${rSel.comparaciones} | ${msSel.toFixed(3)} | ${top1Sel} | ${validoSel ? "Sí" : "No"} |`);
}

// Mostrar top 10 de ejemplo
const ejemplo = topPrestados(catalogo, 10);
console.log("\n=== Ejemplo: topPrestados(libros, 10) — 10 libros más prestados ===");
console.log("| # | Título | Autor | Préstamos |");
console.log("|---:|---|---|---:|");
for (let i = 0; i < ejemplo.resultado.length; i++) {
  const l = ejemplo.resultado[i];
  console.log(`| ${i + 1} | ${l.titulo} | ${l.autor} | ${l.prestamos} |`);
}

const nlogn = n * Math.log2(n);
console.log("\n=== Análisis de complejidad ===");
console.log(`n = ${n}, n·log₂(n) ≈ ${nlogn.toFixed(2)}`);
console.log("- topPrestados (ordenar copia con Merge Sort y tomar k): O(n log n) en tiempo y O(n) memoria adicional. El costo es casi independiente de k (solo cambia el corte final).");
console.log("- topPrestadosSeleccion (k pasadas buscando el máximo restante): O(k·n) comparaciones y O(1) memoria adicional (además de la copia).");
console.log("  k=10  => k·n = 100.000 comparaciones (menor que n·log₂(n) ≈ 132.877): conviene para k muy pequeño.");
console.log("  k=5000 => k·n = 50.000.000 comparaciones (mucho mayor que n·log₂(n)): conviene ordenar completo (Merge Sort).");
console.log("Conclusión: selección parcial conviene cuando k << log₂(n) (k muy pequeño frente a n); si k es grande o del orden de n, conviene O(n log n).");
