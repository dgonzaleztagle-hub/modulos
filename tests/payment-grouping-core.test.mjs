import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPeriodSummary,
  groupPaymentsForDisplay,
} from "../.dist/modulos/payments/payment-grouping-core/src.js";

test("payment-grouping-core builds period summary", () => {
  assert.equal(buildPeriodSummary(["Marzo", "Abril"]), "Marzo,Abril");
});

test("payment-grouping-core groups consecutive payments", () => {
  const grouped = groupPaymentsForDisplay([
    {
      id: "1",
      folio: 100,
      ownerId: "stu-1",
      ownerName: "Alumno 1",
      paymentDate: "2026-01-01",
      concept: "Cuota",
      amount: 10000,
      period: "Marzo",
    },
    {
      id: "2",
      folio: 101,
      ownerId: "stu-1",
      ownerName: "Alumno 1",
      paymentDate: "2026-01-01",
      concept: "Cuota",
      amount: 10000,
      period: "Abril",
    },
  ]);

  assert.equal(grouped.length, 1);
  assert.equal(grouped[0].isGrouped, true);
  assert.equal(grouped[0].folioLabel, "100-101");
  assert.equal(grouped[0].amount, 20000);
});
