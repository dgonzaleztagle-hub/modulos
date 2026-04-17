import test from "node:test";
import assert from "node:assert/strict";
import {
  parseScheduleMinutes,
  resolveCashCloseAlertStage,
  resolveCashCloseAlertState,
} from "../.dist/modulos/ops/cash-close-alerts-core/src.js";

test("cash-close-alerts-core parsea horario válido", () => {
  assert.equal(parseScheduleMinutes("18:30"), 1110);
  assert.equal(parseScheduleMinutes("aa:bb"), null);
});

test("cash-close-alerts-core resuelve etapas de alerta", () => {
  assert.equal(resolveCashCloseAlertStage(14), "warn_15");
  assert.equal(resolveCashCloseAlertStage(9), "warn_10");
  assert.equal(resolveCashCloseAlertStage(4), "warn_5");
  assert.equal(resolveCashCloseAlertStage(0), "overdue");
});

test("cash-close-alerts-core calcula estado completo", () => {
  const result = resolveCashCloseAlertState({
    scheduledCloseTime: "18:00",
    now: new Date("2026-04-16T17:52:00"),
  });

  assert.equal(result.minutesUntilClose, 8);
  assert.equal(result.stage, "warn_10");
});
