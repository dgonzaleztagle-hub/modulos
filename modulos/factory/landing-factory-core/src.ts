export type FactorySectionType = "hero" | "problem" | "proof" | "features" | "faq" | "cta";

export interface FactorySection {
  id: string;
  type: FactorySectionType;
  visible: boolean;
  content: Record<string, unknown>;
}

export interface LandingConfig {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  sections: FactorySection[];
  isActive: boolean;
  primaryColor?: string;
}

export const DEFAULT_LP_STRUCTURE: FactorySection[] = [
  {
    id: "hero_1",
    type: "hero",
    visible: true,
    content: {
      title: "Titulo Maestro de tu Campana",
      subtitle: "Explica el beneficio principal aqui. Se claro y directo.",
      cta_text: "Quiero Saber Mas",
    },
  },
  {
    id: "proof_1",
    type: "proof",
    visible: true,
    content: {
      title: "Lo que dicen de nosotros",
      testimonials: [],
    },
  },
  {
    id: "cta_1",
    type: "cta",
    visible: true,
    content: {
      title: "Listo para el siguiente paso?",
      subtitle: "Haz clic abajo y hablemos por WhatsApp.",
      cta_text: "Contactar Ahora",
      whatsapp_number: "",
    },
  },
];

export function createLandingConfig(initial?: Partial<LandingConfig>): LandingConfig {
  return {
    slug: initial?.slug || "",
    title: initial?.title || "",
    description: initial?.description,
    sections: initial?.sections ? [...initial.sections] : [...DEFAULT_LP_STRUCTURE],
    isActive: initial?.isActive ?? true,
    primaryColor: initial?.primaryColor || "#00f0ff",
    id: initial?.id,
  };
}

export function updateLandingSection(config: LandingConfig, id: string, updates: Partial<FactorySection>): LandingConfig {
  return {
    ...config,
    sections: config.sections.map((section) => (section.id === id ? { ...section, ...updates } : section)),
  };
}

export function updateLandingSectionContent(
  config: LandingConfig,
  sectionId: string,
  key: string,
  value: unknown,
): LandingConfig {
  return {
    ...config,
    sections: config.sections.map((section) =>
      section.id === sectionId
        ? { ...section, content: { ...section.content, [key]: value } }
        : section,
    ),
  };
}

export function reorderLandingSections(config: LandingConfig, newOrder: FactorySection[]): LandingConfig {
  return {
    ...config,
    sections: [...newOrder],
  };
}

export function getVisibleLandingSections(config: LandingConfig): FactorySection[] {
  return config.sections.filter((section) => section.visible);
}
