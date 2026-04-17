export interface RankedScoreEntry {
  customerPhone: string;
  customerName: string;
  businessId: string;
  score: number;
  weekStart: string;
  isRanked: boolean;
  gameTokensUsed?: number;
}

export interface LeaderboardRow {
  rank: number;
  name: string;
  score: number;
  phoneHint: string;
}

export interface RankedScoreInput {
  customerPhone: string;
  customerName?: string | null;
  businessId: string;
  score: number;
  weekStart: string;
}

export function getWeekStart(now = new Date()): string {
  const current = new Date(now);
  const day = current.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  current.setDate(current.getDate() + diff);
  return current.toISOString().slice(0, 10);
}

export function getWeekLabel(now = new Date()): string {
  return `Semana del ${getWeekStart(now)}`;
}

export function countRankedAttempts(
  entries: RankedScoreEntry[],
  customerPhone: string,
  businessId: string,
  weekStart: string,
): number {
  return entries.filter(
    (entry) =>
      entry.isRanked &&
      entry.customerPhone === customerPhone &&
      entry.businessId === businessId &&
      entry.weekStart === weekStart,
  ).length;
}

export function canSubmitRankedScore(
  entries: RankedScoreEntry[],
  customerPhone: string,
  businessId: string,
  weekStart: string,
  maxAttempts = 3,
): boolean {
  return countRankedAttempts(entries, customerPhone, businessId, weekStart) < maxAttempts;
}

export function buildRankedScoreEntry(input: RankedScoreInput): RankedScoreEntry {
  return {
    customerPhone: input.customerPhone,
    customerName: input.customerName?.trim() || "Anonimo",
    businessId: input.businessId,
    score: Number(input.score || 0),
    weekStart: input.weekStart,
    isRanked: true,
    gameTokensUsed: 1,
  };
}

export function buildWeeklyLeaderboard(entries: RankedScoreEntry[], limit = 10): LeaderboardRow[] {
  const seen = new Map<string, { name: string; score: number }>();

  for (const entry of entries) {
    if (!entry.isRanked) continue;
    const previous = seen.get(entry.customerPhone);
    if (!previous || entry.score > previous.score) {
      seen.set(entry.customerPhone, {
        name: entry.customerName || "Anonimo",
        score: Number(entry.score || 0),
      });
    }
  }

  return Array.from(seen.entries())
    .sort((left, right) => right[1].score - left[1].score)
    .slice(0, limit)
    .map(([phone, payload], index) => ({
      rank: index + 1,
      name: payload.name,
      score: payload.score,
      phoneHint: phone.slice(-4),
    }));
}
