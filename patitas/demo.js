/**
 * Demostración final Motor Patitas v1.0.
 * Ejecutar desde `patitas/`: `node demo.js`
 */

const {
  catalogo,
  listarCatalogo,
  buscarServicio,
  rutaDeServicio,
  precioPaquete,
  buscarCategoria,
} = require("./src/dominio/catalogo");
const Recepcion = require("./src/dominio/Recepcion");
const RegistroClinico = require("./src/dominio/RegistroClinico");
const Editor = require("./src/dominio/Editor");

/**
 * @typedef {{hora: string, mascota: string, tipo: "Urgencia" | "General", motivo: string}} TurnoLlegada
 * @typedef {{mascota: string, tipo: "Urgencia" | "General", motivo: string, horaLlegada: string, horaAtencion: string, minutosEspera: number}} ResultadoAtencion
 */

/**
 * @param {string} hora
 * @returns {number}
 */
function horaAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}
/**
 * @param {number} minutos
 * @returns {string}
 */
function minutosAHora(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

console.log("#################################################################");
console.log("#               DEMOSTRACIÓN MOTOR PATITAS v1.0                 #");
console.log("#################################################################\n");

// 1. Catálogo de servicios con su jerarquía
console.log("=== 1. Catálogo de servicios (jerarquía) ===");
listarCatalogo(catalogo);
console.log(`\nTotal de categorías/servicios visibles: listado completo arriba.`);

// 2. Simulación de la mañana con urgencias
console.log("\n=== 2. Simulación de la mañana (urgencias primero) ===");
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

const recepcion = new Recepcion();
const registro = new RegistroClinico();
const editor = new Editor(registro);
/** @type {ResultadoAtencion[]} */
const resultados = [];
const ordenados = [...llegadas].sort((a, b) => horaAMinutos(a.hora) - horaAMinutos(b.hora));
let indiceLlegada = 0;
let consultorioLibreEn = ordenados.length > 0 ? horaAMinutos(ordenados[0].hora) : 0;

while (indiceLlegada < ordenados.length || recepcion.hayEsperando()) {
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
  while (indiceLlegada < ordenados.length && horaAMinutos(ordenados[indiceLlegada].hora) <= consultorioLibreEn) {
    recepcion.registrarLlegada(ordenados[indiceLlegada]);
    indiceLlegada += 1;
  }
  const siguiente = recepcion.llamarSiguiente();
  if (!siguiente) continue;
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

  // 3. Corrección con deshacer y rehacer (error simulado en la primera atención)
  const atencion = {
    fecha: "Sábado",
    motivo: resultado.motivo,
    veterinario: resultado.tipo === "Urgencia" ? "Dra. Ríos" : "Dr. Gómez",
    costo: resultado.tipo === "Urgencia" ? 120000 : 60000,
  };
  if (resultado.mascota === "Toby") {
    console.log("[Corrección] Error: se registra atención de Toby en Max por equivocación.");
    editor.agregar("Max", atencion);
    editor.deshacer();
    console.log("[Corrección] Deshacer aplicado; se registra correctamente en Toby y se demuestra rehacer:");
    editor.agregar("Max", { fecha: "Sábado", motivo: "Temporal", veterinario: "Dr. Gómez", costo: 0 });
    console.log("  Rehacer disponible tras nueva acción? (debe ser no tras acción nueva):", editor.rehacer() ? "sí" : "no");
    // limpiar temporal de Max para dejar historial correcto
    editor.deshacer();
  }
  editor.agregar(resultado.mascota, atencion);
  consultorioLibreEn = inicioAtencion + duracionAtencionComo20();
}

function duracionAtencionComo20() { return 20; }

console.log("\nOrden de atención y esperas:");
console.log("Mascota\tTipo\t\tLlegada\tAtención\tEspera");
for (const r of resultados) {
  console.log(`${r.mascota}\t${r.tipo}\t${r.tipo==="General"?"\t":""}${r.horaLlegada}\t${r.horaAtencion}\t\t${r.minutosEspera}`);
}

// 4. Historiales finales
console.log("\n=== 4. Historiales finales (mascotas atendidas) ===");
for (const mascota of [...new Set(resultados.map(r => r.mascota))]) {
  const h = registro.obtenerHistorial(mascota);
  if (!h) continue;
  console.log(`${mascota}: ${h.obtenerTamanio()} atención(es)`);
  h.recorrer((d) => console.log(`  - ${d.fecha} | ${d.motivo} | ${d.veterinario} | $${d.costo}`));
}

// 5. Búsqueda de servicio con ruta y precio de paquete
console.log("\n=== 5. Búsqueda de servicio, ruta y precio de paquete ===");
const servicioBuscado = "Gata";
const servicio = buscarServicio(catalogo, servicioBuscado);
const ruta = rutaDeServicio(catalogo, servicioBuscado);
const cirugias = buscarCategoria(catalogo, "Cirugías");
console.log(`Servicio buscado: "${servicioBuscado}"`);
console.log("Encontrado:", servicio);
console.log("Ruta:", ruta);
if (cirugias) {
  console.log(`Precio paquete "Cirugías" (total con 10% desc.): $${precioPaquete(cirugias)}`);
}
console.log("\nValidación sala vacía (seguridad):");
recepcion.llamarSiguienteSeguro();

console.log("\n=== Fin de la demostración v1.0 ===");
