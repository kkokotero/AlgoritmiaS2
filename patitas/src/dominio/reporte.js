/**
 * Script de reporte clínico Patitas v0.1.
 * Carga datos, recorre historiales y muestra totales y última vacunación.
 */

const RegistroClinico = require("./RegistroClinico");

/**
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
 */

/**
 * Carga los datos digitalizados en el registro.
 * @returns {RegistroClinico} Registro con los historiales cargados.
 */
function cargarDatos() {
  const registro = new RegistroClinico();

  /** @type {[string, Atencion][]} */
  const datos = [
    ["Lola (gata)", { fecha: "02/02", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 }],
    ["Lola (gata)", { fecha: "15/03", motivo: "Control de peso", veterinario: "Dr. Gómez", costo: 40000 }],
    ["Lola (gata)", { fecha: "20/05", motivo: "Limpieza dental", veterinario: "Dra. Ríos", costo: 150000 }],
    ["Toby (perro)", { fecha: "10/01", motivo: "Consulta por cojera", veterinario: "Dr. Gómez", costo: 60000 }],
    ["Toby (perro)", { fecha: "12/01", motivo: "Radiografía de pata", veterinario: "Dr. Gómez", costo: 120000 }],
    ["Toby (perro)", { fecha: "05/04", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 }],
    ["Mía (gata)", { fecha: "18/02", motivo: "Esterilización", veterinario: "Dra. Ríos", costo: 280000 }],
    ["Mía (gata)", { fecha: "25/02", motivo: "Control posquirúrgico", veterinario: "Dra. Ríos", costo: 0 }],
  ];

  for (const [mascota, atencion] of datos) {
    registro.registrarAtencion(mascota, atencion);
  }

  return registro;
}

/**
 * Determina si una atención corresponde a una vacunación.
 * @param {Atencion} dato - Atención a evaluar.
 * @returns {boolean} `true` si el motivo indica vacunación.
 */
function esVacunacion(dato) {
  return /vacun/i.test(dato.motivo);
}

/**
 * Genera e imprime el reporte de historiales.
 * @param {RegistroClinico} registro - Registro clínico con los historiales.
 * @returns {void}
 */
function generarReporte(registro) {
  console.log("=== REPORTE CLÍNICO — PATITAS v0.1 ===\n");

  for (const mascota of registro.mascotas()) {
    const historial = registro.obtenerHistorial(mascota);
    if (!historial) continue;

    console.log(`Mascota: ${mascota}`);
    console.log("Historial (orden cronológico):");

    let costoTotal = 0;
    historial.recorrer((dato) => {
      console.log(`  - ${dato.fecha} | ${dato.motivo} | ${dato.veterinario} | $${dato.costo}`);
      costoTotal += dato.costo;
    });

    console.log(`Número de atenciones: ${historial.obtenerTamanio()}`);
    console.log(`Costo total: $${costoTotal}`);

    const ultimaVacunacion = historial.buscar(esVacunacion);
    if (ultimaVacunacion) {
      console.log(
        `Última vacunación: ${ultimaVacunacion.fecha} | ${ultimaVacunacion.motivo} | ${ultimaVacunacion.veterinario} | $${ultimaVacunacion.costo}`
      );
    } else {
      console.log("Última vacunación: sin registro");
    }

    console.log("");
  }
}

const registro = cargarDatos();
generarReporte(registro);
