import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSubscriptionAlertCandidates,
  resolveSubscriptionAlertType,
} from "../.dist/modulos/ops/subscription-alerts-core/src.js";

test("subscription-alerts-core resolves alert type", () => {
  assert.equal(resolveSubscriptionAlertType(5), "vencing_5days");
  assert.equal(resolveSubscriptionAlertType(2), null);
});

test("subscription-alerts-core skips duplicate alerts from same day", () => {
  const now = new Date("2026-01-01T10:00:00.000Z");
  const candidates = buildSubscriptionAlertCandidates({
    now,
    accounts: [
      { id: 1, name: "Reseller 1", expiresAt: "2026-01-02T10:00:00.000Z" },
      { id: 2, name: "Reseller 2", expiresAt: "2026-01-06T10:00:00.000Z" },
    ],
    existingAlerts: [
      { ownerId: 1, alertType: "vencing_1day", createdAt: "2026-01-01T09:00:00.000Z" },
    ],
  });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].ownerId, 2);
});
