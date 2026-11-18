/**
 * Exploración del catálogo generado para Libro Abierto.
 * Ejecutar: node src/explorar.js
 */

const { generarCatalogo } = require("./generador");

const catalogo = generarCatalogo(10000);

// Verificación de unicidad de ISBN
const isbns = new Set(catalogo.map((libro) => libro.isbn));
const unicos = isbns.size === catalogo.length;

console.log("=== Exploración del catálogo Libro Abierto ===\n");
console.log(`Total de libros generados: ${catalogo.length}`);
console.log(`ISBN únicos: ${isbns.size}`);
console.log(`¿Todos los ISBN son únicos? ${unicos ? "Sí" : "No"}\n`);

console.log("Primeros 5 libros generados:");
catalogo.slice(0, 5).forEach((libro, i) => {
  console.log(
    `${i + 1}. [${libro.isbn}] "${libro.titulo}" - ${libro.autor} (${libro.anio}) | préstamos: ${libro.prestamos}`
  );
});

let anioMasAntiguo = catalogo[0].anio;
let anioMasReciente = catalogo[0].anio;
let totalPrestamos = 0;

for (const libro of catalogo) {
  if (libro.anio < anioMasAntiguo) anioMasAntiguo = libro.anio;
  if (libro.anio > anioMasReciente) anioMasReciente = libro.anio;
  totalPrestamos += libro.prestamos;
}

console.log("\nEstadísticas:");
console.log(`Año más antiguo: ${anioMasAntiguo}`);
console.log(`Año más reciente: ${anioMasReciente}`);
console.log(`Total de préstamos: ${totalPrestamos}`);
