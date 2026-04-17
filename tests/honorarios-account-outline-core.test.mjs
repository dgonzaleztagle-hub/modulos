import test from "node:test";
import assert from "node:assert/strict";

import { buildHonorariosAccountOutline } from "../.dist/modulos/pdf/honorarios-account-outline-core/src.js";

test("honorarios-account-outline-core resume período y cobranza", () => {
  const outline = buildHonorariosAccountOutline(
    {
      clientRazonSocial: "Cliente SpA",
      clientRut: "76.123.456-7",
      periodoMes: 4,
      periodoAnio: 2026,
      montoPeriodo: 250000,
      saldoPendienteAnterior: 50000,
      estado: "pendiente",
      fechaEmision: "2026-04-16",
    },
    { appName: "Mi Oficina", contactEmail: "cobranza@demo.cl" },
  );

  assert.equal(outline.periodLabel, "Abril 2026");
  assert.equal(outline.totals.totalConSaldo, 300000);
  assert.equal(outline.statusLabel, "PENDIENTE DE PAGO");
});
