/**
 * @typedef {{nombre: string, precio: number}} Servicio
 * @typedef {{nombre: string, servicios: Servicio[], subcategorias: Categoria[]}} Categoria
 */

/** @type {Categoria} */
const catalogo = {
  nombre: "Patitas",
  servicios: [],
  subcategorias: [
    {
      nombre: "Consultas",
      servicios: [
        { nombre: "Consulta general", precio: 60000 },
        { nombre: "Consulta a domicilio", precio: 90000 },
      ],
      subcategorias: [
        {
          nombre: "Especializada",
          servicios: [
            { nombre: "Dermatología", precio: 110000 },
            { nombre: "Cardiología", precio: 130000 },
          ],
          subcategorias: [],
        },
      ],
    },
    {
      nombre: "Cirugías",
      servicios: [],
      subcategorias: [
        {
          nombre: "Esterilización",
          servicios: [
            { nombre: "Gata", precio: 280000 },
            { nombre: "Perra", precio: 350000 },
          ],
          subcategorias: [],
        },
        {
          nombre: "Limpieza dental",
          servicios: [{ nombre: "Con anestesia", precio: 150000 }],
          subcategorias: [],
        },
      ],
    },
    {
      nombre: "Vacunas",
      servicios: [
        { nombre: "Rabia", precio: 45000 },
        { nombre: "Triple felina", precio: 85000 },
      ],
      subcategorias: [],
    },
  ],
};

/**
 * Cuenta todos los servicios de la categoría y de sus subcategorías a cualquier profundidad.
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @returns {number} Total de servicios.
 */
function contarServicios(categoria) {
  let total = categoria.servicios.length;
  for (const subcategoria of categoria.subcategorias) {
    total += contarServicios(subcategoria);
  }
  return total;
}

/**
 * Imprime el catálogo completo con sangría según el nivel de profundidad.
 * @param {Categoria} categoria - Categoría a listar.
 * @param {number} [nivel=0] - Nivel de profundidad (0 = raíz).
 * @returns {void}
 */
function listarCatalogo(categoria, nivel = 0) {
  const sangria = "  ".repeat(nivel);
  console.log(`${sangria}- ${categoria.nombre}`);
  const sangriaServicio = "  ".repeat(nivel + 1);
  for (const servicio of categoria.servicios) {
    console.log(`${sangriaServicio}• ${servicio.nombre}: $${servicio.precio}`);
  }
  for (const subcategoria of categoria.subcategorias) {
    listarCatalogo(subcategoria, nivel + 1);
  }
}

/**
 * Devuelve cuántos niveles tiene el catálogo desde la categoría dada.
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @returns {number} Número de niveles.
 */
function profundidad(categoria) {
  if (categoria.subcategorias.length === 0) {
    return 1;
  }
  let maxProfundidad = 0;
  for (const subcategoria of categoria.subcategorias) {
    const p = profundidad(subcategoria);
    if (p > maxProfundidad) {
      maxProfundidad = p;
    }
  }
  return 1 + maxProfundidad;
}

/**
 * Busca una categoría por nombre (recursivo).
 * @param {Categoria} categoria - Categoría raíz.
 * @param {string} nombre - Nombre a buscar.
 * @returns {Categoria | null} Categoría encontrada o null.
 */
function buscarCategoria(categoria, nombre) {
  if (categoria.nombre === nombre) {
    return categoria;
  }
  for (const subcategoria of categoria.subcategorias) {
    const encontrada = buscarCategoria(subcategoria, nombre);
    if (encontrada) {
      return encontrada;
    }
  }
  return null;
}

/**
 * Ejecución de verificación: resultados originales, traza sobre Cirugías y actualización.
 * @returns {void}
 */
function ejecutarVerificacion() {
  console.log("=== Catálogo original ===");
  console.log(`contarServicios(catalogo): ${contarServicios(catalogo)}`);
  console.log(`profundidad(catalogo): ${profundidad(catalogo)}`);
  console.log("\nListado:");
  listarCatalogo(catalogo);

  const cirugias = buscarCategoria(catalogo, "Cirugías");
  if (cirugias) {
    console.log(`\ncontarServicios(Cirugías): ${contarServicios(cirugias)}`);
  }

  console.log("\n=== Tras agregar 'Oftalmología' en 'Especializada' ===");
  const especializada = buscarCategoria(catalogo, "Especializada");
  if (especializada) {
    especializada.subcategorias.push({
      nombre: "Oftalmología",
      servicios: [{ nombre: "Consulta oftalmológica", precio: 120000 }],
      subcategorias: [],
    });
  }
  console.log(`contarServicios(catalogo): ${contarServicios(catalogo)}`);
  console.log(`profundidad(catalogo): ${profundidad(catalogo)}`);
  console.log("\nListado actualizado:");
  listarCatalogo(catalogo);
}

// @ts-ignore: CommonJS en Node.js
if (require.main === module) {
  ejecutarVerificacion();
}

module.exports = {
  catalogo,
  contarServicios,
  listarCatalogo,
  profundidad,
  buscarCategoria,
};
