import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_TONE_CONFIG,
  buildDeliveryDashboardAlert,
  buildOrderDashboardAlert,
  buildReservationDashboardAlert,
} from "../.dist/modulos/notifications/dashboard-alerts-core/src.js";

test("dashboard-alerts-core arma alerta de pedido y reserva", () => {
  const order = buildOrderDashboardAlert({ customerName: "Ana", orderType: "delivery", finalPrice: 12500 });
  const reservation = buildReservationDashboardAlert({ customerName: "Luis", partySize: 4, timeSlot: "20:30" });

  assert.match(order.body, /Delivery/);
  assert.match(reservation.body, /4 pax/);
});

test("dashboard-alerts-core resuelve alerta delivery y tonos", () => {
  const delivery = buildDeliveryDashboardAlert({ driverName: "Pablo", status: "in_transit" });
  assert.equal(delivery.title, "Delivery actualizado");
  assert.equal(DASHBOARD_TONE_CONFIG.order.freqs.length, 3);
  assert.equal(buildDeliveryDashboardAlert({ status: "assigned" }), null);
});
