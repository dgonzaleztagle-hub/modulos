export interface BookingServiceOption {
  value: string;
  label: string;
}

export interface RubroConfig {
  icon: string;
  label: string;
  services: BookingServiceOption[];
}

export const BOOKING_RUBROS: Record<string, RubroConfig> = {
  barberia: {
    icon: "✂️",
    label: "Barbería",
    services: [
      { value: "corte", label: "✂️ Corte" },
      { value: "barba", label: "🪒 Barba" },
      { value: "corte_barba", label: "✂️🪒 Corte + Barba" },
      { value: "otro", label: "💈 Otro" },
    ],
  },
  peluqueria: {
    icon: "💇‍♀️",
    label: "Peluquería",
    services: [
      { value: "corte", label: "✂️ Corte" },
      { value: "tinte", label: "🎨 Tinte / Color" },
      { value: "peinado", label: "💫 Peinado" },
      { value: "tratamiento", label: "✨ Tratamiento" },
      { value: "mechas", label: "🌟 Mechas / Balayage" },
      { value: "otro", label: "💇‍♀️ Otro" },
    ],
  },
  spa: {
    icon: "💆‍♀️",
    label: "Spa",
    services: [
      { value: "masaje_relajante", label: "💆 Masaje relajante" },
      { value: "masaje_deportivo", label: "💪 Masaje deportivo" },
      { value: "facial", label: "✨ Facial" },
      { value: "manicure", label: "💅 Manicure" },
      { value: "pedicure", label: "🦶 Pedicure" },
      { value: "otro", label: "🌸 Otro" },
    ],
  },
  podologia: {
    icon: "🦶",
    label: "Podología",
    services: [
      { value: "podologia_basica", label: "🦶 Podología básica" },
      { value: "esmaltado", label: "💅 Esmaltado" },
      { value: "tratamiento_unas", label: "✨ Tratamiento de uñas" },
      { value: "plantillas", label: "👟 Plantillas" },
      { value: "otro", label: "🦶 Otro" },
    ],
  },
  estetica: {
    icon: "✨",
    label: "Estética",
    services: [
      { value: "facial", label: "✨ Facial" },
      { value: "depilacion", label: "🌿 Depilación" },
      { value: "cejas", label: "👁️ Cejas / Pestañas" },
      { value: "corporal", label: "💆 Tratamiento corporal" },
      { value: "manicure", label: "💅 Manicure" },
      { value: "otro", label: "✨ Otro" },
    ],
  },
  nail: {
    icon: "💅",
    label: "Nail / Uñas",
    services: [
      { value: "manicure", label: "💅 Manicure" },
      { value: "pedicure", label: "🦶 Pedicure" },
      { value: "gel", label: "💎 Gel / Acrílico" },
      { value: "nail_art", label: "🎨 Nail Art" },
      { value: "semipermanente", label: "✨ Semipermanente" },
      { value: "otro", label: "💅 Otro" },
    ],
  },
  masajes: {
    icon: "💆",
    label: "Masajes",
    services: [
      { value: "relajante", label: "💆 Relajante" },
      { value: "deportivo", label: "💪 Deportivo" },
      { value: "descontracturante", label: "🔥 Descontracturante" },
      { value: "piedras_calientes", label: "🪨 Piedras calientes" },
      { value: "otro", label: "💆 Otro" },
    ],
  },
};

const DEFAULT_CONFIG: RubroConfig = {
  icon: "📅",
  label: "Servicio",
  services: [
    { value: "servicio_1", label: "📋 Servicio 1" },
    { value: "servicio_2", label: "📋 Servicio 2" },
    { value: "otro", label: "📋 Otro" },
  ],
};

export function normalizeRubroName(rubro: string): string {
  return rubro
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function getBookingRubroConfig(rubro: string): RubroConfig | null {
  const normalized = normalizeRubroName(rubro);
  if (normalized.includes("barber")) return BOOKING_RUBROS.barberia;
  if (normalized.includes("peluquer")) return BOOKING_RUBROS.peluqueria;
  if (normalized.includes("spa")) return BOOKING_RUBROS.spa;
  if (normalized.includes("podolog")) return BOOKING_RUBROS.podologia;
  if (normalized.includes("estet") || normalized.includes("centro estetico")) return BOOKING_RUBROS.estetica;
  if (normalized.includes("nail") || normalized.includes("unas") || normalized.includes("manicure")) return BOOKING_RUBROS.nail;
  if (normalized.includes("masaj")) return BOOKING_RUBROS.masajes;
  return null;
}

export function getBookingRubroConfigOrDefault(rubro: string): RubroConfig {
  return getBookingRubroConfig(rubro) ?? DEFAULT_CONFIG;
}
