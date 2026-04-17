export interface SearchLeadsParams {
  categoria: string;
  zona: string;
  radioKm: number;
  terminos?: string;
}

export interface HuntedLead {
  nombre: string;
  sitioWeb?: string;
  descripcion?: string;
  categoria: string;
  zonaBusqueda: string;
  fuente: string;
  direccion?: string;
  telefono?: string;
  rating?: number;
  reviews?: number;
  tipoNegocio?: string;
}

export interface Classification {
  puntajeOportunidad: number;
  estadoWeb: "sin_web" | "web_pobre" | "web_desactualizada" | "web_buena";
  razonIA: string;
  serviciosSugeridos: string[];
  senalesOportunidad: string[];
}

const CATEGORY_TERMS: Record<string, string> = {
  pluscontable: "contador independiente estudio contable servicios contables asesoría tributaria",
  cloudelab: "negocio local tienda restaurante servicios profesionales",
  truckpos: "food truck cafetería café comida rápida food trailer",
};

export function buildLeadSearchPayload(params: SearchLeadsParams) {
  return {
    query: params.terminos || CATEGORY_TERMS[params.categoria] || "",
    categoria: params.categoria,
    zona: params.zona,
    radio_km: params.radioKm,
  };
}

export function normalizeLead(raw: Record<string, unknown>): HuntedLead {
  return {
    nombre: String(raw.nombre ?? raw.name ?? "").trim(),
    sitioWeb: raw.sitio_web ? String(raw.sitio_web) : raw.sitioWeb ? String(raw.sitioWeb) : undefined,
    descripcion: raw.descripcion ? String(raw.descripcion) : undefined,
    categoria: String(raw.categoria ?? raw.category ?? "").trim(),
    zonaBusqueda: String(raw.zona_busqueda ?? raw.zonaBusqueda ?? "").trim(),
    fuente: String(raw.fuente ?? raw.source ?? "unknown").trim(),
    direccion: raw.direccion ? String(raw.direccion) : undefined,
    telefono: raw.telefono ? String(raw.telefono) : undefined,
    rating: raw.rating == null ? undefined : Number(raw.rating),
    reviews: raw.reviews == null ? undefined : Number(raw.reviews),
    tipoNegocio: raw.tipo_negocio ? String(raw.tipo_negocio) : undefined,
  };
}

export function buildLeadClassificationPayload(input: {
  nombre: string;
  sitioWeb?: string;
  categoria: string;
  descripcion?: string;
}) {
  return {
    nombre: input.nombre.trim(),
    sitio_web: input.sitioWeb?.trim(),
    categoria: input.categoria.trim(),
    descripcion: input.descripcion?.trim(),
  };
}

export function scoreLeadPriority(lead: HuntedLead, classification?: Classification): number {
  const base = classification?.puntajeOportunidad ?? 0;
  const sitePenalty = lead.sitioWeb ? 0 : 15;
  const socialProof = Math.min(10, Math.round((lead.reviews ?? 0) / 20));
  const ratingBonus = lead.rating ? Math.round(lead.rating * 2) : 0;
  return Math.max(0, Math.min(100, base + sitePenalty + socialProof + ratingBonus));
}

export function buildWhatsAppOutreachMessage(input: {
  lead: HuntedLead;
  template: string;
}) {
  return input.template
    .replace(/\{\{nombre\}\}/g, input.lead.nombre || "")
    .replace(/\{\{telefono\}\}/g, input.lead.telefono || "");
}
