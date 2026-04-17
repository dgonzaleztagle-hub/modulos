import test from "node:test";
import assert from "node:assert/strict";
import {
  buildChecklistResultsFromTemplate,
  groupChecklistResults,
  summarizeChecklistResults,
  updateChecklistItemObservation,
  updateChecklistItemStatus,
} from "../.dist/modulos/ops/inspection-checklist-core/src.js";

test("inspection-checklist-core inicializa resultados desde plantilla", () => {
  const results = buildChecklistResultsFromTemplate([{ id: "1", text: "Extintor visible", category: "Seguridad" }]);
  assert.equal(results[0].status, "cumple");
});

test("inspection-checklist-core actualiza estado y observación", () => {
  let results = buildChecklistResultsFromTemplate([{ id: "1", text: "Extintor visible", category: "Seguridad" }]);
  results = updateChecklistItemStatus(results, "1", "no_cumple");
  results = updateChecklistItemObservation(results, "1", " Falta señalización ");
  assert.equal(results[0].status, "no_cumple");
  assert.equal(results[0].observation, "Falta señalización");
});

test("inspection-checklist-core agrupa y resume resultados", () => {
  const results = [
    { itemId: "1", text: "A", category: "Seguridad", status: "cumple", observation: "" },
    { itemId: "2", text: "B", category: "Orden", status: "no_cumple", observation: "" },
    { itemId: "3", text: "C", category: "Orden", status: "no_aplica", observation: "" },
  ];

  const grouped = groupChecklistResults(results);
  const summary = summarizeChecklistResults(results);

  assert.equal(grouped.Orden.length, 2);
  assert.deepEqual(summary, { cumple: 1, no_cumple: 1, no_aplica: 1 });
});

