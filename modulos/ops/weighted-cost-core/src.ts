export interface CreditPurchaseLike {
  cost?: number | null;
  creditsAmount?: number | null;
}

export function computeWeightedAverageCost(purchases: CreditPurchaseLike[]) {
  if (!purchases.length) return 0;
  const totalCost = purchases.reduce((sum, purchase) => sum + Number(purchase.cost || 0), 0);
  const totalCredits = purchases.reduce((sum, purchase) => sum + Number(purchase.creditsAmount || 0), 0);
  return totalCredits === 0 ? 0 : totalCost / totalCredits;
}

export function resolveMarginalCreditCost(planType: string | null | undefined, purchases: CreditPurchaseLike[]) {
  if (String(planType || "").toUpperCase() === "MONTHLY_RESET") return 0;
  return computeWeightedAverageCost(purchases);
}
