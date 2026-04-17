export type SupportVisibilityMode = "authenticated_thread" | "public_email_only";
export type SupportStatus = "open" | "waiting_customer" | "waiting_team" | "resolved" | "closed";

export interface SupportTicketSummary {
  id: string;
  createdAt: string;
  requestType: string;
  status: SupportStatus;
  subject: string;
  name: string;
  email: string;
  tenantId?: string | null;
  tenantName?: string | null;
  requesterUserId?: string | null;
  assignedOwnerUserId?: string | null;
  visibilityMode: SupportVisibilityMode;
  lastMessageAt?: string | null;
  resolvedAt?: string | null;
  source?: string;
}

export interface SupportTicketMessage {
  id: string;
  createdAt: string;
  authorUserId?: string | null;
  authorRole: string;
  body: string;
}

export function getSupportStatusLabel(status: SupportStatus): string {
  switch (status) {
    case "open":
      return "Abierto";
    case "waiting_customer":
      return "Esperando cliente";
    case "waiting_team":
      return "Esperando equipo";
    case "resolved":
      return "Resuelto";
    case "closed":
      return "Cerrado";
    default:
      return status;
  }
}

export function getSupportVisibilityLabel(mode: SupportVisibilityMode): string {
  return mode === "authenticated_thread" ? "Interno" : "Publico";
}

export function sortTicketsByRecentActivity<T extends SupportTicketSummary>(tickets: T[]): T[] {
  return [...tickets].sort((left, right) => {
    const leftDate = new Date(left.lastMessageAt || left.createdAt).getTime();
    const rightDate = new Date(right.lastMessageAt || right.createdAt).getTime();
    return rightDate - leftDate;
  });
}
