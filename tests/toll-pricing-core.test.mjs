import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveTariffTier,
  estimateTollFromCatalog,
} from "../.dist/modulos/delivery/toll-pricing-core/src.js";

const portal = {
  portico_uid: "p1",
  coordenadas: { lat: -33.45, lng: -70.65 },
  tarifas: { baja: 500, media: 800, alta: 1200 },
  horarios: {
    dias_habiles: {
      dias_aplica: ["lunes", "martes", "miercoles", "jueves", "viernes"],
      tramos: {
        alta: ["08:00-09:30"],
        media: ["09:31-19:59"],
        baja: ["00:00-07:59", "20:00-23:59"],
      },
    },
  },
};

test("toll-pricing-core resuelve tramo por horario", () => {
  assert.equal(resolveTariffTier(portal, "2026-04-13", "08:30"), "alta");
  assert.equal(resolveTariffTier(portal, "2026-04-13", "21:00"), "baja");
});

test("toll-pricing-core estima peajes sobre ruta cercana", () => {
  const result = estimateTollFromCatalog({
    portals: [portal],
    routePath: [
      { lat: -33.451, lng: -70.651 },
      { lat: -33.452, lng: -70.652 },
    ],
    scheduledDate: "2026-04-13",
    scheduledTime: "08:30",
    matchToleranceM: 500,
  });

  assert.equal(result?.tollEstimate, 1200);
  assert.deepEqual(result?.matchedPortalUids, ["p1"]);
});
