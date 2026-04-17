import test from "node:test";
import assert from "node:assert/strict";

import {
  isExpiredPendingBooking,
  reconcileBookings,
} from "../.dist/modulos/booking/booking-locks/src.js";

test("booking-locks detects expired pending bookings", () => {
  const expired = isExpiredPendingBooking(
    {
      id: "b1",
      paymentStatus: "pending",
      createdAt: "2026-04-15T10:00:00.000Z",
    },
    30,
    new Date("2026-04-15T11:00:00.000Z").getTime(),
  );

  assert.equal(expired, true);
});

test("booking-locks reconciles paid bookings through adapters", async () => {
  const adapter = {
    supports: (method) => method === "mercadopago",
    resolveStatus: async () => "paid",
  };

  const result = await reconcileBookings(
    [
      {
        id: "b2",
        paymentStatus: "pending",
        paymentMethod: "mercadopago",
        createdAt: "2026-04-15T10:00:00.000Z",
      },
    ],
    [adapter],
    {
      holdMinutes: 30,
    },
  );

  assert.equal(result.resolutions[0]?.currentStatus, "paid");
  assert.equal(result.blocking.length, 1);
});

test("booking-locks handles adapter errors with configurable fallback", async () => {
  const adapter = {
    supports: () => true,
    resolveStatus: async () => {
      throw new Error("Gateway timeout");
    },
  };

  const result = await reconcileBookings(
    [
      {
        id: "b3",
        paymentStatus: "pending",
        paymentMethod: "mercadopago",
        createdAt: "2026-04-15T10:00:00.000Z",
      },
    ],
    [adapter],
    {
      holdMinutes: 30,
      onAdapterError: "mark-failed",
    },
  );

  assert.equal(result.resolutions[0]?.currentStatus, "failed");
  assert.equal(result.blocking.length, 0);
});
