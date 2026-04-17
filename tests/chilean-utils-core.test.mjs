import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanRut,
  calculateRutDV,
  validateRut,
  formatRut,
  parseUfValue,
  clpToUf,
  ufToClp,
  formatCLP,
  formatUF,
  formatUFWithCLP,
  REGIONES_CHILE,
} from "../.dist/modulos/ops/chilean-utils-core/src.js";

test("chilean-utils-core limpia valida y formatea RUT", () => {
  assert.equal(cleanRut("12.345.678-k"), "12345678K");
  assert.equal(calculateRutDV("12345678-5"), "5");
  assert.equal(validateRut("12.345.678-5"), true);
  assert.equal(formatRut("123456785"), "12.345.678-5");
  assert.equal(formatRut("123456785", { dotted: false }), "12345678-5");
});

test("chilean-utils-core parsea UF y convierte montos", () => {
  assert.equal(parseUfValue("38.123,45"), 38123.45);
  assert.equal(Math.round(clpToUf(38123.45, 38123.45)), 1);
  assert.equal(Math.round(ufToClp(2, 38123.45)), 76247);
  assert.match(formatCLP(10000), /\$/);
  assert.match(formatUF(1.5), /UF/);
  assert.match(formatUFWithCLP(1, 38123.45), /38\.123/);
});

test("chilean-utils-core expone regiones base", () => {
  assert.equal(REGIONES_CHILE.find((region) => region.code === "RM").name, "Metropolitana de Santiago");
});
