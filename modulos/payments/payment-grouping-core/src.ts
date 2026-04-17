export interface PaymentGroupRecord {
  id: string;
  folio: number;
  ownerId?: string | number | null;
  ownerName?: string | null;
  paymentDate: string;
  concept: string;
  amount: number;
  period?: string | null;
  groupable?: boolean;
}

export interface GroupedPaymentRecord<T extends PaymentGroupRecord = PaymentGroupRecord> {
  id: string;
  paymentIds: string[];
  folioStart: number;
  folioEnd: number;
  folioLabel: string;
  ownerId: string | number | null;
  ownerName: string | null;
  paymentDate: string;
  concept: string;
  period: string | null;
  periods: string[];
  amount: number;
  isGrouped: boolean;
  rawPayments: T[];
}

function normalizeToken(value: string): string {
  return String(value || "").trim().toUpperCase();
}

function dedupe(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = normalizeToken(value);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function areConsecutiveFolios(records: PaymentGroupRecord[]) {
  const sorted = [...records].sort((left, right) => left.folio - right.folio);
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index].folio !== sorted[index - 1].folio + 1) return false;
  }
  return true;
}

export function buildPeriodSummary(periods: string[]): string | null {
  const normalized = dedupe(periods);
  if (normalized.length === 0) return null;
  if (normalized.length === 1) return normalized[0];
  return normalized.join(",");
}

export function buildGroupedConcept(baseConcept: string, periods: string[]): string {
  const periodSummary = buildPeriodSummary(periods);
  if (!periodSummary) return baseConcept;
  const normalizedBase = String(baseConcept || "").trim();
  if (/^cuota/i.test(normalizedBase)) {
    return `Cuota ${periodSummary}`;
  }
  return `${normalizedBase} ${periodSummary}`.trim();
}

export function groupPaymentsForDisplay<T extends PaymentGroupRecord>(payments: T[]) {
  const buckets = new Map<string, T[]>();
  const standalone: T[] = [];

  for (const payment of payments) {
    if (payment.groupable === false) {
      standalone.push(payment);
      continue;
    }
    const bucketKey = `${payment.ownerId ?? payment.ownerName ?? "sin-owner"}|${payment.paymentDate}|${normalizeToken(payment.concept)}`;
    const current = buckets.get(bucketKey) || [];
    current.push(payment);
    buckets.set(bucketKey, current);
  }

  const grouped: GroupedPaymentRecord<T>[] = [];

  for (const bucket of buckets.values()) {
    const sortedBucket = [...bucket].sort((left, right) => left.folio - right.folio);
    const periods = dedupe(sortedBucket.map((payment) => payment.period || "").filter(Boolean));
    const shouldGroup = sortedBucket.length > 1 && areConsecutiveFolios(sortedBucket);

    if (!shouldGroup) {
      for (const payment of sortedBucket) {
        grouped.push({
          id: payment.id,
          paymentIds: [payment.id],
          folioStart: payment.folio,
          folioEnd: payment.folio,
          folioLabel: String(payment.folio),
          ownerId: payment.ownerId ?? null,
          ownerName: payment.ownerName ?? null,
          paymentDate: payment.paymentDate,
          concept: buildGroupedConcept(payment.concept, payment.period ? [payment.period] : []),
          period: payment.period || null,
          periods: payment.period ? [payment.period] : [],
          amount: Number(payment.amount || 0),
          isGrouped: false,
          rawPayments: [payment],
        });
      }
      continue;
    }

    grouped.push({
      id: sortedBucket[0].id,
      paymentIds: sortedBucket.map((payment) => payment.id),
      folioStart: sortedBucket[0].folio,
      folioEnd: sortedBucket[sortedBucket.length - 1].folio,
      folioLabel: `${sortedBucket[0].folio}-${sortedBucket[sortedBucket.length - 1].folio}`,
      ownerId: sortedBucket[0].ownerId ?? null,
      ownerName: sortedBucket[0].ownerName ?? null,
      paymentDate: sortedBucket[0].paymentDate,
      concept: buildGroupedConcept(sortedBucket[0].concept, periods),
      period: buildPeriodSummary(periods),
      periods,
      amount: sortedBucket.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      isGrouped: true,
      rawPayments: sortedBucket,
    });
  }

  for (const payment of standalone) {
    grouped.push({
      id: payment.id,
      paymentIds: [payment.id],
      folioStart: payment.folio,
      folioEnd: payment.folio,
      folioLabel: String(payment.folio),
      ownerId: payment.ownerId ?? null,
      ownerName: payment.ownerName ?? null,
      paymentDate: payment.paymentDate,
      concept: payment.concept,
      period: payment.period || null,
      periods: payment.period ? [payment.period] : [],
      amount: Number(payment.amount || 0),
      isGrouped: false,
      rawPayments: [payment],
    });
  }

  return grouped.sort((left, right) => {
    const dateCompare = new Date(right.paymentDate).getTime() - new Date(left.paymentDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    return right.folioEnd - left.folioEnd;
  });
}
