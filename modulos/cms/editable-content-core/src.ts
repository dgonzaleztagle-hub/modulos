export type EditableContentType = "text" | "richtext" | "image" | "json";

export interface EditableField {
  id: string;
  type: EditableContentType;
  label?: string;
  fallback?: unknown;
}

export interface ContentSaveRequest {
  data: Record<string, unknown>;
  secret?: string | null;
}

export function resolveEditableContent(
  data: Record<string, unknown>,
  field: EditableField,
): unknown {
  return data[field.id] ?? field.fallback ?? null;
}

export function applyContentPatch(
  data: Record<string, unknown>,
  fieldId: string,
  value: unknown,
): Record<string, unknown> {
  return {
    ...data,
    [fieldId]: value,
  };
}

export function validateContentSaveRequest(request: ContentSaveRequest): string[] {
  const errors: string[] = [];
  if (!request.data || typeof request.data !== "object") {
    errors.push("data must be an object");
  }
  return errors;
}
