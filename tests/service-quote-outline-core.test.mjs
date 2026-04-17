import test from "node:test";
import assert from "node:assert/strict";

import { buildServiceQuoteOutline } from "../.dist/modulos/pdf/service-quote-outline-core/src.js";

test("service-quote-outline-core arma propuesta y recalcula totales", () => {
  const outline = buildServiceQuoteOutline(
    {
      numero: 12,
      prospecto: {
        nombre: "Cliente Demo",
        rut: "76.123.456-7",
        email: "cliente@demo.cl",
      },
      contenidoHtml: "<h2>Alcance</h2><p>Implementación base.</p><ul><li>Setup</li></ul>",
      items: [
        { descripcion: "Setup", monto: 100000, esAfecto: true },
        { descripcion: "Capacitación", monto: 50000, esAfecto: false },
      ],
      fechaEmision: "2026-04-16",
      fechaValidez: "2026-04-30",
    },
    { appName: "MODULOS Demo" },
  );

  assert.equal(outline.metadata.numberLabel, "N° 0012");
  assert.equal(outline.totals.total, 169000);
  assert.ok(outline.sections.some((section) => section.title === "Propuesta de servicios"));
});
