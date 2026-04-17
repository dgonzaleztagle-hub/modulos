export type TenantHostRoutingOptions = {
  ignoredSubdomains?: string[];
  baseDomain?: string;
  ignoreLocalhost?: boolean;
  ignoreVercelPreview?: boolean;
};

export function getTenantFromHost(
  host: string | null,
  options?: TenantHostRoutingOptions,
) {
  if (!host) return null;

  const lower = host.toLowerCase();
  const ignoredSubdomains = options?.ignoredSubdomains || ['www'];
  const baseDomain = options?.baseDomain || 'superpanel.lat';
  const ignoreLocalhost = options?.ignoreLocalhost ?? true;
  const ignoreVercelPreview = options?.ignoreVercelPreview ?? true;

  if (ignoreVercelPreview && lower.endsWith('.vercel.app')) return null;
  if (ignoreLocalhost && lower.includes('localhost')) return null;

  const parts = lower.split('.');
  if (parts.length < 3) return null;

  const maybeSub = parts[0];
  if (ignoredSubdomains.includes(maybeSub)) return null;

  const domain = parts.slice(1).join('.');
  if (domain !== baseDomain) return null;

  return maybeSub;
}

export function isAllowedCorsOrigin(
  origin: string | null,
  allowedOrigins: string[],
) {
  if (!origin) return false;
  return allowedOrigins.includes(origin);
}

export function shouldRewriteTenantHome(tenant: string | null, pathname: string) {
  return Boolean(tenant && pathname === '/');
}
