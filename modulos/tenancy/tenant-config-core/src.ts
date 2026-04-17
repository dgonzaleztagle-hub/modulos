export interface TenantIdentity {
  id: string;
  slug?: string;
  name: string;
  plan?: string | null;
  status?: string | null;
}

export interface TenantBranding {
  appName?: string;
  logoUrl?: string | null;
  iconUrl?: string | null;
  primaryColor?: string | null;
  supportEmail?: string | null;
}

export interface TenantLimits {
  [key: string]: number | boolean | null | undefined;
}

export interface TenantFeatureMap {
  [feature: string]: boolean;
}

export interface TenantRuntimeConfig {
  tenant: TenantIdentity;
  branding: TenantBranding;
  features: TenantFeatureMap;
  limits: TenantLimits;
}

export function normalizeTenantIdentity(input: TenantIdentity): TenantIdentity {
  return {
    ...input,
    slug: normalizeTenantSlug(input.slug || input.name),
    plan: input.plan ?? null,
    status: input.status ?? "active",
  };
}

export function mergeTenantBranding(
  defaults: TenantBranding,
  overrides?: TenantBranding | null,
): TenantBranding {
  return {
    ...defaults,
    ...(cleanObject(overrides) as Partial<TenantBranding>),
  };
}

export function mergeTenantFeatures(
  defaults: TenantFeatureMap,
  overrides?: Record<string, boolean> | null,
): TenantFeatureMap {
  return {
    ...defaults,
    ...(overrides || {}),
  };
}

export function mergeTenantLimits(
  defaults: TenantLimits,
  overrides?: TenantLimits | null,
): TenantLimits {
  return {
    ...defaults,
    ...(cleanObject(overrides) as TenantLimits),
  };
}

export function isFeatureEnabled(
  features: TenantFeatureMap,
  feature: string,
  fallback = false,
): boolean {
  return features[feature] ?? fallback;
}

export function pickEnabledFeatures(features: TenantFeatureMap): string[] {
  return Object.entries(features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature)
    .sort();
}

export function isTenantActive(tenant: TenantIdentity): boolean {
  return !tenant.status || tenant.status === "active" || tenant.status === "trialing";
}

export function resolveRuntimeConfig(input: {
  tenant: TenantIdentity;
  brandingDefaults?: TenantBranding;
  brandingOverrides?: TenantBranding | null;
  featureDefaults?: TenantFeatureMap;
  featureOverrides?: TenantFeatureMap | null;
  limitDefaults?: TenantLimits;
  limitOverrides?: TenantLimits | null;
}): TenantRuntimeConfig {
  return {
    tenant: normalizeTenantIdentity(input.tenant),
    branding: mergeTenantBranding(input.brandingDefaults || {}, input.brandingOverrides),
    features: mergeTenantFeatures(input.featureDefaults || {}, input.featureOverrides),
    limits: mergeTenantLimits(input.limitDefaults || {}, input.limitOverrides),
  };
}

export function normalizeTenantSlug(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function cleanObject<T extends object | null | undefined>(value: T): Partial<NonNullable<T>> {
  if (!value) return {} as Partial<NonNullable<T>>;

  return Object.fromEntries(
    Object.entries(value).filter(([, candidate]) => candidate !== undefined),
  ) as Partial<NonNullable<T>>;
}
