import test from "node:test";
import assert from "node:assert/strict";

import {
  getBookingRubroConfig,
  getBookingRubroConfigOrDefault,
  normalizeRubroName,
} from "../.dist/modulos/booking/booking-rubro-config-core/src.js";

test("booking-rubro-config normalizes accented rubros", () => {
  assert.equal(normalizeRubroName("Estética "), "estetica");
  assert.equal(getBookingRubroConfig("Centro Estético")?.label, "Estética");
});

test("booking-rubro-config returns default config when no rubro matches", () => {
  const config = getBookingRubroConfigOrDefault("Cerrajería");
  assert.equal(config.label, "Servicio");
});
