import test from "node:test";
import assert from "node:assert/strict";

import {
  formatPrice,
  getCurrencyDecimals,
  getCurrencyStep,
} from "../.dist/modulos/payments/currency-format-core/src.js";

test("currency-format-core resuelve decimales y step", () => {
  assert.equal(getCurrencyDecimals("CLP"), 0);
  assert.equal(getCurrencyStep("USD"), "0.01");
  assert.match(formatPrice(1000, "CLP"), /\$/);
});
