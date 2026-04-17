import test from "node:test";
import assert from "node:assert/strict";
import {
  buildZeleriCardsListRequest,
  buildZeleriEnrollmentBody,
  buildZeleriEnrollmentConfirmRequest,
  buildZeleriEnrollmentOrderRequest,
  buildZeleriEnrollmentRequest,
  sanitizeZeleriEnrollmentConfig,
} from "../.dist/modulos/payments/zeleri-enrollment-core/src.js";

test("zeleri-enrollment-core sanea config y firma enrollment", () => {
  const config = sanitizeZeleriEnrollmentConfig({
    baseUrl: "\"https://sandbox-zeleri.dev.ionix.cl/integration-kit/\"",
    token: " token-demo ",
    secret: " secret-demo ",
  });

  assert.equal(config.baseUrl, "https://sandbox-zeleri.dev.ionix.cl/integration-kit");
  assert.equal(config.token, "token-demo");
  assert.equal(config.secret, "secret-demo");

  const body = buildZeleriEnrollmentBody(
    {
      customerName: " Daniela ",
      customerEmail: "CLIENTE@MAIL.COM ",
      customerPhone: " +56911112222 ",
    },
    config.secret,
  );

  assert.equal(body.customer_name, "Daniela");
  assert.equal(body.customer_email, "cliente@mail.com");
  assert.equal(body.customer_phone, "+56911112222");
  assert.ok(body.signature.length > 10);
});

test("zeleri-enrollment-core arma request portable para enrollment y listado de tarjetas", () => {
  const createRequest = buildZeleriEnrollmentRequest(
    {
      baseUrl: "https://sandbox-zeleri.dev.ionix.cl/integration-kit",
      token: "token-demo",
      secret: "secret-demo",
    },
    {
      customerName: "Daniela",
      customerEmail: "cliente@mail.com",
      customerPhone: "+56911112222",
    },
  );

  assert.equal(createRequest.method, "POST");
  assert.equal(createRequest.url, "https://sandbox-zeleri.dev.ionix.cl/integration-kit/v1/enrollments/zeleri/enrollments");
  assert.equal(createRequest.headers.Authorization, "Bearer token-demo");

  const listRequest = buildZeleriCardsListRequest(
    {
      baseUrl: "https://sandbox-zeleri.dev.ionix.cl/integration-kit",
      token: "token-demo",
      secret: "secret-demo",
    },
    "CLIENTE@MAIL.COM",
  );

  assert.equal(listRequest.method, "GET");
  assert.match(listRequest.url, /customer_email=cliente%40mail\.com&signature=/);
});

test("zeleri-enrollment-core arma orden enrolada y confirmación", () => {
  const orderRequest = buildZeleriEnrollmentOrderRequest(
    {
      baseUrl: "https://sandbox-zeleri.dev.ionix.cl/integration-kit",
      token: "token-demo",
      secret: "secret-demo",
    },
    {
      cardId: "card_123",
      title: "Reserva Zeus",
      description: "Servicio con tarjeta enrolada",
      amount: 35000,
      commerceReference: "zeus|booking-123",
    },
  );

  assert.equal(orderRequest.method, "POST");
  assert.equal(orderRequest.body?.card_id, "card_123");
  assert.equal(orderRequest.body?.commerce_reference, "zeus|booking-123");

  const confirmRequest = buildZeleriEnrollmentConfirmRequest(
    {
      baseUrl: "https://sandbox-zeleri.dev.ionix.cl/integration-kit",
      token: "token-demo",
      secret: "secret-demo",
    },
    987,
    "CLIENTE@MAIL.COM",
  );

  assert.equal(confirmRequest.method, "POST");
  assert.equal(confirmRequest.body?.order_id, 987);
  assert.equal(confirmRequest.body?.customer_email, "cliente@mail.com");
  assert.ok(String(confirmRequest.body?.signature).length > 10);
});
