export interface TenantLimitInput {
  plan?: string | null;
  configuredMax?: number | null;
  currentCount?: number | null;
  freeMax?: number;
}

export interface TenantLimitResolution {
  isFreePlan: boolean;
  maxAllowed: number | null;
  currentCount: number;
  canAdd: boolean;
  remaining: number | null;
}

const PAID_PLAN_TOKENS = new Set([
  "paid",
  "pro",
  "premium",
  "empresa",
  "business",
  "growth",
  "anual",
  "mensual",
]);

export function isPaidTenantPlan(plan?: string | null): boolean {
  const normalized = String(plan || "").trim().toLowerCase();
  if (!normalized) return false;
  return [...PAID_PLAN_TOKENS].some((token) => normalized.includes(token));
}

export function resolveTenantLimit(input: TenantLimitInput): TenantLimitResolution {
  const currentCount = Number.isFinite(Number(input.currentCount)) ? Number(input.currentCount) : 0;
  const isFreePlan = !isPaidTenantPlan(input.plan);
  const freeMax = input.freeMax ?? 3;
  const configuredMax = input.configuredMax == null ? null : Number(input.configuredMax);
  const maxAllowed = isFreePlan ? freeMax : configuredMax;
  const canAdd = maxAllowed == null || maxAllowed === 0 || currentCount < maxAllowed;
  const remaining =
    maxAllowed == null || maxAllowed === 0 ? null : Math.max(0, maxAllowed - currentCount);

  return {
    isFreePlan,
    maxAllowed,
    currentCount,
    canAdd,
    remaining,
  };
}
