import test from "node:test";
import assert from "node:assert/strict";

import {
  computeWeightedAverageCost,
  resolveMarginalCreditCost,
} from "../.dist/modulos/ops/weighted-cost-core/src.js";

test("weighted-cost-core calcula promedio ponderado", () => {
  assert.equal(
    computeWeightedAverageCost([
      { cost: 100, creditsAmount: 10 },
      { cost: 300, creditsAmount: 30 },
    ]),
    10,
  );
});

test("weighted-cost-core resuelve costo marginal por plan", () => {
  assert.equal(resolveMarginalCreditCost("MONTHLY_RESET", [{ cost: 100, creditsAmount: 10 }]), 0);
});
