export interface ServiceQuoteItem {
  descripcion: string;
  monto: number;
  esAfecto?: boolean;
}

export interface ServiceQuoteParty {
  nombre: string;
  rut: string;
  email?: string;
  telefono?: string;
}

export interface ServiceQuoteBranding {
  appName?: string;
  contactEmail?: string;
  contactPhone?: string;
  responsableNombre?: string;
  responsableTitulo?: string;
}

export interface ServiceQuoteData {
  numero: number;
  prospecto: ServiceQuoteParty;
  contenidoHtml?: string;
  items: ServiceQuoteItem[];
  subtotalAfecto?: number;
  subtotalExento?: number;
  iva?: number;
  total?: number;
  fechaEmision: string;
  fechaValidez: string;
}

export interface OutlineSection {
  title: string;
  lines: string[];
}

export interface ServiceQuoteOutline {
  title: string;
  metadata: {
    numberLabel: string;
    issuer: string | null;
    emissionDate: string;
    validityDate: string;
  };
  totals: {
    subtotalAfecto: number;
    subtotalExento: number;
    iva: number;
    total: number;
  };
  sections: OutlineSection[];
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-CL");
}

function sanitizeTextBlock(html?: string): string[] {
  if (!html) return [];

  return html
    .replace(/<\/(p|h2|h3|li)>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function inferTotals(data: ServiceQuoteData) {
  const subtotalAfecto =
    data.subtotalAfecto ?? data.items.filter((item) => item.esAfecto).reduce((sum, item) => sum + item.monto, 0);
  const subtotalExento =
    data.subtotalExento ?? data.items.filter((item) => !item.esAfecto).reduce((sum, item) => sum + item.monto, 0);
  const iva = data.iva ?? Math.round(subtotalAfecto * 0.19);
  const total = data.total ?? subtotalAfecto + subtotalExento + iva;

  return { subtotalAfecto, subtotalExento, iva, total };
}

export function buildServiceQuoteOutline(
  data: ServiceQuoteData,
  branding?: ServiceQuoteBranding,
): ServiceQuoteOutline {
  const totals = inferTotals(data);

  return {
    title: "Cotización de servicios",
    metadata: {
      numberLabel: `N° ${String(data.numero).padStart(4, "0")}`,
      issuer: branding?.appName ?? null,
      emissionDate: formatDate(data.fechaEmision),
      validityDate: formatDate(data.fechaValidez),
    },
    totals,
    sections: [
      {
        title: "Dirigido a",
        lines: [
          data.prospecto.nombre,
          `RUT: ${data.prospecto.rut}`,
          ...[data.prospecto.email, data.prospecto.telefono].filter(Boolean) as string[],
        ],
      },
      {
        title: "Propuesta de servicios",
        lines: sanitizeTextBlock(data.contenidoHtml),
      },
      {
        title: "Detalle valorizado",
        lines: data.items.map((item) => {
          const taxLabel = item.esAfecto ? "afecto" : "exento";
          return `${item.descripcion}: $${item.monto.toLocaleString("es-CL")} (${taxLabel})`;
        }),
      },
      {
        title: "Resumen económico",
        lines: [
          `Subtotal afecto: $${totals.subtotalAfecto.toLocaleString("es-CL")}`,
          `Subtotal exento: $${totals.subtotalExento.toLocaleString("es-CL")}`,
          `IVA: $${totals.iva.toLocaleString("es-CL")}`,
          `Total: $${totals.total.toLocaleString("es-CL")}`,
        ],
      },
      {
        title: "Emisor",
        lines: [
          branding?.appName ? `Emitido por ${branding.appName}` : "Emitido por tenant configurado",
          ...(branding?.contactEmail ? [`Correo: ${branding.contactEmail}`] : []),
          ...(branding?.contactPhone ? [`Teléfono: ${branding.contactPhone}`] : []),
          ...(branding?.responsableNombre
            ? [
                `Responsable: ${branding.responsableNombre}${
                  branding?.responsableTitulo ? `, ${branding.responsableTitulo}` : ""
                }`,
              ]
            : []),
        ],
      },
    ].filter((section) => section.lines.length > 0),
  };
}
