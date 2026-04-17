import test from "node:test";
import assert from "node:assert/strict";

import {
  addB2BCartItem,
  buildB2BCartItem,
  buildB2BWhatsAppQuote,
  calculateB2BCartTotals,
} from "../.dist/modulos/commerce/b2b-store-engine/src.js";

test("b2b-store-engine stacks equivalent variant selections", () => {
  const product = {
    id: "p1",
    name: "Reactivo X",
    basePrice: 1000,
    category: "lab",
  };

  const first = buildB2BCartItem(product, {}, 1);
  const second = buildB2BCartItem(product, {}, 2);
  const cart = addB2BCartItem([first], second);

  assert.equal(cart[0].quantity, 3);
  assert.equal(calculateB2BCartTotals(cart).total, 3000);
});

test("b2b-store-engine builds a portable quote message", () => {
  const quote = buildB2BWhatsAppQuote({
    companyName: "Laboratorio Norte",
    cart: [
      {
        id: "p1",
        name: "Reactivo X",
        basePrice: 1000,
        category: "lab",
        cartItemId: "p1",
        quantity: 2,
        selectedVariants: {},
        finalUnitPrice: 1000,
      },
    ],
  });

  assert.match(quote, /Laboratorio Norte/);
  assert.match(quote, /TOTAL ESTIMADO/);
});
