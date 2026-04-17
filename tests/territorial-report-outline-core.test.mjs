import test from "node:test";
import assert from "node:assert/strict";

import { buildTerritorialReportOutline } from "../.dist/modulos/pdf/territorial-report-outline-core/src.js";

test("territorial-report-outline-core arma secciones desde analysis", () => {
  const outline = buildTerritorialReportOutline({
    address: "Providencia 123",
    businessType: "Sushi",
    analysis: {
      ecosistema: { dinamica: "Barrio mixto", conectividad: "Metro cercano" },
      veredicto: { resumen: "Zona viable", estrategia_recomendada: "Delivery first" },
    },
  });

  assert.equal(outline[0].title, "Portada");
  assert.ok(outline.some((section) => section.title === "Ecosistema"));
  assert.ok(outline.some((section) => section.title === "Veredicto"));
});
