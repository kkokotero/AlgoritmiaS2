/**
 * Experimento de estabilidad y comparadores compuestos.
 * Ejecutar: node src/medirEstabilidad.js
 */

const { bubbleSort, selectionSort, insertionSort } = require("./ordenamiento");
const {
  porAutorYTitulo,
  porAutor,
  porTitulo,
  porAnio,
  porPrestamosDesc,
  invertir,
} = require("./comparadores");

/** @type {{autor:string,titulo:string,anio:number,prestamos:number}[]} */
const tabla = [
  { autor: "Laura Restrepo", titulo: "Delirio", anio: 2004, prestamos: 201 },
  { autor: "Mario Mendoza", titulo: "Cobro de sangre", anio: 2004, prestamos: 120 },
  { autor: "Laura Restrepo", titulo: "Dulce compañía", anio: 1995, prestamos: 180 },
  { autor: "Mario Mendoza", titulo: "Buda Blues", anio: 2009, prestamos: 95 },
  { autor: "Laura Restrepo", titulo: "La novia oscura", anio: 1999, prestamos: 150 },
];

/**
 * @param {{autor:string,titulo:string,anio:number}[]} arr
 * @returns {string}
 */
function fmtTabla(arr) {
  return arr.map((l) => `${l.autor} - ${l.titulo} (${l.anio})`).join("\n");
}

/**
 * @param {{autor:string,titulo:string,anio:number}[]} arr
 * @returns {string}
 */
function fmtLinea(arr) {
  return arr.map((l) => `${l.autor.split(" ")[0]}:${l.titulo}`).join(" | ");
}

const algoritmos = [
  { nombre: "Bubble Sort", fn: bubbleSort },
  { nombre: "Selection Sort", fn: selectionSort },
  { nombre: "Insertion Sort", fn: insertionSort },
];

console.log("=== Tabla inicial ===");
console.log(fmtTabla(tabla));

console.log("\n=== 1. Ordenar con porAutorYTitulo (comparador compuesto) ===");
let referencia = null;
for (const alg of algoritmos) {
  const res = alg.fn(tabla, porAutorYTitulo);
  console.log(`\n${alg.nombre}:`);
  console.log(fmtTabla(res.arreglo));
  if (!referencia) {
    referencia = fmtTabla(res.arreglo);
  } else {
    console.log(`¿Igual al resultado de referencia? ${fmtTabla(res.arreglo) === referencia ? "Sí" : "No"}`);
  }
}

console.log("\n=== 2. Método del bibliotecario: primero por título, luego solo por autor ===");
for (const alg of algoritmos) {
  console.log(`\n--- ${alg.nombre} ---`);
  const paso1 = alg.fn(tabla, porTitulo);
  console.log("Después de ordenar por título (paso 1):");
  console.log(fmtTabla(paso1.arreglo));

  const paso2 = alg.fn(paso1.arreglo, porAutor, { traza: true });
  console.log("\nTraza del paso 2 (ordenar solo por autor) - arreglo tras cada pasada:");
  for (let i = 0; i < paso2.traza.length; i++) {
    console.log(`  Pasada ${i + 1}: ${fmtLinea(paso2.traza[i])}`);
  }
  console.log("\nResultado final:");
  console.log(fmtTabla(paso2.arreglo));
  const correcto = fmtTabla(paso2.arreglo) === referencia;
  console.log(`¿Conserva orden por título dentro de cada autor (estable en paso 2)? ${correcto ? "Sí (estable)" : "No (inestable)"}`);
}

console.log("\n=== 3. porPrestamosDesc (más a menos prestados) ===");
const porPrestamos = bubbleSort(tabla, porPrestamosDesc);
console.log(fmtTabla(porPrestamos.arreglo.map((l) => ({ ...l }))));
// mostrar con prestamos
for (const l of porPrestamos.arreglo) {
  console.log(`  ${l.titulo} - ${l.prestamos} préstamos`);
}

console.log("\n=== 4. invertir(comparar): invertir(porAnio) => más reciente a más antiguo ===");
const porAnioDesc = bubbleSort(tabla, invertir(porAnio));
for (const l of porAnioDesc.arreglo) {
  console.log(`  ${l.titulo} - ${l.anio}`);
}
