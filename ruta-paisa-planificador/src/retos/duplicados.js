/**
 * Reto: detección de validaciones duplicadas en torniquetes (Ruta Paisa).
 * Un registro es duplicado si tiene la misma tarjeta, misma estación y mismo minuto.
 *
 * Enfoque (protocolo):
 * - Fuerza bruta: comparar cada validación con las demás buscando misma tarjeta/estación/hora -> O(n^2).
 * - Optimización: usar un Set de claves compuestas "tarjeta|estacion|hora" ya vistas.
 *   Primera vez que se ve la clave -> válida; veces siguientes -> duplicado (cobro doble).
 *   Complejidad: O(n) tiempo (un recorrido, operaciones de Set O(1) promedio) y O(n) espacio.
 */

/**
 * @typedef {Object} Validacion
 * @property {string} tarjeta - Identificador de la tarjeta.
 * @property {number|string} estacion - Código de la estación.
 * @property {string} hora - Hora/minuto de la validación (ej. "07:02").
 * @property {number} valor - Valor cobrado.
 */

/**
 * Construye la clave compuesta de una validación.
 * @param {Validacion} v
 * @returns {string}
 */
function claveValidacion(v) {
  return `${v.tarjeta}|${v.estacion}|${v.hora}`;
}

/**
 * Devuelve los registros duplicados (misma tarjeta, misma estación, mismo minuto).
 * Se consideran duplicadas las apariciones posteriores a la primera.
 * @param {Validacion[]} validaciones - Lista de validaciones.
 * @returns {Validacion[]} Registros duplicados.
 */
function validacionesDuplicadas(validaciones) {
  /** @type {Set<string>} */
  const vistas = new Set();
  /** @type {Validacion[]} */
  const duplicados = [];

  for (const v of validaciones) {
    const clave = claveValidacion(v);
    if (vistas.has(clave)) {
      duplicados.push(v);
    } else {
      vistas.add(clave);
    }
  }

  return duplicados;
}

/**
 * Calcula el monto cobrado de más (suma de valores de registros duplicados).
 * @param {Validacion[]} validaciones - Lista de validaciones.
 * @returns {number} Monto a corregir.
 */
function montoACorregir(validaciones) {
  const duplicados = validacionesDuplicadas(validaciones);
  let total = 0;
  for (const v of duplicados) {
    total += v.valor;
  }
  return total;
}

module.exports = { validacionesDuplicadas, montoACorregir, claveValidacion };

if (require.main === module) {
  /** @type {Validacion[]} */
  const ejemplo = [
    { tarjeta: "T-101", estacion: 50, hora: "07:02", valor: 3000 },
    { tarjeta: "T-205", estacion: 30, hora: "07:02", valor: 3000 },
    { tarjeta: "T-101", estacion: 50, hora: "07:02", valor: 3000 }, // duplicado
    { tarjeta: "T-330", estacion: 56, hora: "07:05", valor: 3000 },
    { tarjeta: "T-205", estacion: 30, hora: "07:09", valor: 3000 }, // no duplicado (hora distinta)
    { tarjeta: "T-412", estacion: 10, hora: "07:10", valor: 3000 },
    { tarjeta: "T-330", estacion: 56, hora: "07:05", valor: 3000 }, // duplicado
    { tarjeta: "T-101", estacion: 60, hora: "07:31", valor: 3000 },
  ];

  const duplicados = validacionesDuplicadas(ejemplo);
  const monto = montoACorregir(ejemplo);

  console.log("=== Detección de validaciones duplicadas ===");
  console.log(`Registros duplicados encontrados: ${duplicados.length}`);
  for (const d of duplicados) {
    console.log(`- ${d.tarjeta} | estación ${d.estacion} | ${d.hora} | $${d.valor}`);
  }
  console.log(`Monto a corregir: $${monto}`);

  // Recorrido en voz alta (traza con datos de ejemplo):
  // T-101|50|07:02 -> nueva (vistas={T-101|50|07:02})
  // T-205|30|07:02 -> nueva
  // T-101|50|07:02 -> ya vista => duplicado
  // T-330|56|07:05 -> nueva
  // T-205|30|07:09 -> nueva (hora distinta a 07:02, no duplicado)
  // T-412|10|07:10 -> nueva
  // T-330|56|07:05 -> ya vista => duplicado
  // T-101|60|07:31 -> nueva (estación distinta)
  // Resultado: 2 duplicados, monto $6000. Complejidad O(n) tiempo, O(n) espacio.
}
