import test from "node:test";
import assert from "node:assert/strict";

import {
  getEffectiveBillingPlan,
  getFlowPlanId,
  isProgramAllowedForPlan,
  normalizeProgramChoices,
} from "../.dist/modulos/tenancy/billing-plan-catalog-core/src.js";

test("billing-plan-catalog-core resuelve plan y choices", () => {
  assert.equal(getEffectiveBillingPlan("trial", null), "pyme");
  assert.deepEqual(normalizeProgramChoices(["cashback", "sellos"], "pyme"), ["cashback"]);
  assert.equal(isProgramAllowedForPlan("cashback", ["cashback"], "pro"), true);
});

test("billing-plan-catalog-core resuelve ids flow", () => {
  assert.equal(getFlowPlanId("pyme", "agenda"), "vuelve_pyme_agenda_mensual");
  assert.equal(getFlowPlanId("full"), "vuelve_full_mensual");
});
