/**
 * Reto: demanda en hora pico y estaciones más usadas (Ruta Paisa).
 * - "minutos consecutivos" -> ventana deslizante de tamaño fijo.
 * - "más usadas" -> conteo de frecuencias (Map) + ordenamiento de entradas.
 */

const { construirGrafoRed } = require("../red");

/**
 * Devuelve el minuto de inicio (formato 6:mm) y el total de la ventana de k minutos
 * con más validaciones, recorriendo el arreglo una sola vez (ventana deslizante).
 * @param {number[]} porMinuto - Validaciones por minuto desde 6:00 (índice 0 = 6:00).
 * @param {number} k - Tamaño de la ventana en minutos.
 * @returns {{inicio: string, total: number, indiceInicio: number}} Inicio en formato 6:mm y total.
 */
function horaPico(porMinuto, k) {
  if (!Array.isArray(porMinuto) || porMinuto.length === 0 || k <= 0) {
    return { inicio: "6:00", total: 0, indiceInicio: 0 };
  }
  const n = porMinuto.length;
  const ventana = Math.min(k, n);

  // Suma inicial de la primera ventana [0, k)
  let sumaVentana = 0;
  for (let i = 0; i < ventana; i++) {
    sumaVentana += porMinuto[i];
  }

  let maxSuma = sumaVentana;
  let maxInicio = 0;

  // Ventana deslizante: se desplaza una posición por paso (sale izquierda, entra derecha)
  // Cada elemento se suma una vez al entrar y se resta una vez al salir -> un recorrido O(n).
  for (let i = ventana; i < n; i++) {
    sumaVentana = sumaVentana - porMinuto[i - ventana] + porMinuto[i];
    if (sumaVentana > maxSuma) {
      maxSuma = sumaVentana;
      maxInicio = i - ventana + 1;
    }
  }

  return {
    inicio: formatoHora(maxInicio),
    total: maxSuma,
    indiceInicio: maxInicio,
  };
}

/**
 * Convierte un índice de minuto (0 = 6:00) a formato "6:mm".
 * @param {number} indiceMinuto
 * @returns {string}
 */
function formatoHora(indiceMinuto) {
  const mm = String(indiceMinuto).padStart(2, "0");
  return `6:${mm}`;
}

/**
 * Genera un registro de validaciones con estaciones al azar de la red.
 * @param {number} cantidad - Número de validaciones a generar.
 * @param {number[]} estaciones - Códigos de estaciones de la red.
 * @returns {{estacion: number}[]} Registro de validaciones.
 */
function generarValidaciones(cantidad, estaciones) {
  /** @type {{estacion: number}[]} */
  const validaciones = [];
  for (let i = 0; i < cantidad; i++) {
    const idx = Math.floor(Math.random() * estaciones.length);
    validaciones.push({ estacion: estaciones[idx] });
  }
  return validaciones;
}

/**
 * Devuelve las k estaciones más usadas con sus conteos.
 * Usa un Map de conteo de frecuencias y ordena las entradas por conteo descendente.
 * Complejidad: O(n + u log u) tiempo, O(u) espacio,
 * donde n = número de validaciones y u = número de estaciones distintas.
 * @param {{estacion: number}[]} validaciones - Registro de validaciones.
 * @param {number} k - Cantidad de estaciones a devolver.
 * @returns {{estacion: number, conteo: number}[]}
 */
function estacionesMasUsadas(validaciones, k) {
  /** @type {Map<number, number>} */
  const conteo = new Map();

  // Conteo de frecuencias: O(n)
  for (const v of validaciones) {
    const actual = conteo.get(v.estacion) || 0;
    conteo.set(v.estacion, actual + 1);
  }

  // Ordenamiento de las u entradas por conteo descendente: O(u log u)
  const entradas = Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]);

  // Tomar las k primeras: O(k)
  return entradas.slice(0, k).map(([estacion, total]) => ({ estacion, conteo: total }));
}

module.exports = { horaPico, formatoHora, generarValidaciones, estacionesMasUsadas };

if (require.main === module) {
  const porMinuto = [
    120, 135, 150, 180, 210, 260, 310, 340, 330, 300,
    280, 250, 240, 260, 290, 320, 350, 360, 310, 270,
  ];

  console.log("=== Reto demanda: hora pico y estaciones más usadas ===\n");

  // 1) Ventana deslizante: hora pico
  console.log("-- Hora pico (ventana deslizante, k=5) --");
  const pico = horaPico(porMinuto, 5);
  console.log(`Ventana con más validaciones: inicia a las ${pico.inicio}, total ${pico.total} validaciones (índice inicio ${pico.indiceInicio}).`);
  console.log("Complejidad horaPico: O(n) tiempo, O(1) espacio adicional (la ventana se actualiza en un solo recorrido).\n");

  // 2) Estaciones más usadas sobre 50.000 validaciones
  const grafo = construirGrafoRed();
  const estacionesRed = Array.from(grafo.adyacencia.keys());
  const registro = generarValidaciones(50000, estacionesRed);
  const top3 = estacionesMasUsadas(registro, 3);

  console.log("-- Estaciones más usadas (50.000 validaciones, top 3) --");
  for (let i = 0; i < top3.length; i++) {
    console.log(`${i + 1}. Estación ${top3[i].estacion}: ${top3[i].conteo} validaciones`);
  }
  console.log("\nComplejidad estacionesMasUsadas: O(n + u log u) tiempo y O(u) espacio (n validaciones, u estaciones distintas).");
  console.log("Alternativa si solo se necesitan las 3 primeras (sin ordenar todas):");
  console.log("- Mantener las 3 mejores en una pasada sobre el Map de conteos: O(n + u) tiempo, O(u) espacio.");
  console.log("- O usar un min-heap de tamaño k: O(n + u log k) tiempo, O(u) espacio (para k=3 equivale a O(n + u)).");
}
