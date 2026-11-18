/**
 * Pruebas de autocompletar por prefijo (búsqueda binaria de límite inferior).
 * Casos: prefijo frecuente, un solo resultado, sin resultados, cadena vacía.
 * Ejecutar: node src/probarAutocompletar.js
 */

const { mergeSort } = require("./ordenamiento");
const { porPrestamosDesc } = require("./comparadores");
const {
  normalizarTitulo,
  ordenarPorTitulo,
  primeraPosicionPrefijo,
  autocompletar,
} = require("./autocompletar");

/**
 * @typedef {{isbn:string,titulo:string,autor:string,anio:number,prestamos:number}} Libro
 */

// Dataset determinista con tildes/mayúsculas para probar normalización
/** @type {Libro[]} */
const muestra = [
  { isbn: "0000000000001", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", anio: 1967, prestamos: 412 },
  { isbn: "0000000000002", titulo: "La casa grande", autor: "Álvaro Cepeda Samudio", anio: 1962, prestamos: 55 },
  { isbn: "0000000000003", titulo: "La hojarasca", autor: "Gabriel García Márquez", anio: 1955, prestamos: 120 },
  { isbn: "0000000000004", titulo: "La vorágine", autor: "José Eustasio Rivera", anio: 1924, prestamos: 158 },
  { isbn: "0000000000005", titulo: "Lágrimas en la lluvia", autor: "Autor X", anio: 2011, prestamos: 30 },
  { isbn: "0000000000006", titulo: "El amor en los tiempos del cólera", autor: "Gabriel García Márquez", anio: 1985, prestamos: 300 },
  { isbn: "0000000000007", titulo: "Rayuela", autor: "Julio Cortázar", anio: 1963, prestamos: 210 },
  { isbn: "0000000000008", titulo: "Pedro Páramo", autor: "Juan Rulfo", anio: 1955, prestamos: 190 },
];

console.log("=== Ordenamiento del catálogo por título (sin mayúsculas ni tildes, Merge Sort) ===");
const ordenados = ordenarPorTitulo(muestra);
console.log("Títulos ordenados (normalizados):");
for (let i = 0; i < ordenados.length; i++) {
  console.log(`  [${i}] ${ordenados[i].titulo}  (norm: "${normalizarTitulo(ordenados[i].titulo)}")`);
}

function mostrarCaso(nombre, prefijo, max) {
  const res = autocompletar(ordenados, prefijo, max);
  console.log(`\n--- ${nombre} ---`);
  console.log(`Prefijo: "${prefijo}" (norm: "${normalizarTitulo(prefijo)}"), max: ${max}`);
  console.log(`primeraPosicionPrefijo: ${res.posicionInicial}, elementos revisados: ${res.revisados}`);
  console.log(`Sugerencias (${res.titulos.length}): ${res.titulos.length ? res.titulos.map((t) => `"${t}"`).join(", ") : "(ninguna)"}`);
  return res;
}

console.log("\n=== Pruebas de autocompletar ===");
// 1. Prefijo frecuente: "la" coincide con "La casa grande", "La hojarasca", "La vorágine", "Lágrimas..." (4 resultados, sin distinguir tildes)
const c1 = mostrarCaso("Caso 1: prefijo frecuente", "la", 10);
console.log(`Comportamiento: devuelve todos los títulos que empiezan por "la"/"lá" sin distinguir mayúsculas ni tildes (${c1.titulos.length} resultados).`);

// 2. Prefijo con un solo resultado
const c2 = mostrarCaso("Caso 2: prefijo con un solo resultado", "ray", 10);
console.log(`Comportamiento: un único título coincide (${c2.titulos.length} resultado).`);

// 3. Prefijo sin resultados
const c3 = mostrarCaso("Caso 3: prefijo sin resultados", "zzz", 10);
console.log(`Comportamiento: no hay títulos con ese prefijo; la búsqueda binaria ubica la posición pero el recorrido no agrega coincidencias (${c3.titulos.length} resultados).`);

// 4. Cadena vacía
const c4 = mostrarCaso("Caso 4: cadena vacía", "", 3);
console.log(`Comportamiento: prefijo vacío => todo título comienza con ""; se devuelven hasta max sugerencias desde el inicio (primeros ${c4.titulos.length}).`);

console.log("\n=== Casos borde documentados ===");
console.log("- Prefijo frecuente: lower bound encuentra la primera coincidencia y se avanza mientras startsWith sea verdadero (contiguos por estar ordenados); se limita a `max`.");
console.log("- Un solo resultado: se devuelve ese título y el siguiente no cumple startsWith, se detiene.");
console.log("- Sin resultados: primeraPosicionPrefijo retorna la posición de inserción; el primer revisado no inicia con el prefijo, se retorna lista vacía.");
console.log("- Cadena vacía: normaliza a \"\"; lower bound es 0 y cualquier título satisface startsWith(\"\"), por lo que devuelve los primeros `max` del catálogo ordenado.");
console.log("- Mayúsculas/tildes: se normaliza (NFD, sin diacríticos, minúsculas) tanto el prefijo como los títulos para comparar y para startsWith.");
console.log("- Complejidad: O(log n) para ubicar la primera posición con búsqueda binaria + O(k) para devolver k sugerencias (hasta max) => O(log n + k), sin recorrer el catálogo completo.");

console.log("\n=== Demostración: no recorre el catálogo completo ===");
console.log(`Tamaño catálogo: ${ordenados.length}. Ejemplo prefijo "ray": revisados=${c2.revisados} (solo coincidencias consecutivas tras la búsqueda binaria), no ${ordenados.length}.`);
