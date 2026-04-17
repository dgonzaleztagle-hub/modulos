import test from "node:test";
import assert from "node:assert/strict";
import {
  fromAccidentMeasure,
  fromInspectionMeasure,
  mergePendingMeasures,
  summarizeCorrectiveMeasures,
} from "../.dist/modulos/ops/corrective-measure-tracker-core/src.js";

test("corrective-measure-tracker-core normaliza accidente e inspección", () => {
  assert.equal(fromAccidentMeasure({ id: "a1", description: "Capacitar", deadline: "2026-04-20" }).source, "accident");
  assert.equal(fromInspectionMeasure({ id: "i1", action: "Señalizar", deadline: "2026-04-21" }).description, "Señalizar");
});

test("corrective-measure-tracker-core mezcla y ordena pendientes", () => {
  const items = mergePendingMeasures({
    accidents: [
      { id: "a1", description: "Capacitar", deadline: "2026-04-21", status: "pendiente" },
      { id: "a2", description: "Cerrar", deadline: "2026-04-30", status: "completada" },
    ],
    inspections: [{ id: "i1", action: "Señalizar", deadline: "2026-04-20", status: "en_proceso" }],
  });

  assert.equal(items.length, 2);
  assert.equal(items[0].id, "i1");
  assert.equal(items[1].id, "a1");
});

test("corrective-measure-tracker-core resume vencidas y pendientes", () => {
  const summary = summarizeCorrectiveMeasures(
    [
      { id: "a1", description: "Capacitar", deadline: "2026-04-10", source: "accident", status: "pendiente" },
      { id: "i1", description: "Señalizar", deadline: "2026-04-17", source: "inspection", status: "en_proceso" },
      { id: "a2", description: "Cerrar", deadline: "2026-04-01", source: "accident", status: "completada" },
    ],
    new Date("2026-04-16T12:00:00Z"),
  );

  assert.deepEqual(summary, {
    pending: 1,
    inProgress: 1,
    completed: 1,
    overdue: 1,
  });
});

