#!/usr/bin/env node
const planificador = require("./dominio/planificador");

if (require.main === module) {
  planificador.main();
}

module.exports = planificador;
