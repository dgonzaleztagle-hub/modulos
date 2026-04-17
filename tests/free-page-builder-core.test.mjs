import test from "node:test";
import assert from "node:assert/strict";

import {
  addBuilderItem,
  createBuilderDocument,
  createEmptyHistory,
  deviceScale,
  exportBuilderJson,
  importBuilderJson,
  moveBuilderItem,
  pushHistory,
  redoBuilder,
  removeBuilderItem,
  reorderBuilderLayer,
  undoBuilder,
  updateBuilderItem,
  updateCanvasSettings,
} from "../.dist/modulos/factory/free-page-builder-core/src.js";

test("free-page-builder-core creates a portable document", () => {
  const document = createBuilderDocument();

  assert.equal(document.version, "1");
  assert.ok(document.items.length >= 2);
  assert.equal(document.canvas.background, "#000000");
});

test("free-page-builder-core adds, updates and removes items", () => {
  let document = createBuilderDocument({ items: [] });
  document = addBuilderItem(document, "text", { x: 10, y: 20 }, "hero-title");
  document = updateBuilderItem(document, "hero-title", {
    content: { text: "Hola" },
    style: { fontSize: "32px" },
  });
  document = moveBuilderItem(document, "hero-title", 80, 120);

  assert.equal(document.items[0].content.text, "Hola");
  assert.equal(document.items[0].position.x, 80);

  document = removeBuilderItem(document, "hero-title");
  assert.equal(document.items.length, 0);
});

test("free-page-builder-core keeps history with undo and redo", () => {
  let document = createBuilderDocument({ items: [] });
  let history = createEmptyHistory();

  history = pushHistory(history, document);
  document = addBuilderItem(document, "button", { x: 0, y: 0 }, "cta");

  const undone = undoBuilder(history, document);
  assert.equal(undone.document.items.length, 0);

  const redone = redoBuilder(undone.history, undone.document);
  assert.equal(redone.document.items[0].id, "cta");
});

test("free-page-builder-core imports and exports JSON safely", () => {
  const raw = JSON.stringify([
    {
      type: "text",
      position: { x: 5, y: 6 },
      size: { width: 300, height: "auto" },
      content: { text: "Desde IA" },
      style: { zIndex: 4 },
    },
  ]);

  const document = importBuilderJson(raw);
  const exported = exportBuilderJson(document);

  assert.equal(document.items[0].type, "text");
  assert.equal(document.items[0].content.text, "Desde IA");
  assert.ok(exported.includes("Desde IA"));
});

test("free-page-builder-core updates canvas and layers", () => {
  let document = createBuilderDocument({ items: [] });
  document = addBuilderItem(document, "text", { x: 0, y: 0 }, "a");
  document = addBuilderItem(document, "text", { x: 0, y: 40 }, "b");
  document = reorderBuilderLayer(document, "a", "front");
  document = updateCanvasSettings(document, { background: "#111111", gridEnabled: false });

  const a = document.items.find((item) => item.id === "a");
  assert.equal(document.canvas.gridEnabled, false);
  assert.equal(document.canvas.background, "#111111");
  assert.ok(Number(a.style.zIndex) > 0);
});

test("free-page-builder-core returns expected device scales", () => {
  assert.equal(deviceScale("desktop"), 1);
  assert.equal(deviceScale("tablet"), 768 / 1200);
  assert.equal(deviceScale("mobile"), 340 / 1200);
});
