import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeSchoolMonth,
  buildSchoolMonthPeriod,
  buildPaymentApprovalEntries,
} from "../.dist/modulos/payments/payment-allocation-core/src.js";

test("payment-allocation-core normaliza meses escolares", () => {
  assert.equal(normalizeSchoolMonth("2026-marzo"), "MARZO");
  assert.equal(buildSchoolMonthPeriod(["MARZO", "ABRIL", "MAYO"]), "MARZO-MAYO");
});

test("payment-allocation-core expande actividades y cuota mensual", () => {
  const entries = buildPaymentApprovalEntries({
    payment_date: "2026-04-16",
    student_id: "stu-1",
    amount: 42000,
    students: { first_name: "Ana", last_name: "Pérez" },
    payment_details: {
      selected_debts: [
        { type: "activity", id: "act-1", name: "Taller", amount: 12000, paid_amount: 12000 },
        {
          type: "monthly_fee",
          name: "Cuota",
          amount: 30000,
          paid_amount: 30000,
          months: ["MARZO", "ABRIL"],
        },
      ],
    },
  });

  assert.equal(entries.length, 2);
  assert.equal(entries[0].concept, "Taller");
  assert.equal(entries[1].concept, "Cuota MARZO-ABRIL");
});
