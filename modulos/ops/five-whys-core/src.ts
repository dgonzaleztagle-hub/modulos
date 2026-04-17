export interface FiveWhysData {
  why1?: string;
  why2?: string;
  why3?: string;
  why4?: string;
  why5?: string;
  root_cause?: string;
}

export const FIVE_WHYS_KEYS = ["why1", "why2", "why3", "why4", "why5"] as const;

export type FiveWhysKey = (typeof FIVE_WHYS_KEYS)[number];

function normalizeText(value: string | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

export function createFiveWhysData(seed?: Partial<FiveWhysData>): FiveWhysData {
  return {
    why1: normalizeText(seed?.why1),
    why2: normalizeText(seed?.why2),
    why3: normalizeText(seed?.why3),
    why4: normalizeText(seed?.why4),
    why5: normalizeText(seed?.why5),
    root_cause: normalizeText(seed?.root_cause),
  };
}

export function updateFiveWhysField(data: FiveWhysData, field: keyof FiveWhysData, value: string) {
  return {
    ...data,
    [field]: normalizeText(value),
  };
}

export function listAnsweredWhys(data: FiveWhysData) {
  return FIVE_WHYS_KEYS
    .map((key, index) => ({ key, label: `Por qué ${index + 1}`, value: normalizeText(data[key]) }))
    .filter((item) => item.value);
}

export function hasRootCause(data: FiveWhysData) {
  return Boolean(normalizeText(data.root_cause));
}

export function buildFiveWhysSummary(data: FiveWhysData) {
  return {
    answered: listAnsweredWhys(data),
    rootCause: normalizeText(data.root_cause),
    isComplete: listAnsweredWhys(data).length > 0 && hasRootCause(data),
  };
}

