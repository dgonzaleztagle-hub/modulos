import test from "node:test";
import assert from "node:assert/strict";

import {
  applyLoyaltyAward,
  buildLoyaltyTransactionDraft,
  calculatePointsForOrder,
  calculateTier,
  processWeeklyStreak,
} from "../.dist/modulos/crm/loyalty-ledger-core/src.js";

test("loyalty-ledger-core resolves points and tier", () => {
  assert.equal(calculatePointsForOrder(12990), 12);
  assert.equal(calculateTier(1200), "silver");
});

test("loyalty-ledger-core updates ledger and drafts redemption transaction", () => {
  const next = applyLoyaltyAward({
    state: { pointsCurrent: 900, pointsHistorical: 900, totalVisits: 2, tier: "bronze" },
    points: 200,
    reason: "order",
    now: "2026-01-01T10:00:00.000Z",
  });
  const tx = buildLoyaltyTransactionDraft({ points: 100, reason: "redemption" });

  assert.equal(next.tier, "silver");
  assert.equal(tx.pointsDelta, -100);
});

test("loyalty-ledger-core procesa racha semanal", () => {
  const continued = processWeeklyStreak("2026-04-08T12:00:00.000Z", 3, new Date("2026-04-16T12:00:00.000Z"));
  const sameWeek = processWeeklyStreak("2026-04-14T12:00:00.000Z", 3, new Date("2026-04-16T12:00:00.000Z"));

  assert.equal(continued.newStreak, 4);
  assert.equal(sameWeek.streakUpdated, false);
});
