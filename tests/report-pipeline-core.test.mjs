import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReportAssetFilename,
  buildLeadReportSourceDataPatch,
  buildPrintReportUrl,
  buildReportDownloadFilename,
  buildReportDownloadHeaders,
  normalizeReportCustomizations,
} from "../.dist/modulos/ops/report-pipeline-core/src.js";

test("report-pipeline-core arma nombres y urls", () => {
  assert.equal(buildReportAssetFilename("lead-1", 12345), "strategy_lead-1_12345.pdf");
  assert.equal(buildPrintReportUrl("https://hojacero.cl/", "abc-1"), "https://hojacero.cl/reporte/abc-1/print");
  assert.equal(buildReportDownloadFilename("abc-1"), "reporte-territorial-abc-1.pdf");
});

test("report-pipeline-core arma headers y patch source_data", () => {
  const patch = buildLeadReportSourceDataPatch({ foo: "bar" }, "https://cdn/report.pdf", "2026-04-16T00:00:00Z");
  assert.equal(patch.pdf_url, "https://cdn/report.pdf");
  assert.equal(patch.foo, "bar");

  const headers = buildReportDownloadHeaders("abc-1");
  assert.equal(headers["Content-Type"], "application/pdf");
  assert.match(headers["Content-Disposition"], /abc-1/);
});

test("report-pipeline-core normaliza customizaciones", () => {
  const config = normalizeReportCustomizations({ showCover: false, tone: "urgent" });
  assert.equal(config.showCover, false);
  assert.equal(config.showTechSpecs, true);
  assert.equal(config.tone, "urgent");
});
