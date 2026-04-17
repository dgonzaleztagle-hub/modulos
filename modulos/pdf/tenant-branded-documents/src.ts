export interface DocumentBranding {
  appName: string;
  logoUrl?: string | null;
  supportEmail?: string | null;
  primaryColor?: string | null;
  responsableNombre?: string | null;
  responsableTitulo?: string | null;
}

export interface DocumentSection {
  title?: string;
  rows?: Array<{ label: string; value: string }>;
  body?: string;
}

export interface DocumentPayload {
  title: string;
  subtitle?: string;
  branding: DocumentBranding;
  sections: DocumentSection[];
  footerNote?: string;
}

export function validateDocumentPayload(payload: DocumentPayload): string[] {
  const errors: string[] = [];
  if (!payload.title.trim()) errors.push("title is required");
  if (!payload.branding.appName.trim()) errors.push("branding.appName is required");
  if (!Array.isArray(payload.sections) || payload.sections.length === 0) {
    errors.push("at least one section is required");
  }

  payload.sections.forEach((section, index) => {
    if (!section.title && !section.body && (!section.rows || section.rows.length === 0)) {
      errors.push(`section ${index} must contain title, body or rows`);
    }
  });

  return errors;
}

export function buildDocumentOutline(payload: DocumentPayload) {
  return {
    header: {
      title: payload.title,
      subtitle: payload.subtitle,
      appName: payload.branding.appName,
      logoUrl: payload.branding.logoUrl ?? null,
      supportEmail: payload.branding.supportEmail ?? null,
      primaryColor: payload.branding.primaryColor ?? null,
    },
    sections: payload.sections,
    signature: buildDocumentSignature(payload.branding),
    footerNote: payload.footerNote ?? null,
  };
}

export function normalizeDocumentBranding(branding: DocumentBranding): DocumentBranding {
  return {
    appName: branding.appName.trim(),
    logoUrl: branding.logoUrl?.trim() || null,
    supportEmail: branding.supportEmail?.trim().toLowerCase() || null,
    primaryColor: branding.primaryColor?.trim() || null,
    responsableNombre: branding.responsableNombre?.trim() || null,
    responsableTitulo: branding.responsableTitulo?.trim() || null,
  };
}

export function buildDocumentSignature(branding: DocumentBranding) {
  if (!branding.responsableNombre) return null;
  return {
    name: branding.responsableNombre,
    title: branding.responsableTitulo ?? null,
  };
}
