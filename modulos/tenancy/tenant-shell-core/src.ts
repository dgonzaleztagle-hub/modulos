export interface TenantShellTenant {
  slug: string;
  nombre?: string | null;
  logo_url?: string | null;
  plan?: string | null;
  is_active?: boolean;
  plan_expires_at?: string | null;
}

export interface TenantShellConfig {
  app_name?: string | null;
  logo_url?: string | null;
  logo_dark_url?: string | null;
  favicon_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  footer_text?: string | null;
  responsable_nombre?: string | null;
  responsable_titulo?: string | null;
}

export interface TenantShellBranding {
  logoUrl: string | null;
  logoDarkUrl: string | null;
  appName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  footerText: string | null;
  responsableNombre: string | null;
  responsableTitulo: string;
  faviconUrl: string | null;
}

export interface TenantShellStatus {
  isExpired: boolean;
  isPaidPlan: boolean;
  isPlanExpiring: boolean;
  isFreeAccount: boolean;
  daysRemaining: number | null;
}

const DEFAULT_APP_NAME = "Mi Oficina Contable";
const DEFAULT_TITULO = "Contador";

export function isPaidTenantPlan(plan?: string | null): boolean {
  const normalized = String(plan || "").trim().toLowerCase();
  if (!normalized) return false;
  return ["ilimitado", "enterprise", "empresa", "profesional", "basico", "pro", "premium"].includes(normalized);
}

export function resolveTenantShellBranding(input: {
  tenant?: TenantShellTenant | null;
  config?: TenantShellConfig | null;
}): TenantShellBranding {
  const tenant = input.tenant;
  const config = input.config;
  return {
    logoUrl: config?.logo_url || tenant?.logo_url || null,
    logoDarkUrl: config?.logo_dark_url || null,
    appName: config?.app_name || tenant?.nombre || DEFAULT_APP_NAME,
    contactEmail: config?.contact_email || null,
    contactPhone: config?.contact_phone || null,
    footerText: config?.footer_text || null,
    responsableNombre: config?.responsable_nombre || null,
    responsableTitulo: config?.responsable_titulo || DEFAULT_TITULO,
    faviconUrl: config?.favicon_url || null,
  };
}

export function buildTenantPath(path: string, slug?: string | null): string {
  if (!slug) return path;
  if (path.startsWith(`/${slug}`)) return path;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/${slug}/${cleanPath}`;
}

export function calculateTenantShellStatus(tenant?: TenantShellTenant | null, now = new Date()): TenantShellStatus {
  const isPaidPlan = isPaidTenantPlan(tenant?.plan);
  const isFreeAccount = !isPaidPlan;

  if (tenant && tenant.is_active === false) {
    return {
      isExpired: true,
      isPaidPlan,
      isPlanExpiring: false,
      isFreeAccount,
      daysRemaining: null,
    };
  }

  if (isPaidPlan) {
    const expiresAt = tenant?.plan_expires_at ? new Date(tenant.plan_expires_at) : null;
    if (expiresAt && now > expiresAt) {
      return {
        isExpired: true,
        isPaidPlan: true,
        isPlanExpiring: false,
        isFreeAccount: false,
        daysRemaining: 0,
      };
    }

    const daysRemaining =
      expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

    return {
      isExpired: false,
      isPaidPlan: true,
      isPlanExpiring: daysRemaining != null && daysRemaining <= 7,
      isFreeAccount: false,
      daysRemaining,
    };
  }

  return {
    isExpired: false,
    isPaidPlan: false,
    isPlanExpiring: false,
    isFreeAccount: true,
    daysRemaining: null,
  };
}
