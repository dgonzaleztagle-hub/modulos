import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEmploymentContractAnnexOutline,
  buildEmploymentContractOutline,
} from "../.dist/modulos/pdf/employment-contract-outline-core/src.js";

test("employment-contract-outline-core arma contrato base", () => {
  const outline = buildEmploymentContractOutline(
    {
      nombre: "Ana Pérez",
      rut: "11.111.111-1",
      cargo: "Asistente",
      tipo_plazo: "indefinido",
      tipo_jornada: "completa",
      sueldo_base: 700000,
    },
    {
      razon_social: "Empresa Demo SpA",
      rut: "76.123.456-7",
      ciudad: "Santiago",
    },
  );

  assert.equal(outline.title, "Contrato de trabajo");
  assert.ok(outline.sections.some((section) => section.title === "Remuneración y gratificación"));
});

test("employment-contract-outline-core arma anexo de ampliación", () => {
  const outline = buildEmploymentContractAnnexOutline({
    worker: {
      nombre: "Ana Pérez",
      rut: "11.111.111-1",
      cargo: "Asistente",
      fecha_inicio: "2026-01-01",
      fecha_termino_original: "2026-06-01",
    },
    client: {
      razon_social: "Empresa Demo SpA",
      rut: "76.123.456-7",
      representante_legal: "Pedro Soto",
      rut_representante: "12.222.222-2",
      ciudad: "Santiago",
    },
    modificacion: {
      tipo: "ampliacion",
      meses_ampliacion: 3,
      otras_modificaciones: "",
    },
  });

  assert.equal(outline.title, "Anexo de contrato de trabajo");
  assert.match(outline.sections[2].lines[0], /3 meses adicionales/);
});
