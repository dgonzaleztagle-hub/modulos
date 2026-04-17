import test from "node:test";
import assert from "node:assert/strict";

import {
  getDaysUntilExpiration,
  resolveExpirationCheckpoint,
  shouldSendExpirationNotification,
} from "../.dist/modulos/ops/expiration-window-core/src.js";

test("expiration-window-core calcula checkpoint", () => {
  const days = getDaysUntilExpiration("2026-04-21T12:00:00.000Z", new Date("2026-04-16T12:00:00.000Z"));
  assert.equal(days, 5);
  assert.equal(resolveExpirationCheckpoint(days), "warn_5");
});

test("expiration-window-core respeta preferencias", () => {
  assert.equal(shouldSendExpirationNotification(3, { expirations: true }), true);
  assert.equal(shouldSendExpirationNotification(3, { expirations: false }), false);
});
