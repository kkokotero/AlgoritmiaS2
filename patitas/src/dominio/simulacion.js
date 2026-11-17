const Recepcion = require("./Recepcion");
const RegistroClinico = require("./RegistroClinico");
const Editor = require("./Editor");

/**
 * @typedef {{hora: string, mascota: string, tipo: "Urgencia" | "General", motivo: string}} TurnoLlegada
 * @typedef {{mascota: string, tipo: "Urgencia" | "General", motivo: string, horaLlegada: string, horaAtencion: string, minutosEspera: number}} ResultadoAtencion
 * @typedef {{fecha: string, motivo: string, veterinario: string, costo: number}} Atencion
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
 * Obtiene un veterinario de ejemplo según tipo de atención.
 * @param {"Urgencia" | "General"} tipo - Tipo de turno.
 * @returns {string} Nombre del veterinario.
 */
function veterinarioPorTipo(tipo) {
  return tipo === "Urgencia" ? "Dra. Ríos" : "Dr. Gómez";
}

/**
 * Crea el dato de atención clínica para el historial.
 * @param {ResultadoAtencion} resultado - Resultado de la atención.
 * @returns {Atencion} Atención a registrar.
 */
function crearAtencion(resultado) {
  return {
    fecha: "Sábado (mañana)",
    motivo: resultado.motivo,
    veterinario: veterinarioPorTipo(resultado.tipo),
    costo: resultado.tipo === "Urgencia" ? 120000 : 60000,
  };
}

/**
 * Simula la atención de la mañana y registra cada atención terminada en el historial vía Editor.
 * Incluye simulación de error humano corregido con deshacer.
 * @param {TurnoLlegada[]} turnos - Llegadas del día.
 * @param {number} duracionAtencion - Duración de cada atención en minutos.
 * @returns {{resultados: ResultadoAtencion[], editor: Editor}}
 */
function simular(turnos, duracionAtencion) {
  const recepcion = new Recepcion();
  const registro = new RegistroClinico();
  const editor = new Editor(registro);
  /** @type {ResultadoAtencion[]} */
  const resultados = [];
  const ordenados = [...turnos].sort((a, b) => horaAMinutos(a.hora) - horaAMinutos(b.hora));

  let indiceLlegada = 0;
  let consultorioLibreEn = ordenados.length > 0 ? horaAMinutos(ordenados[0].hora) : 0;

  while (indiceLlegada < ordenados.length || recepcion.hayEsperando()) {
    // Registrar llegadas ocurridas hasta que el consultorio esté libre (o próxima llegada si idle)
    if (!recepcion.hayEsperando() && indiceLlegada < ordenados.length) {
      consultorioLibreEn = Math.max(consultorioLibreEn, horaAMinutos(ordenados[indiceLlegada].hora));
    }
    while (indiceLlegada < ordenados.length && horaAMinutos(ordenados[indiceLlegada].hora) <= consultorioLibreEn) {
      if (!recepcion.hayEsperando() && consultorioLibreEn < horaAMinutos(ordenados[indiceLlegada].hora)) {
        consultorioLibreEn = horaAMinutos(ordenados[indiceLlegada].hora);
      }
      recepcion.registrarLlegada(ordenados[indiceLlegada]);
      indiceLlegada += 1;
    }

    if (!recepcion.hayEsperando()) {
      if (indiceLlegada < ordenados.length) {
        consultorioLibreEn = horaAMinutos(ordenados[indiceLlegada].hora);
        continue;
      }
      break;
    }

    // Registrar llegadas que ocurrieron hasta el momento de atender
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

    /** @type {ResultadoAtencion} */
    const resultado = {
      mascota: siguiente.mascota,
      tipo: siguiente.tipo,
      motivo: siguiente.motivo,
      horaLlegada: siguiente.hora,
      horaAtencion: minutosAHora(inicioAtencion),
      minutosEspera: espera,
    };
    resultados.push(resultado);

    const atencion = crearAtencion(resultado);

    // Simulación de error de recepcionista: registra la primera atención en mascota equivocada
    if (resultado.mascota === "Toby") {
      console.log("[Error recepcionista] Se registró la atención de Toby en el historial de Max por equivocación.");
      editor.agregar("Max", atencion);
      console.log(`  Historial Max (erróneo): ${JSON.stringify(editor.registro.obtenerHistorial("Max")?.aArreglo().map(a => a.motivo))}`);
      console.log("[Corrección] Detectado el error: se deshace la última acción.");
      editor.deshacer();
      console.log(`  Historial Max tras deshacer: ${JSON.stringify(editor.registro.obtenerHistorial("Max")?.aArreglo().map(a => a.motivo) || [])}`);
      console.log("[Corrección] Se registra la atención correcta en el historial de Toby.\n");
    }

    editor.agregar(resultado.mascota, atencion);

    consultorioLibreEn = inicioAtencion + duracionAtencion;
  }

  // Validación de seguridad: intentar llamar con sala vacía
  console.log("\n[Validación] Intento de llamar al siguiente con sala vacía:");
  recepcion.llamarSiguienteSeguro();

  return { resultados, editor };
}

/**
 * Imprime el reporte de atención (orden, horas y esperas).
 * @param {ResultadoAtencion[]} resultados - Resultados de la simulación.
 * @returns {void}
 */
function imprimirReporte(resultados) {
  console.log("\n=== Reporte de atención — Patitas v0.2 (sábado) ===\n");
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

/**
 * Imprime los historiales actualizados de las mascotas atendidas.
 * @param {Editor} editor - Editor con el registro clínico.
 * @param {ResultadoAtencion[]} resultados - Resultados para saber qué mascotas fueron atendidas.
 * @returns {void}
 */
function imprimirHistoriales(editor, resultados) {
  const mascotas = [...new Set(resultados.map((r) => r.mascota))];
  console.log("\n=== Historiales actualizados (mascotas atendidas) ===\n");
  for (const mascota of mascotas) {
    const historial = editor.registro.obtenerHistorial(mascota);
    if (!historial) continue;
    console.log(`Mascota: ${mascota}`);
    historial.recorrer((d) => {
      console.log(`  - ${d.fecha} | ${d.motivo} | ${d.veterinario} | $${d.costo}`);
    });
    console.log(`  Atenciones: ${historial.obtenerTamanio()}\n`);
  }
}

const { resultados, editor } = simular(llegadas, 20);
imprimirReporte(resultados);
imprimirHistoriales(editor, resultados);
