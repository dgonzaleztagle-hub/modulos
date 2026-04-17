import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFiveWhysSummary,
  createFiveWhysData,
  hasRootCause,
  updateFiveWhysField,
} from "../.dist/modulos/ops/five-whys-core/src.js";

test("five-whys-core crea estructura base saneada", () => {
  const data = createFiveWhysData({ why1: "  Falta de orden  " });
  assert.equal(data.why1, "Falta de orden");
  assert.equal(data.root_cause, "");
});

test("five-whys-core actualiza campos y detecta causa raíz", () => {
  const updated = updateFiveWhysField(createFiveWhysData(), "root_cause", "  Ausencia de procedimiento ");
  assert.equal(hasRootCause(updated), true);
  assert.equal(updated.root_cause, "Ausencia de procedimiento");
});

test("five-whys-core resume respuestas e integridad", () => {
  const summary = buildFiveWhysSummary(
    createFiveWhysData({
      why1: "No había bloqueo",
      why2: "No existía checklist",
      root_cause: "Falla sistémica de control",
    }),
  );

  assert.equal(summary.answered.length, 2);
  assert.equal(summary.rootCause, "Falla sistémica de control");
  assert.equal(summary.isComplete, true);
});

