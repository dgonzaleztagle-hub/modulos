import test from "node:test";
import assert from "node:assert/strict";

import {
  createLandingConfig,
  getVisibleLandingSections,
  reorderLandingSections,
  updateLandingSectionContent,
} from "../.dist/modulos/factory/landing-factory-core/src.js";

test("landing-factory-core creates config and updates content", () => {
  let config = createLandingConfig({ slug: "demo", title: "Demo" });
  config = updateLandingSectionContent(config, "hero_1", "title", "Nuevo Hero");

  assert.equal(config.sections[0].content.title, "Nuevo Hero");
  assert.ok(getVisibleLandingSections(config).length > 0);
});

test("landing-factory-core reorders sections", () => {
  const config = createLandingConfig({ slug: "demo", title: "Demo" });
  const reordered = reorderLandingSections(config, [...config.sections].reverse());
  assert.equal(reordered.sections[0].id, config.sections[config.sections.length - 1].id);
});
