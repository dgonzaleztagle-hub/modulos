export type TenantRegistrationForm = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  empresaNombre: string;
  empresaRut: string;
  slug: string;
  acceptTerms?: boolean;
};

export function generateTenantSlug(name: string) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

export function normalizeTenantSlug(value: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function validateTenantAccountStep(formData: TenantRegistrationForm) {
  const errors: Record<string, string> = {};

  if (!formData.email) errors.email = "El email es requerido";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Email inválido";

  if (!formData.password) errors.password = "La contraseña es requerida";
  else if (formData.password.length < 6) errors.password = "Mínimo 6 caracteres";

  if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
  if (!formData.fullName) errors.fullName = "El nombre es requerido";

  return errors;
}

export function validateTenantBusinessStep(
  formData: TenantRegistrationForm,
  options?: { slugAvailable?: boolean | null },
) {
  const errors: Record<string, string> = {};

  if (!formData.empresaNombre) errors.empresaNombre = "El nombre de la empresa es requerido";
  if (!formData.empresaRut) errors.empresaRut = "El RUT es requerido";

  if (!formData.slug || formData.slug.length < 3) errors.slug = "El slug debe tener al menos 3 caracteres";
  else if (options?.slugAvailable === false) errors.slug = "Este slug ya está en uso";

  return errors;
}

export function buildTenantRegistrationPayload(formData: TenantRegistrationForm) {
  return {
    email: formData.email,
    password: formData.password,
    fullName: formData.fullName,
    empresaNombre: formData.empresaNombre,
    empresaRut: formData.empresaRut,
    slug: normalizeTenantSlug(formData.slug),
  };
}

export function canSubmitTenantRegistration(formData: TenantRegistrationForm) {
  return Boolean(formData.acceptTerms);
}
