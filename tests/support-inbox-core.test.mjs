import test from "node:test";
import assert from "node:assert/strict";

import {
  getSupportStatusLabel,
  getSupportVisibilityLabel,
  sortTicketsByRecentActivity,
} from "../.dist/modulos/crm/support-inbox-core/src/index.js";

test("support-inbox-core traduce labels de estado y visibilidad", () => {
  assert.equal(getSupportStatusLabel("waiting_customer"), "Esperando cliente");
  assert.equal(getSupportVisibilityLabel("authenticated_thread"), "Interno");
});

test("support-inbox-core ordena tickets por actividad reciente", () => {
  const tickets = sortTicketsByRecentActivity([
    { id: "1", createdAt: "2026-04-17T10:00:00Z", requestType: "x", status: "open", subject: "A", name: "A", email: "a@test.cl", visibilityMode: "public_email_only" },
    { id: "2", createdAt: "2026-04-17T09:00:00Z", lastMessageAt: "2026-04-17T12:00:00Z", requestType: "x", status: "open", subject: "B", name: "B", email: "b@test.cl", visibilityMode: "authenticated_thread" },
  ]);

  assert.equal(tickets[0].id, "2");
});
