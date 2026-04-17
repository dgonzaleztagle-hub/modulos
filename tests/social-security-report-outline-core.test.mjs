import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSocialSecurityPortfolioOutline,
  buildSocialSecurityReportOutline,
} from "../.dist/modulos/pdf/social-security-report-outline-core/src.js";

test("social-security-report-outline-core arma resumen por trabajador", () => {
  const outline = buildSocialSecurityReportOutline({
    clientRazonSocial: "Cliente SpA",
    clientRut: "76.123.456-7",
    periodoMes: 4,
    periodoAnio: 2026,
    estado: "pendiente",
    workers: [
      { nombre: "Ana", rut: "11.111.111-1", pagado: true, fechaPago: "2026-04-10", monto: 10000 },
      { nombre: "Luis", rut: "22.222.222-2", pagado: false, fechaPago: null, monto: 12000 },
    ],
  });

  assert.equal(outline.summary.totalWorkers, 2);
  assert.equal(outline.summary.pendingWorkers, 1);
  assert.equal(outline.workerRows[0].estado, "pagado");
});

test("social-security-report-outline-core arma consolidado multiempresa", () => {
  const outline = buildSocialSecurityPortfolioOutline(
    [
      {
        clientRazonSocial: "Empresa A",
        clientRut: "76.111.111-1",
        estado: "pagada",
        totalWorkers: 5,
        paidWorkers: 5,
      },
      {
        clientRazonSocial: "Empresa B",
        clientRut: "76.222.222-2",
        estado: "pendiente",
        totalWorkers: 4,
        paidWorkers: 1,
      },
    ],
    { mes: 4, anio: 2026 },
  );

  assert.equal(outline.summary.totalCompanies, 2);
  assert.equal(outline.summary.paidCompanies, 1);
  assert.equal(outline.summary.totalWorkers, 9);
});
