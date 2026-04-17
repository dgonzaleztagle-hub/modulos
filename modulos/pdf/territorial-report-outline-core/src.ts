export interface TerritorialAnalysisBlock {
  [key: string]: unknown;
}

export interface TerritorialReportInput {
  address?: string;
  businessType?: string;
  mapUrl?: string;
  analysis?: {
    ecosistema?: TerritorialAnalysisBlock;
    demografia?: TerritorialAnalysisBlock;
    flujos?: TerritorialAnalysisBlock;
    competencia?: TerritorialAnalysisBlock;
    veredicto?: TerritorialAnalysisBlock;
    digital?: TerritorialAnalysisBlock;
  };
}

export interface TerritorialReportSection {
  title: string;
  subtitle?: string;
  lines: string[];
}

function pickLines(block?: TerritorialAnalysisBlock): string[] {
  if (!block) return [];
  return Object.entries(block)
    .filter(([key, value]) => key !== "titulo" && typeof value === "string" && value.trim())
    .map(([, value]) => value as string);
}

export function buildTerritorialReportOutline(input: TerritorialReportInput): TerritorialReportSection[] {
  const sections: TerritorialReportSection[] = [
    {
      title: "Portada",
      subtitle: "Reporte de inteligencia territorial",
      lines: [
        `Ubicación: ${input.address || "N/A"}`,
        `Proyecto evaluado: ${input.businessType || "N/A"}`,
        `Mapa disponible: ${input.mapUrl ? "sí" : "no"}`,
      ],
    },
  ];

  if (input.analysis?.ecosistema) {
    sections.push({
      title: "Ecosistema",
      subtitle: "Contexto del barrio",
      lines: pickLines(input.analysis.ecosistema),
    });
  }

  if (input.analysis?.demografia) {
    sections.push({
      title: "Demografía",
      subtitle: "Cliente objetivo",
      lines: pickLines(input.analysis.demografia),
    });
  }

  if (input.analysis?.flujos) {
    sections.push({
      title: "Flujos y visibilidad",
      subtitle: "Tráfico y polos de atracción",
      lines: pickLines(input.analysis.flujos),
    });
  }

  if (input.analysis?.competencia) {
    sections.push({
      title: "Competencia",
      subtitle: "Scan de mercado",
      lines: pickLines(input.analysis.competencia),
    });
  }

  if (input.analysis?.veredicto) {
    sections.push({
      title: "Veredicto",
      subtitle: "Conclusión HojaCero",
      lines: pickLines(input.analysis.veredicto),
    });
  }

  if (input.analysis?.digital) {
    sections.push({
      title: "Recomendación digital",
      subtitle: "Plan de ataque",
      lines: pickLines(input.analysis.digital),
    });
  }

  return sections;
}
