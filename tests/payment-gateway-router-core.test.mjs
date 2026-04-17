import test from 'node:test';
import assert from 'node:assert/strict';
import { createPaymentRequestPlan } from '../.dist/modulos/payments/payment-gateway-router-core/src.js';

const baseParams = {
  orderId: 'ord_1',
  amount: 25000,
  description: 'Pedido demo',
  returnUrl: 'https://example.com/return',
  webhookUrl: 'https://example.com/webhook',
  customerEmail: 'cliente@example.com',
};

test('createPaymentRequestPlan arma mercado pago', async () => {
  const plan = await createPaymentRequestPlan(
    {
      method: 'mercadopago',
      credentials: { accessToken: 'mp_token' },
      testMode: true,
    },
    baseParams,
  );

  assert.equal(plan.method, 'mercadopago');
  assert.match(plan.endpoint, /mercadopago/);
  assert.match(plan.headers.Authorization, /mp_token/);
});

test('createPaymentRequestPlan arma flow con firma', async () => {
  const plan = await createPaymentRequestPlan(
    {
      method: 'flow',
      credentials: { apiKey: 'flow_key', secretKey: 'flow_secret' },
      testMode: true,
    },
    baseParams,
  );

  assert.equal(plan.method, 'flow');
  assert.match(plan.body, /commerceOrder=ord_1/);
  assert.match(plan.body, /s=/);
});

test('createPaymentRequestPlan arma transbank', async () => {
  const plan = await createPaymentRequestPlan(
    {
      method: 'transbank',
      credentials: { commerceCode: '597055555532', apiKey: 'tbk_secret' },
      testMode: true,
    },
    baseParams,
  );

  assert.equal(plan.method, 'transbank');
  assert.match(plan.endpoint, /webpay3gint/);
  assert.equal(plan.headers['Tbk-Api-Key-Id'], '597055555532');
});
