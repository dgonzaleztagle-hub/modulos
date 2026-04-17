export type OrderMessageType =
  | "order_created"
  | "order_assigned"
  | "driver_on_route"
  | "driver_near"
  | "order_completed"
  | "driver_onboarded"
  | "incident_reported"
  | string;

export type OrderMessageInput = {
  trackingCode: string;
  scheduledDate?: string;
  scheduledTime?: string;
};

export function buildWaMeLink(phoneRaw: string, message: string): string | undefined {
  const phone = phoneRaw.replace(/\D/g, "");
  if (!phone) return undefined;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildOrderUpdateMessage(
  order: OrderMessageInput,
  kind: OrderMessageType,
): string {
  switch (kind) {
    case "order_created":
      return `Servicio ${order.trackingCode} confirmado para ${order.scheduledDate ?? "-"} ${order.scheduledTime ?? ""}.`.trim();
    case "order_assigned":
      return `Servicio ${order.trackingCode} asignado. El conductor va en camino.`;
    case "driver_on_route":
      return `Tu conductor está en ruta para ${order.trackingCode}.`;
    case "driver_near":
      return `Tu conductor está llegando para ${order.trackingCode}.`;
    case "order_completed":
      return `Servicio ${order.trackingCode} completado.`;
    case "driver_onboarded":
      return "Tu acceso de conductor fue creado con éxito.";
    case "incident_reported":
      return `Se reportó una incidencia en ${order.trackingCode}.`;
    default:
      return `Actualización de servicio ${order.trackingCode}.`;
  }
}
