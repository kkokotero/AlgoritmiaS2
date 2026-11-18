/**
 * Plan de mantenimiento: modelado de dependencias como grafo dirigido,
 * detección de ciclos (DFS con 3 estados) y orden de ejecución (topológico).
 * Comando: node src/planificador.js --mantenimiento
 */

const GrafoDirigido = require("./GrafoDirigido");

/**
 * @typedef {{id: string, descripcion: string, requiere: string[]}} Tarea
 */

/** @type {Tarea[]} Plan original entregado por mantenimiento */
const PLAN_ORIGINAL = [
  { id: "T1", descripcion: "Cerrar el tramo Caribe–Universidad", requiere: [] },
  { id: "T2", descripcion: "Cambiar rieles del tramo", requiere: ["T1"] },
  { id: "T3", descripcion: "Actualizar el software de señalización", requiere: ["T5"] },
  { id: "T4", descripcion: "Probar la señalización", requiere: ["T2", "T3"] },
  { id: "T5", descripcion: "Instalar sensores nuevos", requiere: ["T4"] },
  { id: "T6", descripcion: "Reabrir el tramo", requiere: ["T4"] },
];

/**
 * Plan corregido (propuesta razonable):
 * - T5 (Instalar sensores nuevos) pasa a requerir T2 en lugar de T4, porque los sensores
 *   físicos se instalan después de cambiar rieles y antes de actualizar/probar el software.
 * - T3 (Actualizar el software de señalización) sigue requiriendo T5 (software tras sensores).
 * Así se elimina la dependencia circular T3<-T5<-T4<-T3 y se respeta la lógica de obra.
 * @type {Tarea[]}
 */
const PLAN_CORREGIDO = [
  { id: "T1", descripcion: "Cerrar el tramo Caribe–Universidad", requiere: [] },
  { id: "T2", descripcion: "Cambiar rieles del tramo", requiere: ["T1"] },
  { id: "T3", descripcion: "Actualizar el software de señalización", requiere: ["T5"] },
  { id: "T4", descripcion: "Probar la señalización", requiere: ["T2", "T3"] },
  { id: "T5", descripcion: "Instalar sensores nuevos", requiere: ["T2"] }, // corregido: antes T4
  { id: "T6", descripcion: "Reabrir el tramo", requiere: ["T4"] },
];

/**
 * Construye un grafo dirigido de dependencias a partir de un plan.
 * Arista: requerida -> tarea (la requerida debe terminar antes de la tarea que la necesita).
 * @param {Tarea[]} plan
 * @returns {GrafoDirigido}
 */
function construirGrafoDependencias(plan) {
  const g = new GrafoDirigido();
  for (const tarea of plan) {
    g.agregarVertice(tarea.id);
  }
  for (const tarea of plan) {
    for (const req of tarea.requiere) {
      g.agregarArista(req, tarea.id);
    }
  }
  return g;
}

/**
 * Obtiene la descripción de una tarea por id.
 * @param {Tarea[]} plan
 * @param {string} id
 * @returns {string}
 */
function descripcionTarea(plan, id) {
  const t = plan.find((x) => x.id === id);
  return t ? t.descripcion : id;
}

/**
 * Imprime el diagnóstico de un plan y, si no hay ciclos, su orden de ejecución.
 * @param {string} titulo
 * @param {Tarea[]} plan
 * @returns {{hayCiclo: boolean, ciclo: (string|number)[]|null, orden: (string|number)[]|null}}
 */
function diagnosticarPlan(titulo, plan) {
  console.log(`\n== ${titulo} ==`);
  console.log("Tareas y dependencias (requiere terminar antes):");
  for (const t of plan) {
    const reqs = t.requiere.length ? t.requiere.join(", ") : "—";
    console.log(`  - ${t.id}: ${t.descripcion} | requiere: ${reqs}`);
  }

  const grafo = construirGrafoDependencias(plan);
  console.log(`\nGrafo dirigido: V=${grafo.numeroVertices()}, E=${grafo.numeroAristas()} (arista: requerida -> dependiente).`);
  console.log("Complejidad DFS (detección de ciclos / orden topológico): O(V + E) tiempo, O(V) espacio.");

  const { hayCiclo, ciclo } = grafo.tieneCiclo();
  if (hayCiclo) {
    console.log("\nDIAGNÓSTICO: Se detectó un ciclo de dependencias. No es posible determinar un inicio válido.");
    if (ciclo) {
      console.log(`Ciclo detectado: ${ciclo.join(" → ")}`);
      console.log("Tareas involucradas en el ciclo:");
      const unicos = ciclo.slice(0, -1);
      for (const id of unicos) {
        console.log(`  * ${id} - ${descripcionTarea(plan, String(id))}`);
      }
    }
    return { hayCiclo: true, ciclo, orden: null };
  }

  console.log("\nDIAGNÓSTICO: No se detectaron ciclos. El plan es ejecutable.");
  const orden = grafo.ordenDeEjecucion();
  console.log("Orden de ejecución válido (ordenamiento topológico, respeta todas las dependencias):");
  for (let i = 0; i < orden.length; i++) {
    const id = String(orden[i]);
    console.log(`  ${i + 1}. ${id} - ${descripcionTarea(plan, id)}`);
  }
  return { hayCiclo: false, ciclo: null, orden };
}

/**
 * Ejecuta el comando de mantenimiento: diagnostica plan original y plan corregido.
 */
function ejecutarMantenimiento() {
  console.log("=== Mantenimiento Ruta Paisa: diagnóstico de dependencias ===");

  const resOriginal = diagnosticarPlan("Plan original", PLAN_ORIGINAL);

  console.log("\n-- Propuesta de corrección --");
  console.log("Cambio razonable: T5 (Instalar sensores nuevos) pasa a requerir T2 en lugar de T4.");
  console.log("Justificación: los sensores se instalan sobre la vía después de cambiar rieles (T2) y");
  console.log("antes de actualizar/probar el software de señalización (T3, T4). Esto rompe el ciclo");
  console.log("T3 → T4 → T5 → T3, ya que T5 deja de depender de T4 y pasa a depender de T2.");

  const resCorregido = diagnosticarPlan("Plan corregido", PLAN_CORREGIDO);

  console.log("\n== Resumen ==");
  if (resOriginal.hayCiclo && resOriginal.ciclo) {
    console.log(`Plan original: CON CICLO (${resOriginal.ciclo.join(" → ")}).`);
  }
  if (!resCorregido.hayCiclo && resCorregido.orden) {
    console.log(`Plan corregido: SIN CICLOS. Orden válido: ${resCorregido.orden.join(" → ")}.`);
  }

  return { resOriginal, resCorregido };
}

module.exports = {
  PLAN_ORIGINAL,
  PLAN_CORREGIDO,
  construirGrafoDependencias,
  diagnosticarPlan,
  ejecutarMantenimiento,
};

if (require.main === module) {
  ejecutarMantenimiento();
}
