import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMercadoPagoBackUrls,
  buildMercadoPagoNotificationUrl,
  buildCheckoutIntent,
  extractMercadoPagoWebhookPaymentId,
  extractScopedExternalReference,
  isApprovedMercadoPagoStatus,
  isFinalMercadoPagoStatus,
  normalizeMercadoPagoEvent,
  normalizeMercadoPagoPayerEmail,
  splitPayerName,
} from "../.dist/modulos/payments/mercadopago-core/src.js";

test("mercadopago-core normalizes nested payment events", () => {
  const event = normalizeMercadoPagoEvent({
    data: {
      id: 12345,
      status: "approved",
      external_reference: "order-77",
    },
  });

  assert.equal(event.paymentId, "12345");
  assert.equal(event.externalReference, "order-77");
  assert.equal(event.topic, undefined);
  assert.equal(event.status, "approved");
  assert.equal(event.approved, true);
});

test("mercadopago-core builds a portable checkout payload", () => {
  const intent = buildCheckoutIntent({
    title: "Combo Lunch",
    amount: 15990.459,
    externalReference: "ord-123",
    payerEmail: " buyer@example.com ",
    successUrl: "https://example.com/success",
    failureUrl: "https://example.com/failure",
  });

  assert.equal(intent.externalReference, "ord-123");
  assert.equal(intent.payload.unit_price, 15990.46);
  assert.equal(intent.payload.payer?.email, "buyer@example.com");
  assert.equal(intent.payload.back_urls?.success, "https://example.com/success");
});

test("mercadopago-core exposes status helpers", () => {
  assert.equal(isApprovedMercadoPagoStatus("approved"), true);
  assert.equal(isFinalMercadoPagoStatus("approved"), true);
  assert.equal(isFinalMercadoPagoStatus("pending"), false);
});

test("mercadopago-core arma back urls y notification url", () => {
  const backUrls = buildMercadoPagoBackUrls({
    baseUrl: "https://zeus.cl",
    successPath: "/checkout/success?booking_id=abc",
    failurePath: "/checkout/error?booking_id=abc",
  });

  assert.equal(backUrls.success, "https://zeus.cl/checkout/success?booking_id=abc");
  assert.equal(buildMercadoPagoNotificationUrl("https://zeus.cl"), "https://zeus.cl/api/payments/webhook/mercadopago");
  assert.equal(buildMercadoPagoNotificationUrl("http://localhost:3000"), undefined);
});

test("mercadopago-core normaliza email y extrae referencias", () => {
  assert.equal(
    normalizeMercadoPagoPayerEmail("http://localhost:3000", "buyer@example.com"),
    "checkout.bricks@example.com",
  );
  assert.deepEqual(splitPayerName("Juan Pablo Perez"), {
    firstName: "Juan Pablo",
    lastName: "Perez",
  });
  assert.equal(
    extractMercadoPagoWebhookPaymentId({ data: { id: 55 } }, new URLSearchParams()),
    "55",
  );
  assert.deepEqual(extractScopedExternalReference("service|booking-7", "service"), {
    scope: "service",
    entityId: "booking-7",
    extra: [],
  });
});
