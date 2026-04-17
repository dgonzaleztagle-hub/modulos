export type PublicationStatus = "pending" | "active" | "paused" | "closed" | "error" | "syncing";

export interface PublicationRecord {
  id?: string;
  externalId?: string | null;
  url?: string | null;
  status: PublicationStatus;
  errorMessage?: string | null;
}

export interface PublisherAdapter<TPayload = unknown, TResult = unknown> {
  connect?: () => Promise<void>;
  publish: (payload: TPayload) => Promise<TResult>;
  update: (externalId: string, payload: TPayload) => Promise<TResult>;
  unpublish: (externalId: string) => Promise<TResult>;
}

export function normalizePublicationStatus(status?: string | null): PublicationStatus {
  const normalized = String(status || "").toLowerCase().trim();

  switch (normalized) {
    case "active":
      return "active";
    case "paused":
      return "paused";
    case "closed":
      return "closed";
    case "error":
      return "error";
    case "syncing":
      return "syncing";
    case "pending":
    default:
      return "pending";
  }
}

export function buildPublicationRecord(input: Partial<PublicationRecord> & { status: PublicationStatus }): PublicationRecord {
  return {
    id: input.id,
    externalId: input.externalId ?? null,
    url: input.url ?? null,
    status: input.status,
    errorMessage: input.errorMessage ?? null,
  };
}
