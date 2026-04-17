import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeFoodSaturation,
  classifyFoodCompetitor,
} from "../.dist/modulos/intelligence/food-saturation-core/src.js";

test("food-saturation-core classifies sushi competitor", () => {
  const cuisines = classifyFoodCompetitor("Sakura Sushi", "Comida Japonesa");
  assert.equal(cuisines.includes("sushi"), true);
});

test("food-saturation-core builds saturation summary", () => {
  const result = analyzeFoodSaturation([
    { name: "Sakura Sushi", category: "Japonesa" },
    { name: "Dragon Wok", category: "China" },
    { name: "Pizza Nostra", category: "Pizzeria" },
  ]);
  assert.equal(result.total, 3);
  assert.ok(result.oceanoAzul);
  assert.ok(result.oceanoRojo);
});
