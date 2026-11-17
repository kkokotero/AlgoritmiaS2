const Recepcion = require("./Recepcion");

/**
 * @typedef {{hora: string, mascota: string, tipo: "Urgencia" | "General", motivo: string}} TurnoLlegada
 * @typedef {{mascota: string, tipo: "Urgencia" | "General", horaLlegada: string, horaAtencion: string, minutosEspera: number}} ResultadoAtencion
 */

/**
 * Convierte una hora "H:MM" a minutos desde medianoche.
 * @param {string} hora - Hora en formato H:MM.
 * @returns {number} Minutos desde medianoche.
 */
function horaAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Convierte minutos desde medianoche a formato "H:MM".
 * @param {number} minutos - Minutos desde medianoche.
 * @returns {string} Hora en formato H:MM.
 */
function minutosAHora(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** @type {TurnoLlegada[]} */
const llegadas = [
  { hora: "8:00", mascota: "Toby", tipo: "General", motivo: "Control de vacunas" },
  { hora: "8:05", mascota: "Max", tipo: "General", motivo: "Revisión de piel" },
  { hora: "8:10", mascota: "Luna", tipo: "Urgencia", motivo: "Intoxicación" },
  { hora: "8:20", mascota: "Simón", tipo: "General", motivo: "Corte de uñas" },
  { hora: "8:25", mascota: "Kira", tipo: "Urgencia", motivo: "Herida en pata" },
  { hora: "8:40", mascota: "Nala", tipo: "General", motivo: "Desparasitación" },
  { hora: "9:00", mascota: "Rocky", tipo: "Urgencia", motivo: "Dificultad para respirar" },
];

/**
 * Simula la atención de la mañana con un solo consultorio (20 min por atención).
 * @param {TurnoLlegada[]} turnos - Llegadas del día.
 * @param {number} duracionAtencion - Duración de cada atención en minutos.
 * @returns {ResultadoAtencion[]} Resultados en orden de atención.
 */
function simular(turnos, duracionAtencion) {
  const recepcion = new Recepcion();
  /** @type {ResultadoAtencion[]} */
  const resultados = [];
  const ordenados = [...turnos].sort((a, b) => horaAMinutos(a.hora) - horaAMinutos(b.hora));

  let indiceLlegada = 0;
  let tiempoActual = ordenados.length > 0 ? horaAMinutos(ordenados[0].hora) : 0;
  let consultorioLibreEn = tiempoActual;

  while (indiceLlegada < ordenados.length || recepcion.hayEsperando()) {
    // Registrar todas las llegadas que ya ocurrieron hasta que el consultorio esté libre o hasta ahora
    const limiteRegistro = recepcion.hayEsperando() ? consultorioLibreEn : (indiceLlegada < ordenados.length ? horaAMinutos(ordenados[indiceLlegada].hora) : consultorioLibreEn);
    while (indiceLlegada < ordenados.length && horaAMinutos(ordenados[indiceLlegada].hora) <= limiteRegistro) {
      // si no hay nadie esperando y consultorio libre, podemos saltar al tiempo de llegada
      if (!recepcion.hayEsperando() && consultorioLibreEn <= horaAMinutos(ordenados[indiceLlegada].hora)) {
        consultorioLibreEn = horaAMinutos(ordenados[indiceLlegada].hora);
      }
      recepcion.registrarLlegada(ordenados[indiceLlegada]);
      indiceLlegada += 1;
      // actualizar límite si cambió el estado
    }

    // Si aún no hay nadie (p.ej. hueco) avanzar a próxima llegada
    if (!recepcion.hayEsperando()) {
      if (indiceLlegada < ordenados.length) {
        consultorioLibreEn = horaAMinutos(ordenados[indiceLlegada].hora);
        continue;
      }
      break;
    }

    // Asegurar que registramos llegadas ocurridas hasta el momento de atender
    while (indiceLlegada < ordenados.length && horaAMinutos(ordenados[indiceLlegada].hora) <= consultorioLibreEn) {
      recepcion.registrarLlegada(ordenados[indiceLlegada]);
      indiceLlegada += 1;
    }

    const siguiente = recepcion.llamarSiguiente();
    if (!siguiente) {
      continue;
    }

    const llegadaMin = horaAMinutos(siguiente.hora);
    const inicioAtencion = Math.max(consultorioLibreEn, llegadaMin);
    const espera = inicioAtencion - llegadaMin;

    resultados.push({
      mascota: siguiente.mascota,
      tipo: siguiente.tipo,
      horaLlegada: siguiente.hora,
      horaAtencion: minutosAHora(inicioAtencion),
      minutosEspera: espera,
    });

    consultorioLibreEn = inicioAtencion + duracionAtencion;
    tiempoActual = consultorioLibreEn;
  }

  return resultados;
}

/**
 * Imprime el reporte de la simulación y promedios.
 * @param {ResultadoAtencion[]} resultados - Resultados de la simulación.
 * @returns {void}
 */
function imprimirReporte(resultados) {
  console.log("=== Simulación de atención — Patitas (sábado) ===\n");
  console.log("Orden de atención:");
  console.log("Mascota\tTipo\t\tLlegada\tAtención\tEspera (min)");
  for (const r of resultados) {
    const tipoPad = r.tipo === "Urgencia" ? "Urgencia" : "General\t";
    console.log(`${r.mascota}\t${tipoPad}\t${r.horaLlegada}\t${r.horaAtencion}\t\t${r.minutosEspera}`);
  }

  let sumaUrg = 0;
  let cantUrg = 0;
  let sumaGen = 0;
  let cantGen = 0;
  for (const r of resultados) {
    if (r.tipo === "Urgencia") {
      sumaUrg += r.minutosEspera;
      cantUrg += 1;
    } else {
      sumaGen += r.minutosEspera;
      cantGen += 1;
    }
  }

  const promUrg = cantUrg > 0 ? sumaUrg / cantUrg : 0;
  const promGen = cantGen > 0 ? sumaGen / cantGen : 0;

  console.log("\nPromedios de espera:");
  console.log(`Urgencias: ${promUrg.toFixed(2)} minutos (${sumaUrg}/${cantUrg})`);
  console.log(`Generales: ${promGen.toFixed(2)} minutos (${sumaGen}/${cantGen})`);
}

const resultados = simular(llegadas, 20);
imprimirReporte(resultados);
