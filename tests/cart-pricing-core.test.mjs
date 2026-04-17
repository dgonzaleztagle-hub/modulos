import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCartItem,
  calculateCartSubtotal,
  calculateCartTotal,
  calculatePromotionDiscount,
  getCartItemCount,
  updateCartItemQuantity,
} from '../.dist/modulos/commerce/cart-pricing-core/src.js';

test('addCartItem mergea items repetidos', () => {
  const burger = { id: 'burger', price: 10000 };
  const items = addCartItem([], burger, 1);
  const merged = addCartItem(items, burger, 2);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].quantity, 3);
});

test('cart pricing calcula subtotal descuento y total', () => {
  const items = [
    { menu_item: { id: 'burger', price: 10000 }, quantity: 2 },
    { menu_item: { id: 'fries', price: 4000 }, quantity: 1 },
  ];

  const subtotal = calculateCartSubtotal(items);
  const discount = calculatePromotionDiscount(subtotal, {
    discount_type: 'percent',
    discount_value: 10,
  });
  const total = calculateCartTotal(subtotal, {
    discount_type: 'percent',
    discount_value: 10,
  });

  assert.equal(subtotal, 24000);
  assert.equal(discount, 2400);
  assert.equal(total, 21600);
});

test('updateCartItemQuantity remueve si la cantidad es cero', () => {
  const items = [
    { menu_item: { id: 'burger', price: 10000 }, quantity: 2 },
  ];

  const updated = updateCartItemQuantity(items, 'burger', 0);
  assert.equal(updated.length, 0);
  assert.equal(getCartItemCount(items), 2);
});
