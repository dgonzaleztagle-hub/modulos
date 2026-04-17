import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWebPushRequestPayload,
  filterSubscriptionsForAudience,
  normalizePushPayload,
  summarizePushDelivery,
} from "../.dist/modulos/notifications/webpush-delivery-core/src.js";

test("webpush-delivery-core normaliza payloads con fallback", () => {
  const payload = normalizePushPayload({ title: "   ", body: "", url: " /cliente " });
  assert.equal(payload.title, "Actualización disponible");
  assert.equal(payload.body, "Abre tu panel para ver el detalle.");
  assert.equal(payload.url, "/cliente");
});

test("webpush-delivery-core filtra audiencias por tenant y cliente", () => {
  const subscriptions = [
    { id: "1", tenantId: "a", endpoint: "e1", p256dh: "k1", auth: "x1", customerPhone: "111" },
    { id: "2", tenantId: "a", endpoint: "e2", p256dh: "k2", auth: "x2", customerPhone: "222" },
    { id: "3", tenantId: "b", endpoint: "e3", p256dh: "k3", auth: "x3", customerPhone: "111" },
  ];

  assert.equal(filterSubscriptionsForAudience(subscriptions, { tenantId: "a" }).length, 2);
  assert.equal(
    filterSubscriptionsForAudience(subscriptions, { tenantId: "a", customerPhone: "111" }).length,
    1,
  );
});

test("webpush-delivery-core serializa payload listo para integrador", () => {
  const json = buildWebPushRequestPayload({ title: "Hola", body: "Reserva confirmada", tag: "agenda" });
  assert.match(json, /Reserva confirmada/);
  assert.match(json, /agenda/);
});

test("webpush-delivery-core resume resultados y detecta expiradas", () => {
  const summary = summarizePushDelivery([
    { subscriptionId: "a", success: true },
    { subscriptionId: "b", success: false, statusCode: 410 },
    { subscriptionId: "c", success: false, statusCode: 500 },
  ]);

  assert.equal(summary.delivered, 1);
  assert.equal(summary.failed, 2);
  assert.deepEqual(summary.expiredIds, ["b"]);
  assert.deepEqual(summary.retryableIds, ["c"]);
});

