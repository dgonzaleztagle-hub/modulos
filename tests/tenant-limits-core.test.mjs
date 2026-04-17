import test from "node:test";
import assert from "node:assert/strict";

import {
  isPaidTenantPlan,
  resolveTenantLimit,
} from "../.dist/modulos/tenancy/tenant-limits-core/src.js";

test("tenant-limits-core detects paid plans", () => {
  assert.equal(isPaidTenantPlan("Plan Pro"), true);
  assert.equal(isPaidTenantPlan("free"), false);
});

test("tenant-limits-core resolves free and paid limits", () => {
  const free = resolveTenantLimit({ plan: "free", currentCount: 2, freeMax: 3 });
  const paid = resolveTenantLimit({ plan: "pro", configuredMax: 10, currentCount: 10 });

  assert.equal(free.canAdd, true);
  assert.equal(free.remaining, 1);
  assert.equal(paid.canAdd, false);
});
