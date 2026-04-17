export type ReportBuilderCustomizations = {
  showCover: boolean;
  showTechSpecs: boolean;
  showActionPlan: boolean;
  showContentIdeas: boolean;
  tone: "corporate" | "friendly" | "urgent";
};

export function buildReportAssetFilename(reportSourceId: string, timestamp = Date.now()) {
  return `strategy_${String(reportSourceId).replace(/[^a-zA-Z0-9_-]+/g, "_")}_${timestamp}.pdf`;
}

export function buildLeadReportSourceDataPatch(
  sourceData: Record<string, unknown> | null | undefined,
  publicUrl: string,
  generatedAt = new Date().toISOString(),
) {
  return {
    ...(sourceData || {}),
    pdf_url: publicUrl,
    last_generated_pdf: generatedAt,
  };
}

export function buildPrintReportUrl(origin: string, reportId: string) {
  return `${String(origin).replace(/\/+$/, "")}/reporte/${encodeURIComponent(reportId)}/print`;
}

export function buildReportDownloadFilename(reportId: string) {
  return `reporte-territorial-${reportId}.pdf`;
}

export function buildReportDownloadHeaders(reportId: string) {
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${buildReportDownloadFilename(reportId)}"`,
  };
}

export function normalizeReportCustomizations(
  customizations?: Partial<ReportBuilderCustomizations>,
): ReportBuilderCustomizations {
  return {
    showCover: customizations?.showCover ?? true,
    showTechSpecs: customizations?.showTechSpecs ?? true,
    showActionPlan: customizations?.showActionPlan ?? true,
    showContentIdeas: customizations?.showContentIdeas ?? true,
    tone: customizations?.tone ?? "corporate",
  };
}
