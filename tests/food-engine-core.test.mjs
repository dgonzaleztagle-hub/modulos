import test from "node:test";
import assert from "node:assert/strict";

import {
  addCartItem,
  buildCartItem,
  buildCatalogSections,
  canSubmitFoodOrder,
  resolveStoreSessionState,
} from "../.dist/modulos/food/food-engine-core/src.js";

test("food-engine-core groups active menu items by category", () => {
  const sections = buildCatalogSections([
    { id: "1", name: "Burger", price: 7000, categoryName: "Burgers" },
    { id: "2", name: "Empanada", price: 2000, categoryName: "Empanadas" },
  ]);

  assert.equal(sections.length, 2);
  assert.equal(sections[0].items.length, 1);
});

test("food-engine-core enables order submit only with live session and cart", () => {
  const cart = addCartItem([], buildCartItem({ id: "1", name: "Burger", price: 7000 }, 1));
  assert.equal(canSubmitFoodOrder(resolveStoreSessionState("sess-1"), cart), true);
  assert.equal(canSubmitFoodOrder(resolveStoreSessionState(null), cart), false);
});
