export type SubscriptionAlertType =
  | "vencing_5days"
  | "vencing_3days"
  | "vencing_1day"
  | "expired";

export interface ExpirableAccount {
  id: string | number;
  name: string;
  expiresAt: string | null;
}

export interface SubscriptionAlertRecord {
  ownerId: string | number;
  alertType: SubscriptionAlertType;
  createdAt: string;
}

export interface SubscriptionAlertCandidate {
  ownerId: string | number;
  ownerName: string;
  alertType: SubscriptionAlertType;
  daysRemaining: number;
}

export function calculateDaysRemaining(expiresAt: string, now = new Date()): number {
  const expirationDate = new Date(expiresAt);
  return Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function resolveSubscriptionAlertType(daysRemaining: number): SubscriptionAlertType | null {
  if (daysRemaining <= 0) return "expired";
  if (daysRemaining === 1) return "vencing_1day";
  if (daysRemaining === 3) return "vencing_3days";
  if (daysRemaining === 5) return "vencing_5days";
  return null;
}

export function hasAlertToday(input: {
  alerts: SubscriptionAlertRecord[];
  ownerId: string | number;
  alertType: SubscriptionAlertType;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return input.alerts.some(
    (alert) =>
      String(alert.ownerId) === String(input.ownerId) &&
      alert.alertType === input.alertType &&
      new Date(alert.createdAt).getTime() >= start.getTime(),
  );
}

export function buildSubscriptionAlertCandidates(input: {
  accounts: ExpirableAccount[];
  existingAlerts?: SubscriptionAlertRecord[];
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const existingAlerts = input.existingAlerts ?? [];
  const candidates: SubscriptionAlertCandidate[] = [];

  for (const account of input.accounts) {
    if (!account.expiresAt) continue;
    const daysRemaining = calculateDaysRemaining(account.expiresAt, now);
    const alertType = resolveSubscriptionAlertType(daysRemaining);
    if (!alertType) continue;
    if (hasAlertToday({ alerts: existingAlerts, ownerId: account.id, alertType, now })) {
      continue;
    }
    candidates.push({
      ownerId: account.id,
      ownerName: account.name,
      alertType,
      daysRemaining,
    });
  }

  return candidates.sort((left, right) => left.daysRemaining - right.daysRemaining);
}
