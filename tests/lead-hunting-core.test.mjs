import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLeadSearchPayload,
  normalizeLead,
  scoreLeadPriority,
} from "../.dist/modulos/crm/lead-hunting-core/src.js";

test("lead-hunting-core builds search payload with category defaults", () => {
  const payload = buildLeadSearchPayload({
    categoria: "truckpos",
    zona: "Lampa",
    radioKm: 5,
  });

  assert.equal(payload.radio_km, 5);
  assert.match(payload.query, /food truck/i);
});

test("lead-hunting-core normalizes and scores a lead", () => {
  const lead = normalizeLead({
    nombre: "Cafe Norte",
    categoria: "cafe",
    zona_busqueda: "Quilicura",
    fuente: "google_maps",
    rating: 4.5,
    reviews: 120,
  });

  assert.equal(lead.nombre, "Cafe Norte");
  assert.ok(scoreLeadPriority(lead, {
    puntajeOportunidad: 50,
    estadoWeb: "sin_web",
    razonIA: "",
    serviciosSugeridos: [],
    senalesOportunidad: [],
  }) > 50);
});
