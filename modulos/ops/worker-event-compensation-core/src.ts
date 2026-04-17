export interface WorkerEventCompensationRow {
  eventType: string;
  cantidad: number;
  recargoHorasExtras?: number;
}

const EVENT_META: Record<string, { title: string; label: string; icon: string }> = {
  atraso: { title: "Atraso", label: "min", icon: "⏱️" },
  falta_completa: { title: "Falta Día Completo", label: "días", icon: "❌" },
  falta_media: { title: "Falta Medio Día", label: "medio días", icon: "⚠️" },
  permiso_horas: { title: "Tiempos de permiso", label: "min", icon: "🕐" },
  permiso_medio_dia: { title: "Permiso Medio Día", label: "medio días", icon: "🔵" },
  permiso_completo: { title: "Permiso Día Completo", label: "días", icon: "🟣" },
  anticipo: { title: "Anticipo", label: "$", icon: "💰" },
  licencia_medica: { title: "Licencia Médica", label: "días", icon: "🏥" },
  horas_extras: { title: "Horas Extras", label: "hrs", icon: "⏰" },
};

export function resolveWorkerEventMeta(eventType: string) {
  return EVENT_META[eventType] ?? { title: eventType, label: "unidades", icon: "📋" };
}

export function calculateExtraHourValue(sueldoBase: number, horasContrato: number, recargo = 1.5): number {
  if (!horasContrato) return 0;
  return (sueldoBase / horasContrato) * recargo;
}

export function calculateDelayDiscount(sueldoBase: number, horasContrato: number, minutosAtraso: number): number {
  if (!horasContrato) return 0;
  return (sueldoBase / (horasContrato * 60)) * minutosAtraso;
}

export function calculateFullAbsenceDiscount(sueldoBase: number, diasFalta: number): number {
  return (sueldoBase / 30) * diasFalta;
}

export function calculateHalfAbsenceDiscount(sueldoBase: number, mediosDias: number): number {
  return ((sueldoBase / 30) / 2) * mediosDias;
}

export function summarizeWorkerEvents(
  events: WorkerEventCompensationRow[],
  options: { sueldoBase?: number; horasContrato?: number } = {},
) {
  const grouped = new Map<
    string,
    {
      eventType: string;
      title: string;
      label: string;
      icon: string;
      totalCantidad: number;
      records: number;
      totalImpact: number | null;
    }
  >();

  for (const event of events) {
    const meta = resolveWorkerEventMeta(event.eventType);
    const current =
      grouped.get(event.eventType) ??
      {
        eventType: event.eventType,
        title: meta.title,
        label: meta.label,
        icon: meta.icon,
        totalCantidad: 0,
        records: 0,
        totalImpact: 0,
      };

    current.totalCantidad += event.cantidad;
    current.records += 1;

    if (options.sueldoBase && options.horasContrato) {
      if (event.eventType === "horas_extras") {
        current.totalImpact! += calculateExtraHourValue(
          options.sueldoBase,
          options.horasContrato,
          event.recargoHorasExtras ?? 1.5,
        ) * event.cantidad;
      } else if (event.eventType === "atraso") {
        current.totalImpact! -= calculateDelayDiscount(options.sueldoBase, options.horasContrato, event.cantidad);
      } else if (event.eventType === "falta_completa") {
        current.totalImpact! -= calculateFullAbsenceDiscount(options.sueldoBase, event.cantidad);
      } else if (event.eventType === "falta_media") {
        current.totalImpact! -= calculateHalfAbsenceDiscount(options.sueldoBase, event.cantidad);
      } else if (event.eventType === "anticipo") {
        current.totalImpact! -= event.cantidad;
      }
    } else {
      current.totalImpact = null;
    }

    grouped.set(event.eventType, current);
  }

  return Array.from(grouped.values());
}
