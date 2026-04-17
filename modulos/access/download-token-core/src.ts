export interface DownloadTokenRecord {
  token: string;
  productId: string;
  clientEmail: string | null;
  expiresAt: string;
  used: boolean;
  createdAt?: string;
}

export interface IssueDownloadTokenInput {
  productId: string;
  clientEmail?: string | null;
  expiresInMinutes?: number;
  now?: Date;
}

export function normalizeAssetPath(value: string | null | undefined): string {
  if (!value) return "";
  const cleaned = value.trim();
  const uploadMatch = cleaned.match(/(?:^|\/)(uploads\/[^?]+)/);
  if (uploadMatch?.[1]) return uploadMatch[1];
  const coverMatch = cleaned.match(/(?:^|\/)(covers\/[^?]+)/);
  if (coverMatch?.[1]) return coverMatch[1];
  const marker = "/storage/v1/object/public/zeus-assets/";
  if (cleaned.includes(marker)) {
    return cleaned.split(marker)[1] || "";
  }
  return cleaned.replace(/^\/+/, "");
}

export function normalizeClientEmail(clientEmail?: string | null): string | null {
  const normalized = String(clientEmail || "").trim().toLowerCase();
  return normalized || null;
}

export function createDownloadTokenValue(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function issueDownloadToken(input: IssueDownloadTokenInput): DownloadTokenRecord {
  const now = input.now ?? new Date();
  const expiresInMinutes = input.expiresInMinutes ?? 24 * 60;

  return {
    token: createDownloadTokenValue(),
    productId: input.productId,
    clientEmail: normalizeClientEmail(input.clientEmail),
    expiresAt: new Date(now.getTime() + expiresInMinutes * 60 * 1000).toISOString(),
    used: false,
    createdAt: now.toISOString(),
  };
}

export function isDownloadTokenActive(record: DownloadTokenRecord, now = new Date()): boolean {
  return !record.used && new Date(record.expiresAt).getTime() > now.getTime();
}

export function findActiveDownloadToken(input: {
  records: DownloadTokenRecord[];
  productId: string;
  clientEmail?: string | null;
  now?: Date;
}) {
  const normalizedEmail = normalizeClientEmail(input.clientEmail);
  const now = input.now ?? new Date();

  return (
    [...input.records]
      .filter((record) => record.productId === input.productId)
      .filter((record) => record.clientEmail === normalizedEmail)
      .filter((record) => isDownloadTokenActive(record, now))
      .sort((left, right) => {
        const leftCreated = new Date(left.createdAt || left.expiresAt).getTime();
        const rightCreated = new Date(right.createdAt || right.expiresAt).getTime();
        return rightCreated - leftCreated;
      })[0] || null
  );
}
