import test from "node:test";
import assert from "node:assert/strict";

import {
  buildArrearsEntries,
  buildArrearsLegalMessage,
  resolveArrearsSeverity,
  summarizeArrears,
} from "../.dist/modulos/ops/arrears-alert-core/src.js";

test("arrears-alert-core clasifica severidad por días", () => {
  assert.equal(resolveArrearsSeverity(3), "warning");
  assert.equal(resolveArrearsSeverity(12), "alert");
  assert.equal(resolveArrearsSeverity(35), "critical");
});

test("arrears-alert-core agrupa por contrato y toma la mora mayor", () => {
  const entries = buildArrearsEntries(
    [
      { contractId: "c1", dueDate: "2026-03-01", status: "overdue", amount: 1000 },
      { contractId: "c1", dueDate: "2026-04-01", status: "pending", amount: 500 },
      { contractId: "c2", dueDate: "2026-04-10", status: "pending", amount: 700 },
    ],
    new Date("2026-04-16T00:00:00.000Z"),
  );

  assert.equal(entries.length, 2);
  assert.equal(entries[0].contractId, "c1");
  assert.equal(entries[0].severity, "critical");
});

test("arrears-alert-core resume y redacta aviso legal", () => {
  const summary = summarizeArrears([
    { contractId: "a", dueDate: "2026-03-01", amount: 1000, daysOverdue: 35, severity: "critical" },
    { contractId: "b", dueDate: "2026-04-01", amount: 500, daysOverdue: 12, severity: "alert" },
  ]);

  assert.equal(summary.totalDebt, 1500);
  assert.match(buildArrearsLegalMessage(summary), /más de 30 días de mora/);
});
