import test from "node:test";
import assert from "node:assert/strict";
import {
  buildZeleriOneShotBody,
  buildZeleriOneShotRequest,
  buildZeleriOrderDetailRequest,
  isZeleriOneShotPaid,
  normalizeZeleriOrderStatus,
  sanitizeZeleriConfig,
} from "../.dist/modulos/payments/zeleri-oneshot-core/src.js";

test("zeleri-oneshot-core sanea config y arma body firmado", () => {
  const config = sanitizeZeleriConfig({
    baseUrl: "\"https://sandbox-zeleri.dev.ionix.cl/integration-kit/\"",
    token: " token-demo ",
    secret: " secret-demo ",
  });

  assert.equal(config.baseUrl, "https://sandbox-zeleri.dev.ionix.cl/integration-kit");
  assert.equal(config.token, "token-demo");
  assert.equal(config.secret, "secret-demo");

  const body = buildZeleriOneShotBody(
    {
      title: "Reserva Zeus",
      description: "Servicio agendado",
      amount: 35000,
      customer: {
        email: "CLIENTE@MAIL.COM ",
        name: " Daniela ",
        phone: " +56911112222 ",
      },
      successUrl: "https://app.test/success",
      failureUrl: "https://app.test/failure",
      commerceOrder: "booking-123",
    },
    config.secret,
  );

  assert.equal(body.currency_id, 1);
  assert.equal(body.gateway_id, 4);
  assert.equal(body.customer.email, "cliente@mail.com");
  assert.equal(body.customer.name, "Daniela");
  assert.equal(body.commerce_order, "booking-123");
  assert.equal(typeof body.signature, "string");
  assert.ok(body.signature.length > 10);
});

test("zeleri-oneshot-core arma request portable para checkout", () => {
  const request = buildZeleriOneShotRequest(
    {
      baseUrl: "https://sandbox-zeleri.dev.ionix.cl/integration-kit",
      token: "token-demo",
      secret: "secret-demo",
    },
    {
      title: "Reserva Zeus",
      description: "Servicio agendado",
      amount: 35000,
      customer: { email: "cliente@mail.com", name: "Daniela" },
      successUrl: "https://app.test/success",
      failureUrl: "https://app.test/failure",
      commerceReference: "zeus|booking-123",
    },
  );

  assert.equal(request.method, "POST");
  assert.equal(request.url, "https://sandbox-zeleri.dev.ionix.cl/integration-kit/v1/checkout/orders");
  assert.equal(request.headers.Authorization, "Bearer token-demo");
  assert.equal(request.body?.commerce_reference, "zeus|booking-123");
});

test("zeleri-oneshot-core arma request de detalle y clasifica estados", () => {
  const detail = buildZeleriOrderDetailRequest(
    {
      baseUrl: "https://sandbox-zeleri.dev.ionix.cl/integration-kit",
      token: "token-demo",
      secret: "secret-demo",
    },
    987,
  );

  assert.equal(detail.method, "GET");
  assert.match(detail.url, /\/v1\/orders\/detail\?id=987&signature=/);
  assert.equal(normalizeZeleriOrderStatus(" Approved "), "approved");
  assert.equal(isZeleriOneShotPaid("completed"), true);
  assert.equal(isZeleriOneShotPaid({ data: { status: "pending" } }), false);
});
