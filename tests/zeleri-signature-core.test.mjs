import test from 'node:test';
import assert from 'node:assert/strict';
import { ZeleriSignature, concatenateObjectProperties, sortObjectKeys } from '../.dist/modulos/payments/zeleri-signature-core/src.js';

test('zeleri-signature-core ordena objetos y omite signature', () => {
  const sorted = sortObjectKeys({ b: 2, a: 1, signature: 'x' });
  const message = concatenateObjectProperties(sorted);
  assert.equal(message, 'a1b2');
});

test('zeleri-signature-core genera y valida firma', () => {
  const signer = new ZeleriSignature('secret-demo');
  const payload = { amount: 1000, orderId: 'ord_1' };
  const signature = signer.generate(payload);

  assert.equal(typeof signature, 'string');
  assert.equal(signer.validate(payload, signature), true);
});

test('zeleri-signature-core soporta query string', () => {
  const signer = new ZeleriSignature('secret-demo');
  const signature = signer.generate('orderId=ord_1&amount=1000');
  assert.equal(signer.validate('amount=1000&orderId=ord_1', signature), true);
});
