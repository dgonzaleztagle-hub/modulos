import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWaMeLink,
  buildOrderUpdateMessage,
} from "../.dist/modulos/notifications/order-update-message-core/src.js";

test("order-update-message-core arma link wa.me", () => {
  const link = buildWaMeLink("+56 9 1234 5678", "Hola mundo");
  assert.equal(link, "https://wa.me/56912345678?text=Hola%20mundo");
});

test("order-update-message-core arma copy por evento", () => {
  const message = buildOrderUpdateMessage(
    { trackingCode: "AC-001", scheduledDate: "2026-04-16", scheduledTime: "10:30" },
    "order_created",
  );
  assert.match(message, /AC-001/);
  assert.match(message, /2026-04-16/);
});
