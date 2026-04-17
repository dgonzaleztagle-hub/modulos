import test from "node:test";
import assert from "node:assert/strict";

import {
  buildProjectClient,
  buildProjectPayment,
  computeProjectTotalRevenue,
  countActiveProjectClients,
} from "../.dist/modulos/ops/project-accounting-core/src.js";

test("project-accounting-core calcula ingresos y clientes activos", () => {
  assert.equal(
    computeProjectTotalRevenue([
      { amount: 1000 },
      { amount: 2500 },
    ]),
    3500,
  );
  assert.equal(
    countActiveProjectClients([
      { status: "active" },
      { status: "inactive" },
      { status: "active" },
    ]),
    2,
  );
});

test("project-accounting-core arma cliente y pago con cuota", () => {
  assert.equal(buildProjectClient({ id: "1", name: "CloudLab" }).status, "active");
  assert.deepEqual(
    buildProjectPayment({
      id: "pay-1",
      clientId: "1",
      amount: 99000,
      description: "Implementacion sitio",
      type: "implementation",
      installmentCurrent: 1,
      installmentTotal: 3,
    }).installment,
    { current: 1, total: 3 },
  );
});

