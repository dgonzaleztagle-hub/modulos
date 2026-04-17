import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPaymentMethod,
  formatTicketOrderType,
  getKitchenProductCount,
} from '../.dist/modulos/pos/ticket-format-core/src.js';

test('ticket-format-core formatea tipo de pedido por variante', () => {
  assert.equal(formatTicketOrderType('dine_in', 'kitchen'), 'MESA');
  assert.equal(formatTicketOrderType('takeaway', 'customer'), 'Para Llevar');
});

test('ticket-format-core formatea método de pago', () => {
  assert.equal(formatPaymentMethod('card'), 'Tarjeta');
  assert.equal(formatPaymentMethod(), 'Pendiente');
});

test('ticket-format-core calcula cantidad total de productos', () => {
  assert.equal(getKitchenProductCount([{ quantity: 2 }, { quantity: 3 }]), 5);
});
