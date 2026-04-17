import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePushSubscription,
  getDriverSubscriptions,
  upsertDriverSubscription,
  removeDriverSubscription,
} from "../.dist/modulos/notifications/driver-subscription-core/src.js";

test("driver-subscription-core sanea suscripción válida", () => {
  const result = sanitizePushSubscription({
    endpoint: " https://push.example/a ",
    keys: { p256dh: " abc ", auth: " xyz " },
  });

  assert.deepEqual(result, {
    endpoint: "https://push.example/a",
    expirationTime: null,
    keys: { p256dh: "abc", auth: "xyz" },
  });
});

test("driver-subscription-core inserta, lista y remueve por endpoint", () => {
  const base = upsertDriverSubscription({}, "drv-1", {
    endpoint: "https://push.example/a",
    keys: { p256dh: "abc", auth: "xyz" },
  });

  const updated = upsertDriverSubscription(base, "drv-1", {
    endpoint: "https://push.example/a",
    keys: { p256dh: "abc2", auth: "xyz2" },
  });

  assert.equal(getDriverSubscriptions(updated, "drv-1").length, 1);
  assert.equal(getDriverSubscriptions(updated, "drv-1")[0].keys.p256dh, "abc2");

  const cleaned = removeDriverSubscription(updated, "drv-1", "https://push.example/a");
  assert.equal(getDriverSubscriptions(cleaned, "drv-1").length, 0);
});
