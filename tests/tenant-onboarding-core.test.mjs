import test from "node:test";
import assert from "node:assert/strict";
import {
  generateTenantSlug,
  normalizeTenantSlug,
  validateTenantAccountStep,
  validateTenantBusinessStep,
  buildTenantRegistrationPayload,
  canSubmitTenantRegistration,
} from "../.dist/modulos/tenancy/tenant-onboarding-core/src.js";

test("tenant-onboarding-core genera y normaliza slug", () => {
  assert.equal(generateTenantSlug("Estudio Contable Ñandú"), "estudio-contable-nandu");
  assert.equal(normalizeTenantSlug("Plus_Contable!"), "pluscontable");
});

test("tenant-onboarding-core valida cuenta y empresa", () => {
  const accountErrors = validateTenantAccountStep({
    email: "bad-email",
    password: "123",
    confirmPassword: "1234",
    fullName: "",
    empresaNombre: "",
    empresaRut: "",
    slug: "",
  });
  assert.equal(accountErrors.email, "Email inválido");
  assert.equal(accountErrors.password, "Mínimo 6 caracteres");

  const businessErrors = validateTenantBusinessStep({
    email: "ok@test.com",
    password: "123456",
    confirmPassword: "123456",
    fullName: "Ana",
    empresaNombre: "",
    empresaRut: "",
    slug: "ab",
  }, { slugAvailable: false });
  assert.equal(businessErrors.slug, "El slug debe tener al menos 3 caracteres");
});

test("tenant-onboarding-core arma payload y submit gate", () => {
  const formData = {
    email: "ana@test.com",
    password: "123456",
    confirmPassword: "123456",
    fullName: "Ana",
    empresaNombre: "Plus Contable",
    empresaRut: "12.345.678-5",
    slug: "Plus-Contable",
    acceptTerms: true,
  };
  const payload = buildTenantRegistrationPayload(formData);
  assert.equal(payload.slug, "plus-contable");
  assert.equal(canSubmitTenantRegistration(formData), true);
});
