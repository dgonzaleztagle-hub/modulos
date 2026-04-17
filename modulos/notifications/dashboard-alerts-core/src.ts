export type DashboardAlertType = "order" | "reservation" | "delivery";

export interface DashboardAlert {
  type: DashboardAlertType;
  title: string;
  body: string;
}

export const DASHBOARD_TONE_CONFIG: Record<
  DashboardAlertType,
  { freqs: number[]; step: number; gain: number }
> = {
  order: { freqs: [523, 659, 784], step: 0.16, gain: 0.45 },
  reservation: { freqs: [784, 659], step: 0.22, gain: 0.32 },
  delivery: { freqs: [440], step: 0.18, gain: 0.25 },
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  delivery: "🛵 Delivery",
  dine_in: "🪑 Local",
  takeaway: "📦 Retiro",
};

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pickup: "Recogido en local",
  in_transit: "En camino",
  delivered: "✓ Entregado",
};

export function buildOrderDashboardAlert(input: {
  customerName?: string;
  orderType?: string;
  finalPrice?: number;
}): DashboardAlert {
  return {
    type: "order",
    title: "Nuevo pedido",
    body: `${input.customerName || "Cliente"} · ${ORDER_TYPE_LABELS[input.orderType || ""] || "📋 Pedido"} · $${Number(input.finalPrice || 0).toLocaleString("es-CL")}`,
  };
}

export function buildReservationDashboardAlert(input: {
  customerName?: string;
  partySize?: number;
  timeSlot?: string;
}): DashboardAlert {
  return {
    type: "reservation",
    title: "Nueva reserva",
    body: `${input.customerName || "Cliente"} · ${input.partySize ?? "?"} pax · ${input.timeSlot || ""}`.trim(),
  };
}

export function buildDeliveryDashboardAlert(input: {
  driverName?: string;
  status?: string;
}): DashboardAlert | null {
  const statusLabel = DELIVERY_STATUS_LABELS[input.status || ""];
  if (!statusLabel) return null;
  return {
    type: "delivery",
    title: "Delivery actualizado",
    body: `${input.driverName || "Driver"} → ${statusLabel}`,
  };
}
