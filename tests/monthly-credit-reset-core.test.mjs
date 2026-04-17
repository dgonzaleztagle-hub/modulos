import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMonthlyResetBatch,
  buildMonthlyResetCandidate,
  shouldResetMonthlyCredits,
} from "../.dist/modulos/ops/monthly-credit-reset-core/src.js";

const provider = {
  id: 7,
  name: "Stream Gold",
  resellerId: 90,
  planType: "MONTHLY_RESET",
  resetDay: 16,
  isActive: true,
  credits: 12,
  monthlyLimit: 100,
  monthlyCost: 19990,
  currency: "CLP",
};

test("monthly-credit-reset-core detecta reseteo aplicable", () => {
  assert.equal(shouldResetMonthlyCredits(provider, 16), true);
  assert.equal(shouldResetMonthlyCredits(provider, 15), false);
});

test("monthly-credit-reset-core arma candidato con gasto", () => {
  assert.deepEqual(buildMonthlyResetCandidate(provider, 16), {
    providerId: 7,
    providerName: "Stream Gold",
    resellerId: 90,
    previousCredits: 12,
    nextCredits: 100,
    metadata: { creditsReset: true, amount: 100 },
    expense: {
      amount: 19990,
      currency: "CLP",
      description: "Renovacion mensual automatica (Stream Gold)",
    },
  });
});

test("monthly-credit-reset-core filtra batch no aplicable", () => {
  const batch = buildMonthlyResetBatch({
    dayOfMonth: 16,
    providers: [provider, { ...provider, id: 8, resetDay: 20 }],
  });

  assert.equal(batch.length, 1);
  assert.equal(batch[0].providerId, 7);
});
