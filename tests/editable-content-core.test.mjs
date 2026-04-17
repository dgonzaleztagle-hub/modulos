import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveEditableContent,
  applyContentPatch,
  validateContentSaveRequest,
} from "../.dist/modulos/cms/editable-content-core/src.js";

test("editable-content-core resuelve valor existente o fallback", () => {
  assert.equal(resolveEditableContent({ hero: "Hola" }, { id: "hero", type: "text" }), "Hola");
  assert.equal(resolveEditableContent({}, { id: "hero", type: "text", fallback: "Default" }), "Default");
});

test("editable-content-core aplica patch sin perder contenido previo", () => {
  const result = applyContentPatch({ hero: "Hola" }, "cta", "Comprar");
  assert.deepEqual(result, { hero: "Hola", cta: "Comprar" });
});

test("editable-content-core valida request con data objeto", () => {
  assert.deepEqual(validateContentSaveRequest({ data: { ok: true } }), []);
  assert.ok(validateContentSaveRequest({ data: null }).length > 0);
});
