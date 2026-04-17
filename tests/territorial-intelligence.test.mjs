import test from "node:test";
import assert from "node:assert/strict";

import {
  getTerritorialQueries,
  buildTerritorialSummary,
} from "../.dist/modulos/geo/territorial-intelligence/src.js";

test("territorial-intelligence arma queries por rubro soportado", () => {
  const bundle = getTerritorialQueries({
    businessType: "restaurant",
    comuna: "Providencia",
    address: "Av. Providencia 123",
  });

  assert.equal(bundle.useSerperScraper, true);
  assert.ok(bundle.specificQueries.length >= 2);
});

test("territorial-intelligence resume conteos y señales", () => {
  const summary = buildTerritorialSummary({
    saturation: "media",
    oceanoAzul: "desayunos",
    oceanoRojo: "sushi",
    restaurants: [{}, {}],
    anchors: [{}],
  });

  assert.equal(summary.restaurantCount, 2);
  assert.equal(summary.anchorCount, 1);
});
