import test from "node:test";
import assert from "node:assert/strict";
import {
  getWeekStart,
  getWeekLabel,
  canSubmitRankedScore,
  buildRankedScoreEntry,
  buildWeeklyLeaderboard,
} from "../.dist/modulos/crm/weekly-ranking-core/src.js";

test("getWeekStart anchors on monday", () => {
  assert.equal(getWeekStart(new Date("2026-04-19T12:00:00Z")), "2026-04-13");
  assert.equal(getWeekStart(new Date("2026-04-20T12:00:00Z")), "2026-04-20");
});

test("getWeekLabel uses week start", () => {
  assert.equal(getWeekLabel(new Date("2026-04-22T12:00:00Z")), "Semana del 2026-04-20");
});

test("canSubmitRankedScore enforces max attempts", () => {
  const entries = [
    buildRankedScoreEntry({ customerPhone: "5691111", businessId: "b1", score: 10, weekStart: "2026-04-20" }),
    buildRankedScoreEntry({ customerPhone: "5691111", businessId: "b1", score: 20, weekStart: "2026-04-20" }),
    buildRankedScoreEntry({ customerPhone: "5691111", businessId: "b1", score: 30, weekStart: "2026-04-20" }),
  ];

  assert.equal(canSubmitRankedScore(entries, "5691111", "b1", "2026-04-20"), false);
  assert.equal(canSubmitRankedScore(entries, "5692222", "b1", "2026-04-20"), true);
});

test("buildWeeklyLeaderboard keeps best score per phone", () => {
  const entries = [
    buildRankedScoreEntry({ customerPhone: "5691111", customerName: "Ana", businessId: "b1", score: 40, weekStart: "2026-04-20" }),
    buildRankedScoreEntry({ customerPhone: "5691111", customerName: "Ana", businessId: "b1", score: 55, weekStart: "2026-04-20" }),
    buildRankedScoreEntry({ customerPhone: "5692222", customerName: "Luis", businessId: "b1", score: 50, weekStart: "2026-04-20" }),
  ];

  const leaderboard = buildWeeklyLeaderboard(entries);
  assert.equal(leaderboard.length, 2);
  assert.deepEqual(leaderboard[0], { rank: 1, name: "Ana", score: 55, phoneHint: "1111" });
  assert.deepEqual(leaderboard[1], { rank: 2, name: "Luis", score: 50, phoneHint: "2222" });
});
