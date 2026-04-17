export const BILLING_PLAN_VALUES = ["pyme", "pro", "full"] as const;
export type BillingPlan = (typeof BILLING_PLAN_VALUES)[number];
export type TenantPlanState = "trial" | BillingPlan | "premium";

export type PlanLimits = {
  maxProgramChoices: number;
  maxStaff: number;
  maxScheduledCampaigns: number;
  monthlyNotificationRecipients: number;
  exportCsv: boolean;
  analyticsAdvanced: boolean;
};

export const PROGRAM_TYPE_VALUES = [
  "sellos",
  "cashback",
  "multipase",
  "membresia",
  "descuento",
  "cupon",
  "regalo",
  "afiliacion",
] as const;

export type ProgramType = (typeof PROGRAM_TYPE_VALUES)[number];

export const PLAN_CATALOG: Record<BillingPlan, {
  code: BillingPlan;
  label: string;
  monthlyPrice: number;
  description: string;
  limits: PlanLimits;
}> = {
  pyme: {
    code: "pyme",
    label: "Pyme Inicia",
    monthlyPrice: 19990,
    description: "Parte rápido y opera tu fidelización con foco en lo esencial.",
    limits: {
      maxProgramChoices: 1,
      maxStaff: 2,
      maxScheduledCampaigns: 5,
      monthlyNotificationRecipients: 500,
      exportCsv: false,
      analyticsAdvanced: false,
    },
  },
  pro: {
    code: "pro",
    label: "Pro",
    monthlyPrice: 34990,
    description: "Escala tu programa con más motores y herramientas de gestión.",
    limits: {
      maxProgramChoices: 4,
      maxStaff: 8,
      maxScheduledCampaigns: 20,
      monthlyNotificationRecipients: 3000,
      exportCsv: true,
      analyticsAdvanced: true,
    },
  },
  full: {
    code: "full",
    label: "Full",
    monthlyPrice: 99990,
    description: "Desbloquea todo el stack sin límites operativos relevantes.",
    limits: {
      maxProgramChoices: PROGRAM_TYPE_VALUES.length,
      maxStaff: 9999,
      maxScheduledCampaigns: 9999,
      monthlyNotificationRecipients: 999999,
      exportCsv: true,
      analyticsAdvanced: true,
    },
  },
};

export function isBillingPlan(value: unknown): value is BillingPlan {
  return typeof value === "string" && BILLING_PLAN_VALUES.includes(value as BillingPlan);
}

export function isProgramType(value: unknown): value is ProgramType {
  return typeof value === "string" && PROGRAM_TYPE_VALUES.includes(value as ProgramType);
}

export function getEffectiveBillingPlan(tenantPlan: string | null | undefined, selectedPlan: string | null | undefined): BillingPlan {
  if (tenantPlan === "full" || tenantPlan === "pro" || tenantPlan === "pyme") return tenantPlan;
  if (selectedPlan === "full" || selectedPlan === "pro" || selectedPlan === "pyme") return selectedPlan;
  if (tenantPlan === "trial") return "pyme";
  return "pro";
}

export function normalizeProgramChoices(rawChoices: unknown, plan: BillingPlan): ProgramType[] {
  if (plan === "full") return [...PROGRAM_TYPE_VALUES];
  const array = Array.isArray(rawChoices) ? rawChoices : [];
  const unique: ProgramType[] = [];
  for (const item of array) {
    if (!isProgramType(item)) continue;
    if (!unique.includes(item)) unique.push(item);
  }
  const capped = unique.slice(0, PLAN_CATALOG[plan].limits.maxProgramChoices);
  return capped.length > 0 ? capped : ["sellos"];
}

export function isProgramAllowedForPlan(
  programType: string | null | undefined,
  selectedTypes: ProgramType[] | null | undefined,
  plan: BillingPlan,
) {
  if (!programType || !isProgramType(programType)) return false;
  if (plan === "full") return true;
  const available = selectedTypes && selectedTypes.length > 0 ? selectedTypes : ["sellos"];
  return available.includes(programType);
}

export function getFlowPlanId(plan: BillingPlan, acquisitionSource?: string | null) {
  if (plan === "pyme" && acquisitionSource === "agenda") return "vuelve_pyme_agenda_mensual";
  if (plan === "pyme") return "vuelve_pyme_inicia_mensual";
  if (plan === "full") return "vuelve_full_mensual";
  return "vuelve_pro_mensual";
}
