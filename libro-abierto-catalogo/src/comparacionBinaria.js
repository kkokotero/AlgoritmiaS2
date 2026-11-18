/**
 * Comparación búsqueda lineal vs binaria por ISBN, trazas y demostraciones.
 * Ejecutar: node src/comparacionBinaria.js
 */

const muestra = require("./muestra");
const { generarCatalogo } = require("./generador");
const {
  ordenarPorIsbn,
  buscarPorIsbn,
  buscarPorIsbnRecursivo,
  buscarPorIsbnConTraza,
} = require("./busquedaBinaria");

/**
 * Búsqueda lineal por ISBN (conteo de comparaciones).
 * @param {{isbn:string,titulo:string,autor:string,anio:number,prestamos:number}[]} libros
 * @param {string} isbn
 * @returns {{libro: any, comparaciones: number}}
 */
function buscarPorIsbnLineal(libros, isbn) {
  let comparaciones = 0;
  for (let i = 0; i < libros.length; i++) {
    comparaciones++;
    if (libros[i].isbn === isbn) {
      return { libro: libros[i], comparaciones };
    }
  }
  return { libro: null, comparaciones };
}

console.log("=== 1. Verificación: iterativa y recursiva devuelven lo mismo ===");
const catalogoPrueba = ordenarPorIsbn(generarCatalogo(1000));
let iguales = true;
for (let i = 0; i < catalogoPrueba.length; i++) {
  const isbn = catalogoPrueba[i].isbn;
  const it = buscarPorIsbn(catalogoPrueba, isbn);
  const rec = buscarPorIsbnRecursivo(catalogoPrueba, isbn, 0, catalogoPrueba.length - 1);
  if (it.comparaciones !== rec.comparaciones || it.libro.isbn !== rec.libro.isbn) {
    iguales = false;
    break;
  }
}
const itNo = buscarPorIsbn(catalogoPrueba, "0000000000000");
const recNo = buscarPorIsbnRecursivo(catalogoPrueba, "0000000000000", 0, catalogoPrueba.length - 1);
if (itNo.libro !== null || recNo.libro !== null || itNo.comparaciones !== recNo.comparaciones) {
  iguales = false;
}
console.log(`Existentes e inexistente coinciden: ${iguales ? "Sí" : "No"}`);

console.log("\n=== 2. Trazas en muestra ordenada por ISBN (8 libros) ===");
const muestraOrdenada = ordenarPorIsbn(muestra);
console.log("Orden por ISBN:");
for (let i = 0; i < muestraOrdenada.length; i++) {
  console.log(`  [${i}] ${muestraOrdenada[i].isbn} - ${muestraOrdenada[i].titulo}`);
}

const isbnExiste = "9789587047462"; // Delirio
const isbnNoExiste = "9789585000000";
console.log(`\nTraza búsqueda ISBN existente: ${isbnExiste}`);
const trazaExiste = buscarPorIsbnConTraza(muestraOrdenada, isbnExiste);
console.log("| Paso | inicio | fin | medio | ISBN en medio | Decisión |");
console.log("|---:|---:|---:|---:|---|---|");
for (const p of trazaExiste.pasos) {
  console.log(`| ${p.paso} | ${p.inicio} | ${p.fin} | ${p.medio} | ${p.isbnMedio} | ${p.decision} |`);
}
console.log(`Resultado: ${trazaExiste.libro ? trazaExiste.libro.titulo : "null"}, comparaciones: ${trazaExiste.comparaciones}`);

console.log(`\nTraza búsqueda ISBN inexistente: ${isbnNoExiste}`);
const trazaNo = buscarPorIsbnConTraza(muestraOrdenada, isbnNoExiste);
console.log("| Paso | inicio | fin | medio | ISBN en medio | Decisión |");
console.log("|---:|---:|---:|---:|---|---|");
for (const p of trazaNo.pasos) {
  console.log(`| ${p.paso} | ${p.inicio} | ${p.fin} | ${p.medio} | ${p.isbnMedio} | ${p.decision} |`);
}
console.log(`Resultado: ${trazaNo.libro ? trazaNo.libro.titulo : "null"}, comparaciones: ${trazaNo.comparaciones}`);

console.log("\n=== 3. Comparación lineal vs binaria (ISBN inexistente, peor caso lineal) ===");
console.log("Nota: para n=1.000.000 se genera y ordena el catálogo (puede tardar unos segundos).\n");
console.log("| Tamaño (n) | Lineal (comparaciones) | Binaria (comparaciones) | Máx teórico binaria ⌊log₂(n)⌋+1 | log₂(n) |");
console.log("|---:|---:|---:|---:|---:|");
const tamanos = [1000, 10000, 1000000];
const isbnInexistente = "0000000000000";
for (const n of tamanos) {
  const catalogo = generarCatalogo(n);
  const ordenado = ordenarPorIsbn(catalogo);
  const lineal = buscarPorIsbnLineal(ordenado, isbnInexistente).comparaciones; // peor caso: recorre todo
  const binaria = buscarPorIsbn(ordenado, isbnInexistente).comparaciones;
  const maxTeorico = Math.floor(Math.log2(n)) + 1;
  const log2n = Math.log2(n).toFixed(4);
  console.log(`| ${n} | ${lineal} | ${binaria} | ${maxTeorico} | ${log2n} |`);
}

console.log("\n=== 4. Búsqueda binaria en catálogo SIN ordenar (demostración) ===");
console.log("Se busca un ISBN que sí existe en la muestra original pero en posición que la binaria descarta por asumir orden.");
const isbnPresente = "9789584264879"; // Rosario Tijeras, índice 4 en muestra original
console.log(`ISBN buscado: ${isbnPresente} (Rosario Tijeras, presente en índice 4 de la muestra original)`);
console.log("Muestra original (sin ordenar por ISBN):");
for (let i = 0; i < muestra.length; i++) {
  console.log(`  [${i}] ${muestra[i].isbn} - ${muestra[i].titulo}`);
}
const trazaDesorden = buscarPorIsbnConTraza(muestra, isbnPresente);
console.log("\nPasos de búsqueda binaria sobre arreglo NO ordenado:");
console.log("| Paso | inicio | fin | medio | ISBN en medio | Decisión |");
console.log("|---:|---:|---:|---:|---|---|");
for (const p of trazaDesorden.pasos) {
  console.log(`| ${p.paso} | ${p.inicio} | ${p.fin} | ${p.medio} | ${p.isbnMedio} | ${p.decision} |`);
}
console.log(`Resultado: ${trazaDesorden.libro ? trazaDesorden.libro.titulo : "null"} (esperado: encontrar el libro). Comparaciones: ${trazaDesorden.comparaciones}`);
const linealDesorden = buscarPorIsbnLineal(muestra, isbnPresente);
console.log(`Búsqueda lineal en el mismo arreglo desordenado: ${linealDesorden.libro ? "encontrado" : "null"} en ${linealDesorden.comparaciones} comparaciones.`);
