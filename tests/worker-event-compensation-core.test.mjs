import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateDelayDiscount,
  calculateExtraHourValue,
  summarizeWorkerEvents,
} from "../.dist/modulos/ops/worker-event-compensation-core/src.js";

test("worker-event-compensation-core calcula hora extra y descuento por atraso", () => {
  assert.equal(calculateExtraHourValue(600000, 180, 1.5), 5000);
  assert.equal(Math.round(calculateDelayDiscount(600000, 180, 30)), 1667);
});

test("worker-event-compensation-core resume eventos con impacto", () => {
  const summary = summarizeWorkerEvents(
    [
      { eventType: "horas_extras", cantidad: 4, recargoHorasExtras: 1.5 },
      { eventType: "atraso", cantidad: 30 },
      { eventType: "anticipo", cantidad: 20000 },
    ],
    { sueldoBase: 600000, horasContrato: 180 },
  );

  const extraHours = summary.find((row) => row.eventType === "horas_extras");
  const delay = summary.find((row) => row.eventType === "atraso");

  assert.equal(Math.round(extraHours.totalImpact), 20000);
  assert.ok(delay.totalImpact < 0);
});
