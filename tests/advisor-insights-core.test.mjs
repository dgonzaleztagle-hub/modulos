import test from "node:test";
import assert from "node:assert/strict";

import { generateAdvisorInsights } from "../.dist/modulos/crm/advisor-insights-core/src.js";

test("advisor-insights-core detecta retención baja y VIP", () => {
  const insights = generateAdvisorInsights(
    {
      tasaRetencion: 30,
      totalReferidos: 1,
      totalClientes: 60,
      totalPremiosCanjeados: 1,
    },
    [{ nombre: "Ana", totalPuntosHistoricos: 40 }],
  );

  assert.ok(insights.some((item) => item.title === "Alerta de Retención"));
  assert.ok(insights.some((item) => item.title.includes("Ocasión VIP")));
});
