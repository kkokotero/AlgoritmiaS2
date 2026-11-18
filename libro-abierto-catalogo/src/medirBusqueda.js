/**
 * Mediciones de comparaciones para búsqueda lineal por título.
 * Ejecutar: node src/medirBusqueda.js
 */

const { generarCatalogo } = require("./generador");
const { buscarPorTitulo } = require("./busqueda");
const muestra = require("./muestra");

/**
 * Mide comparaciones en cuatro casos para un catálogo dado.
 * Se hacen únicos los títulos para medir por posición (primero, medio, último).
 * @param {{isbn:string,titulo:string,autor:string,anio:number,prestamos:number}[]} catalogo
 * @returns {{primero:number, ultimo:number, medio:number, inexistente:number}}
 */
function medirCasos(catalogo) {
  const primero = catalogo[0].titulo;
  const ultimo = catalogo[catalogo.length - 1].titulo;
  const medio = catalogo[Math.floor(catalogo.length / 2)].titulo;
  const inexistente = "Título inexistente XYZ123";

  return {
    primero: buscarPorTitulo(catalogo, primero).comparaciones,
    ultimo: buscarPorTitulo(catalogo, ultimo).comparaciones,
    medio: buscarPorTitulo(catalogo, medio).comparaciones,
    inexistente: buscarPorTitulo(catalogo, inexistente).comparaciones,
  };
}

const tamanos = [100, 1000, 10000];
console.log("=== Tabla de comparaciones: buscarPorTitulo ===\n");
console.log("| Tamaño (n) | Primer libro (mejor caso) | Libro del medio (caso promedio) | Último libro (peor caso) | No existe (peor caso) |");
console.log("|---:|---:|---:|---:|---:|");

for (const n of tamanos) {
  const catalogo = generarCatalogo(n);
  // Garantizar títulos únicos para medir por posición
  for (let i = 0; i < catalogo.length; i++) {
    catalogo[i].titulo = catalogo[i].titulo + " __" + i;
  }
  const r = medirCasos(catalogo);
  console.log(`| ${n} | ${r.primero} | ${r.medio} | ${r.ultimo} | ${r.inexistente} |`);
}

console.log("\nRelación con complejidad:");
console.log("- Mejor caso O(1): el elemento está al inicio -> 1 comparación.");
console.log("- Peor caso O(n): el elemento está al final o no existe -> n comparaciones.");
console.log("- Caso promedio O(n): posición intermedia -> ~n/2 comparaciones (aquí n/2 + 1).");

// Traza Delirio en muestra
console.log("\n=== Traza: búsqueda de \"Delirio\" en muestra (8 libros) ===");
const traza = buscarPorTitulo(muestra, "Delirio");
for (let i = 0; i < muestra.length; i++) {
  const coincide = muestra[i].titulo === "Delirio";
  console.log(`${i + 1}. ${muestra[i].titulo} -> ${coincide ? "coincide (encontrado)" : "no coincide"}`);
  if (coincide) break;
}
console.log(`Comparaciones totales: ${traza.comparaciones}`);

// Demostración autor y palabra
const porAutor = require("./busqueda").buscarPorAutor(muestra, "Laura Restrepo");
console.log(`\nEjemplo buscarPorAutor("Laura Restrepo"): ${porAutor.libros.length} resultado(s), ${porAutor.comparaciones} comparaciones.`);
const porPalabra = require("./busqueda").buscarPorPalabra(muestra, "de");
console.log(`Ejemplo buscarPorPalabra("de"): ${porPalabra.libros.length} resultado(s), ${porPalabra.comparaciones} comparaciones.`);
