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
 * Busca un servicio por nombre y lo devuelve, o null si no existe.
 * Detiene la búsqueda en cuanto lo encuentra (retorno temprano).
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @param {string} nombre - Nombre del servicio.
 * @returns {Servicio | null} Servicio encontrado o null.
 */
function buscarServicio(categoria, nombre) {
  for (const servicio of categoria.servicios) {
    if (servicio.nombre === nombre) {
      return servicio;
    }
  }
  for (const subcategoria of categoria.subcategorias) {
    const encontrado = buscarServicio(subcategoria, nombre);
    if (encontrado) {
      return encontrado;
    }
  }
  return null;
}

/**
 * Devuelve la ruta completa de categorías hasta el servicio, o null si no existe.
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @param {string} nombre - Nombre del servicio.
 * @returns {string[] | null} Ruta completa o null.
 */
function rutaDeServicio(categoria, nombre) {
  for (const servicio of categoria.servicios) {
    if (servicio.nombre === nombre) {
      return [categoria.nombre, servicio.nombre];
    }
  }
  for (const subcategoria of categoria.subcategorias) {
    const rutaSub = rutaDeServicio(subcategoria, nombre);
    if (rutaSub) {
      return [categoria.nombre, ...rutaSub];
    }
  }
  return null;
}

/**
 * Suma recursivamente todos los precios de los servicios de una categoría (auxiliar).
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @returns {number} Suma total sin descuento.
 */
function sumarServicios(categoria) {
  let total = 0;
  for (const servicio of categoria.servicios) {
    total += servicio.precio;
  }
  for (const subcategoria of categoria.subcategorias) {
    total += sumarServicios(subcategoria);
  }
  return total;
}

/**
 * Calcula el precio del paquete completo de una categoría con 10% de descuento.
 * El descuento se aplica una sola vez al total.
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @returns {number} Precio con descuento.
 */
function precioPaquete(categoria) {
  const total = sumarServicios(categoria);
  return total * 0.9;
}

/**
 * Devuelve los servicios cuyo precio está entre min y max (inclusive), en cualquier nivel.
 * @param {Categoria} categoria - Categoría raíz o subcategoría.
 * @param {number} min - Precio mínimo.
 * @param {number} max - Precio máximo.
 * @returns {Servicio[]} Servicios en el rango.
 */
function serviciosEnRango(categoria, min, max) {
  /** @type {Servicio[]} */
  const resultado = [];
  for (const servicio of categoria.servicios) {
    if (servicio.precio >= min && servicio.precio <= max) {
      resultado.push(servicio);
    }
  }
  for (const subcategoria of categoria.subcategorias) {
    const parciales = serviciosEnRango(subcategoria, min, max);
    for (const servicio of parciales) {
      resultado.push(servicio);
    }
  }
  return resultado;
}

/**
 * Ejecución de verificación: resultados originales, traza sobre Cirugías y actualización.
 * @returns {void}
 */
function ejecutarVerificacion() {
  console.log("=== Catálogo original (Día 3 - parte 1) ===");
  console.log(`contarServicios(catalogo): ${contarServicios(catalogo)}`);
  console.log(`profundidad(catalogo): ${profundidad(catalogo)}`);
  console.log("\nListado:");
  listarCatalogo(catalogo);

  const cirugias = buscarCategoria(catalogo, "Cirugías");
  if (cirugias) {
    console.log(`\ncontarServicios(Cirugías): ${contarServicios(cirugias)}`);
  }

  console.log("\n=== Tras agregar 'Oftalmología' en 'Especializada' (demo sin cambio de código) ===");
  const especializada = buscarCategoria(catalogo, "Especializada");
  /** @type {Categoria | null} */
  let agregada = null;
  if (especializada) {
    agregada = {
      nombre: "Oftalmología",
      servicios: [{ nombre: "Consulta oftalmológica", precio: 120000 }],
      subcategorias: [],
    };
    especializada.subcategorias.push(agregada);
  }
  console.log(`contarServicios(catalogo): ${contarServicios(catalogo)}`);
  console.log(`profundidad(catalogo): ${profundidad(catalogo)}`);
  console.log("\nListado actualizado:");
  listarCatalogo(catalogo);

  // Restaurar catálogo original para las pruebas siguientes
  if (especializada && agregada) {
    const idx = especializada.subcategorias.indexOf(agregada);
    if (idx !== -1) {
      especializada.subcategorias.splice(idx, 1);
    }
  }

  console.log("\n=== Búsquedas, rutas y paquetes (Día 3 - parte 2) ===");
  // buscarServicio: primer nivel (Vacunas), más profundo, inexistente
  console.log("buscarServicio('Rabia'):", buscarServicio(catalogo, "Rabia"));
  console.log("buscarServicio('Gata'):", buscarServicio(catalogo, "Gata"));
  console.log("buscarServicio('Peluquería'):", buscarServicio(catalogo, "Peluquería"));

  // rutaDeServicio
  console.log("rutaDeServicio('Rabia'):", rutaDeServicio(catalogo, "Rabia"));
  console.log("rutaDeServicio('Gata'):", rutaDeServicio(catalogo, "Gata"));
  console.log("rutaDeServicio('Peluquería'):", rutaDeServicio(catalogo, "Peluquería"));

  // precioPaquete
  if (cirugias) {
    const totalCirugias = sumarServicios(cirugias);
    console.log(`precioPaquete('Cirugías') total sin descuento: ${totalCirugias}`);
    console.log(`precioPaquete('Cirugías'): ${precioPaquete(cirugias)}`);
  }
  const vacunas = buscarCategoria(catalogo, "Vacunas");
  if (vacunas) {
    console.log(`precioPaquete('Vacunas'): ${precioPaquete(vacunas)}`);
  }

  // serviciosEnRango
  const rango = serviciosEnRango(catalogo, 80000, 150000);
  console.log(`serviciosEnRango(80000,150000) [${rango.length}]:`, rango.map((s) => `${s.nombre}($${s.precio})`));
  console.log("serviciosEnRango en 'Vacunas' (80000,150000):", vacunas ? serviciosEnRango(vacunas, 80000, 150000) : []);
  console.log("serviciosEnRango inexistente (1000,2000):", serviciosEnRango(catalogo, 1000, 2000));
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
  buscarServicio,
  rutaDeServicio,
  sumarServicios,
  precioPaquete,
  serviciosEnRango,
};
