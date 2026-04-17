export const TIER_THRESHOLDS = {
  silver: 1000,
  gold: 5000,
} as const;

export type LoyaltyTier = "bronze" | "silver" | "gold";
export type LoyaltyReason = "order" | "manual" | "redemption";
export interface LoyaltyThresholds {
  silver: number;
  gold: number;
}

export interface LoyaltyLedgerState {
  pointsCurrent: number;
  pointsHistorical: number;
  totalVisits: number;
  tier: LoyaltyTier;
  lastVisitAt?: string | null;
  currentStreak?: number;
}

export interface LoyaltyAwardInput {
  state?: Partial<LoyaltyLedgerState> | null;
  points: number;
  reason: LoyaltyReason;
  now?: string;
}

export interface LoyaltyTransactionDraft {
  pointsDelta: number;
  reason: LoyaltyReason;
  reference: string | null;
  createdAt: string;
}

export function calculateTier(points: number, thresholds: LoyaltyThresholds = TIER_THRESHOLDS): LoyaltyTier {
  if (points >= thresholds.gold) return "gold";
  if (points >= thresholds.silver) return "silver";
  return "bronze";
}

export function processWeeklyStreak(lastVisitAt: string | null, currentStreak: number, now = new Date()) {
  if (!lastVisitAt) {
    return { newStreak: 1, streakUpdated: true };
  }

  const lastVisit = new Date(lastVisitAt);
  const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return { newStreak: currentStreak, streakUpdated: false };
  if (diffDays <= 14) return { newStreak: currentStreak + 1, streakUpdated: true };
  return { newStreak: 1, streakUpdated: true };
}

export function calculatePointsForOrder(finalPrice: number): number {
  return Math.floor(finalPrice / 1000);
}

export function resolveLoyaltyState(
  pointsCurrent: number,
  pointsHistorical: number,
  totalVisits: number,
  lastVisitAt?: string | null,
  currentStreak?: number,
): LoyaltyLedgerState {
  return {
    pointsCurrent,
    pointsHistorical,
    totalVisits,
    tier: calculateTier(pointsCurrent),
    lastVisitAt: lastVisitAt || null,
    currentStreak: currentStreak ?? 0,
  };
}

export function applyLoyaltyAward(input: LoyaltyAwardInput): LoyaltyLedgerState {
  const current = input.state?.pointsCurrent ?? 0;
  const historical = input.state?.pointsHistorical ?? 0;
  const visits = input.state?.totalVisits ?? 0;
  const currentStreak = input.state?.currentStreak ?? 0;
  const points = Math.max(0, Number(input.points || 0));
  const nextCurrent = input.reason === "redemption" ? Math.max(0, current - points) : current + points;
  const nextHistorical = input.reason === "redemption" ? historical : historical + points;
  const nextVisits = input.reason === "order" || input.reason === "manual" ? visits + 1 : visits;
  const nextStreak =
    input.reason === "order" || input.reason === "manual"
      ? processWeeklyStreak(input.state?.lastVisitAt || null, currentStreak, input.now ? new Date(input.now) : new Date()).newStreak
      : currentStreak;

  return resolveLoyaltyState(nextCurrent, nextHistorical, nextVisits, input.now || null, nextStreak);
}

export function buildLoyaltyTransactionDraft(input: {
  points: number;
  reason: LoyaltyReason;
  reference?: string | null;
  createdAt?: string;
}): LoyaltyTransactionDraft {
  return {
    pointsDelta: input.reason === "redemption" ? -Math.abs(input.points) : Math.abs(input.points),
    reason: input.reason,
    reference: input.reference || null,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
