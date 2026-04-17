import test from "node:test";
import assert from "node:assert/strict";

import {
  validateDocumentPayload,
  buildDocumentOutline,
  normalizeDocumentBranding,
} from "../.dist/modulos/pdf/tenant-branded-documents/src.js";

test("tenant-branded-documents valida payload mínimo", () => {
  const errors = validateDocumentPayload({
    title: "Contrato",
    branding: { appName: "MODULOS" },
    sections: [{ body: "Contenido" }],
  });

  assert.deepEqual(errors, []);
});

test("tenant-branded-documents normaliza branding y arma outline", () => {
  const branding = normalizeDocumentBranding({
    appName: " MODULOS ",
    supportEmail: " SOporte@Test.CL ",
    responsableNombre: " Daniel ",
  });
  const outline = buildDocumentOutline({
    title: "Reporte",
    branding,
    sections: [{ title: "Resumen", rows: [{ label: "A", value: "B" }] }],
  });

  assert.equal(branding.appName, "MODULOS");
  assert.equal(branding.supportEmail, "soporte@test.cl");
  assert.equal(outline.signature?.name, "Daniel");
});
