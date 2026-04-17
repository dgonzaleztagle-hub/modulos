import test from "node:test";
import assert from "node:assert/strict";

import {
  isNotificationEnabled,
  mergeNotificationPreferences,
  resolveEnabledNotificationTypes,
} from "../.dist/modulos/notifications/notification-preferences-core/src.js";

test("notification-preferences-core usa fallback true por defecto", () => {
  assert.equal(isNotificationEnabled({ preferences: null, type: "expirations" }), true);
});

test("notification-preferences-core respeta preferencias explicitas", () => {
  assert.equal(
    isNotificationEnabled({
      preferences: { whatsapp: false },
      type: "whatsapp",
    }),
    false,
  );
});

test("notification-preferences-core mezcla preferencias y devuelve habilitadas", () => {
  const merged = mergeNotificationPreferences({ tickets: true }, { tickets: false, low_stock: true });
  assert.deepEqual(resolveEnabledNotificationTypes(merged), ["expirations", "low_stock", "low_credits", "whatsapp"]);
});
