import test from "node:test";
import assert from "node:assert/strict";

import { generateDayAvailability } from "../.dist/modulos/booking/agenda-core/src.js";

test("agenda-core genera slots y bloquea cruces con eventos existentes", () => {
  const result = generateDayAvailability({
    date: "2026-04-17",
    workStartHour: 9,
    workEndHour: 11,
    durationMinutes: 30,
    slotDurationMinutes: 30,
    events: [
      {
        id: "evt-1",
        title: "Reserva",
        startTime: "2026-04-17T09:30:00.000Z",
        endTime: "2026-04-17T10:00:00.000Z",
      },
    ],
  });

  assert.equal(result.slots.some((slot) => slot.start.includes("09:30:00.000Z")), false);
  assert.equal(result.slots.some((slot) => slot.start.includes("10:00:00.000Z")), false);
});

test("agenda-core sugiere alternativa cuando la hora solicitada cae en hora popular", () => {
  const result = generateDayAvailability({
    date: "2026-04-17",
    requestedHour: "10:00",
    workStartHour: 10,
    workEndHour: 12,
    popularHours: [10],
    events: [],
  });

  assert.match(result.fakeBusyMessage || "", /10:30|10\.30/);
  assert.equal(result.slots.some((slot) => slot.suggested), true);
});
