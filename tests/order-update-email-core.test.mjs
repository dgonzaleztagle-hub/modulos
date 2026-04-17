import test from "node:test";
import assert from "node:assert/strict";
import { buildOrderUpdateEmail } from "../.dist/modulos/notifications/order-update-email-core/src.js";

test("order-update-email-core arma subject html y texto", () => {
  const result = buildOrderUpdateEmail(
    {
      trackingCode: "AC-001",
      status: "assigned",
      createdAt: "2026-04-16T12:00:00Z",
      scheduledDate: "2026-04-16",
      scheduledTime: "15:00",
      pickupAddress: "Origen",
      deliveryAddress: "Destino",
      totalPrice: 15990,
    },
    "client",
    "order_assigned",
    "Tu servicio fue asignado",
    { baseUrl: "https://demo.test", supportPhone: "+56 9 1111 2222" },
  );

  assert.match(result.subject, /AC-001/);
  assert.match(result.html, /Ver seguimiento/);
  assert.match(result.text, /demo\.test/);
});
