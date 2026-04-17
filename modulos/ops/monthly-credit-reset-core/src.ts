export interface MonthlyResetProviderLike {
  id: string | number;
  name: string;
  resellerId: string | number;
  planType?: string | null;
  resetDay?: number | null;
  isActive?: boolean | null;
  credits?: number | null;
  monthlyLimit?: number | null;
  monthlyCost?: number | null;
  currency?: string | null;
}

export interface MonthlyResetCandidate {
  providerId: string | number;
  providerName: string;
  resellerId: string | number;
  previousCredits: number;
  nextCredits: number;
  metadata: {
    creditsReset: true;
    amount: number;
  };
  expense:
    | {
        amount: number;
        currency: string;
        description: string;
      }
    | null;
}

export function shouldResetMonthlyCredits(provider: MonthlyResetProviderLike, dayOfMonth: number) {
  return (
    String(provider.planType || "").toUpperCase() === "MONTHLY_RESET" &&
    provider.isActive === true &&
    Number(provider.resetDay || 0) === Number(dayOfMonth) &&
    provider.monthlyLimit !== null &&
    provider.monthlyLimit !== undefined
  );
}

export function buildMonthlyResetCandidate(
  provider: MonthlyResetProviderLike,
  dayOfMonth: number,
): MonthlyResetCandidate | null {
  if (!shouldResetMonthlyCredits(provider, dayOfMonth)) return null;

  const nextCredits = Number(provider.monthlyLimit || 0);
  const previousCredits = Number(provider.credits || 0);
  const amount = Number(provider.monthlyCost || 0);

  return {
    providerId: provider.id,
    providerName: provider.name,
    resellerId: provider.resellerId,
    previousCredits,
    nextCredits,
    metadata: {
      creditsReset: true,
      amount: nextCredits,
    },
    expense:
      amount > 0
        ? {
            amount,
            currency: provider.currency || "USD",
            description: `Renovacion mensual automatica (${provider.name})`,
          }
        : null,
  };
}

export function buildMonthlyResetBatch(input: {
  providers: MonthlyResetProviderLike[];
  dayOfMonth: number;
}) {
  return input.providers
    .map((provider) => buildMonthlyResetCandidate(provider, input.dayOfMonth))
    .filter((candidate): candidate is MonthlyResetCandidate => candidate !== null);
}
