import test from "node:test";
import assert from "node:assert/strict";
import {
  listGrowthPlans,
  getGrowthPlan,
  buildGrowthPlanTasks,
  resolveGrowthHealthTrend,
  summarizeGrowthProgress,
  toggleGrowthModuleState,
} from "../.dist/modulos/crm/growth-plan-core/src.js";

test("growth-plan-core lista planes y genera tareas", () => {
  const plans = listGrowthPlans();
  assert.equal(plans.length, 3);
  assert.equal(getGrowthPlan("velocity").name, "Velocity Engine");

  const tasks = buildGrowthPlanTasks("client-1", "foundation");
  assert.equal(tasks[0].clientId, "client-1");
  assert.equal(tasks[0].status, "pending");
});

test("growth-plan-core resuelve health trend y progreso", () => {
  assert.equal(resolveGrowthHealthTrend({ healthScore: 90, previousHealthScore: 80 }), "up");
  assert.equal(resolveGrowthHealthTrend({ healthScore: 60, previousHealthScore: 80 }), "down");

  const summary = summarizeGrowthProgress([
    { status: "done" },
    { status: "pending" },
    { status: "done" },
  ]);

  assert.deepEqual(summary, { total: 3, completed: 2, progress: 67 });
});

test("growth-plan-core alterna módulos activos", () => {
  const next = toggleGrowthModuleState({ ads: true, seo: false }, "seo");
  assert.deepEqual(next, { ads: true, seo: true });
});
