export interface ArrearsPaymentRow {
  contractId: string;
  dueDate: string;
  status: string;
  amount?: number;
  contract?: unknown;
}

export interface ArrearsEntry {
  contractId: string;
  daysOverdue: number;
  dueDate: string;
  amount: number;
  contract?: unknown;
  severity: ArrearsSeverity;
}

export type ArrearsSeverity = "warning" | "alert" | "critical";

export function calculateDaysOverdue(dueDate: string, today = new Date()): number {
  const due = new Date(dueDate);
  return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

export function resolveArrearsSeverity(daysOverdue: number): ArrearsSeverity {
  if (daysOverdue >= 30) return "critical";
  if (daysOverdue >= 10) return "alert";
  return "warning";
}

export function buildArrearsEntries(
  payments: ArrearsPaymentRow[],
  today = new Date(),
): ArrearsEntry[] {
  const cutoff = new Date(today.toISOString().slice(0, 10));
  const map = new Map<string, ArrearsEntry>();

  for (const payment of payments) {
    if (!payment.contractId) continue;
    if (!["overdue", "pending"].includes(payment.status)) continue;
    const due = new Date(payment.dueDate);
    if (!(due < cutoff)) continue;

    const daysOverdue = calculateDaysOverdue(payment.dueDate, today);
    const current = map.get(payment.contractId);
    if (!current || current.daysOverdue < daysOverdue) {
      map.set(payment.contractId, {
        contractId: payment.contractId,
        daysOverdue,
        dueDate: payment.dueDate,
        amount: payment.amount ?? 0,
        contract: payment.contract,
        severity: resolveArrearsSeverity(daysOverdue),
      });
    }
  }

  return Array.from(map.values()).sort((left, right) => right.daysOverdue - left.daysOverdue);
}

export function summarizeArrears(entries: ArrearsEntry[]) {
  return entries.reduce(
    (summary, entry) => {
      summary.totalDebt += entry.amount;
      summary.totalContracts += 1;
      summary[entry.severity] += 1;
      return summary;
    },
    {
      totalDebt: 0,
      totalContracts: 0,
      warning: 0,
      alert: 0,
      critical: 0,
    },
  );
}

export function buildArrearsLegalMessage(summary: ReturnType<typeof summarizeArrears>): string | null {
  if (summary.critical <= 0) return null;
  return `Tienes ${summary.critical} contrato${summary.critical !== 1 ? "s" : ""} con más de 30 días de mora. Puedes iniciar el proceso de restitución.`;
}
