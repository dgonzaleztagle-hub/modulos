export type GrowthPlanTaskTemplate = {
  title: string;
  category: string;
  isRecurring: boolean;
  recurrence?: "weekly" | "monthly";
};

export type GrowthPlanId = "foundation" | "velocity" | "dominance";

export type GrowthClientProfile = {
  id: string;
  clientName: string;
  website: string;
  planTier: string;
  healthScore: number;
  previousHealthScore?: number;
  nextAuditDate?: string;
  activeModules?: Record<string, boolean>;
};

export type GrowthTask = {
  id: string;
  clientId: string;
  title: string;
  category: string;
  status: "pending" | "done";
  recurrence: null | { type: "weekly" | "monthly" };
  isEnabled: boolean;
};

export const GROWTH_PLANS: Record<GrowthPlanId, { name: string; tasks: GrowthPlanTaskTemplate[] }> = {
  foundation: {
    name: "Foundation Protocol",
    tasks: [
      { title: "Configurar Google Analytics 4", category: "Setup", isRecurring: false },
      { title: "Configurar Google Search Console", category: "SEO", isRecurring: false },
      { title: "Verificar Google My Business", category: "SEO", isRecurring: false },
      { title: "Instalar Meta Pixel", category: "Setup", isRecurring: false },
      { title: "Optimizar Títulos y Metas (Home)", category: "SEO", isRecurring: false },
    ],
  },
  velocity: {
    name: "Velocity Engine",
    tasks: [
      { title: "Auditoría Mensual de Campañas", category: "Ads", isRecurring: true, recurrence: "monthly" },
      { title: "Crear 4 Anuncios Nuevos (A/B Test)", category: "Ads", isRecurring: true, recurrence: "monthly" },
      { title: "Reporte de Rendimiento Mensual", category: "Reporting", isRecurring: true, recurrence: "monthly" },
      { title: "Optimizar Landing Page Principal", category: "CRO", isRecurring: false },
      { title: "Secuencia de Email (Bienvenida)", category: "Email", isRecurring: false },
    ],
  },
  dominance: {
    name: "Dominance Matrix",
    tasks: [
      { title: "Reunión de Estrategia Quincenal", category: "Strategy", isRecurring: true, recurrence: "weekly" },
      { title: "Producción de 4 Videos Cortos", category: "Content", isRecurring: true, recurrence: "monthly" },
      { title: "Redacción Artículo SEO \"Power Page\"", category: "Content", isRecurring: true, recurrence: "monthly" },
      { title: "Optimización CRM & Lead Scoring", category: "CRM", isRecurring: false },
      { title: "Configurar Server-Side Tracking (CAPI)", category: "Dev", isRecurring: false },
    ],
  },
};

export function listGrowthPlans() {
  return Object.entries(GROWTH_PLANS).map(([id, plan]) => ({
    id: id as GrowthPlanId,
    name: plan.name,
    taskCount: plan.tasks.length,
  }));
}

export function getGrowthPlan(planId: GrowthPlanId) {
  return GROWTH_PLANS[planId];
}

export function buildGrowthPlanTasks(clientId: string, planId: GrowthPlanId) {
  const plan = getGrowthPlan(planId);
  return plan.tasks.map<GrowthTask>((task, index) => ({
    id: `${planId}-${index + 1}`,
    clientId,
    title: task.title,
    category: task.category,
    status: "pending",
    recurrence: task.isRecurring && task.recurrence ? { type: task.recurrence } : null,
    isEnabled: true,
  }));
}

export function resolveGrowthHealthTrend(client: Pick<GrowthClientProfile, "healthScore" | "previousHealthScore">) {
  const previous = client.previousHealthScore;
  if (typeof previous !== "number") return "stable";
  if (client.healthScore > previous) return "up";
  if (client.healthScore < previous) return "down";
  return "stable";
}

export function summarizeGrowthProgress(tasks: Array<Pick<GrowthTask, "status">>) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, progress };
}

export function toggleGrowthModuleState(activeModules: Record<string, boolean>, moduleKey: string) {
  return {
    ...activeModules,
    [moduleKey]: !activeModules[moduleKey],
  };
}
