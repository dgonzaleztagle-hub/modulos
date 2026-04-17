export type BuilderItemType =
  | "text"
  | "button"
  | "image"
  | "box"
  | "video"
  | "plans_widget"
  | "service_widget";

export type BuilderActionType = "url" | "whatsapp" | "scroll" | "none";
export type BuilderDevice = "desktop" | "tablet" | "mobile";

export interface BuilderItem {
  id: string;
  type: BuilderItemType;
  position: { x: number; y: number };
  size: { width: number | "auto"; height: number | "auto" };
  content: {
    text?: string;
    src?: string;
    html?: string;
    link?: string;
    href?: string;
    data?: unknown;
    actionType?: BuilderActionType;
  };
  style: Record<string, unknown>;
}

export interface BuilderCanvasSettings {
  background: string;
  gridEnabled: boolean;
}

export interface BuilderDocument {
  version: string;
  items: BuilderItem[];
  canvas: BuilderCanvasSettings;
}

export interface BuilderHistory {
  past: BuilderDocument[];
  future: BuilderDocument[];
}

export const DEFAULT_CANVAS_SETTINGS: BuilderCanvasSettings = {
  background: "#000000",
  gridEnabled: true,
};

export const DEFAULT_BUILDER_DOCUMENT: BuilderDocument = {
  version: "1",
  items: [
    {
      id: "demo-text-1",
      type: "text",
      position: { x: 100, y: 100 },
      size: { width: "auto", height: "auto" },
      content: { text: "Edita este titulo" },
      style: {
        fontSize: "48px",
        color: "#ffffff",
        fontWeight: "bold",
        zIndex: 10,
      },
    },
    {
      id: "demo-button-1",
      type: "button",
      position: { x: 100, y: 200 },
      size: { width: "auto", height: "auto" },
      content: { text: "Comprar Ahora", actionType: "none" },
      style: {
        backgroundColor: "#9333ea",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "9999px",
        zIndex: 11,
      },
    },
  ],
  canvas: DEFAULT_CANVAS_SETTINGS,
};

function cloneDocument(document: BuilderDocument): BuilderDocument {
  return {
    version: document.version,
    items: document.items.map((item) => ({
      ...item,
      position: { ...item.position },
      size: { ...item.size },
      content: { ...item.content },
      style: { ...item.style },
    })),
    canvas: { ...document.canvas },
  };
}

function nextZIndex(items: BuilderItem[]): number {
  return Math.max(0, ...items.map((item) => Number(item.style.zIndex ?? 0))) + 1;
}

function createDefaultItem(type: BuilderItemType, id: string, x: number, y: number, zIndex: number): BuilderItem {
  const base: BuilderItem = {
    id,
    type,
    position: { x, y },
    size: { width: "auto", height: "auto" },
    content: {},
    style: { zIndex },
  };

  switch (type) {
    case "text":
      return {
        ...base,
        content: { text: "Haz doble clic para editar" },
        style: { ...base.style, color: "#ffffff", fontSize: "18px" },
      };
    case "button":
      return {
        ...base,
        content: { text: "Click Aqui", actionType: "none" },
        style: {
          ...base.style,
          backgroundColor: "#2563eb",
          color: "#ffffff",
          padding: "10px 20px",
          borderRadius: "5px",
        },
      };
    case "box":
      return {
        ...base,
        size: { width: 200, height: 200 },
        style: {
          ...base.style,
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px dashed rgba(255,255,255,0.3)",
        },
      };
    case "image":
      return {
        ...base,
        size: { width: 300, height: 200 },
        content: { src: "https://via.placeholder.com/300x200" },
        style: {
          ...base.style,
          backgroundSize: "cover",
          backgroundPosition: "top left",
        },
      };
    case "plans_widget":
      return { ...base, size: { width: 300, height: 400 } };
    case "service_widget":
      return { ...base, size: { width: 300, height: 150 } };
    case "video":
      return { ...base, size: { width: 480, height: 270 }, content: { src: "" } };
    default:
      return base;
  }
}

export function createBuilderDocument(initial?: Partial<BuilderDocument>): BuilderDocument {
  return {
    version: initial?.version || DEFAULT_BUILDER_DOCUMENT.version,
    items: initial?.items ? initial.items.map((item) => sanitizeBuilderItem(item)) : cloneDocument(DEFAULT_BUILDER_DOCUMENT).items,
    canvas: {
      ...DEFAULT_CANVAS_SETTINGS,
      ...(initial?.canvas || {}),
    },
  };
}

export function createEmptyHistory(): BuilderHistory {
  return { past: [], future: [] };
}

export function pushHistory(history: BuilderHistory, document: BuilderDocument, maxSteps = 20): BuilderHistory {
  const nextPast = [...history.past, cloneDocument(document)].slice(-maxSteps);
  return {
    past: nextPast,
    future: [],
  };
}

export function undoBuilder(history: BuilderHistory, current: BuilderDocument): { history: BuilderHistory; document: BuilderDocument } {
  if (history.past.length === 0) {
    return { history, document: current };
  }

  const previous = history.past[history.past.length - 1];
  return {
    document: cloneDocument(previous),
    history: {
      past: history.past.slice(0, -1),
      future: [cloneDocument(current), ...history.future],
    },
  };
}

export function redoBuilder(history: BuilderHistory, current: BuilderDocument): { history: BuilderHistory; document: BuilderDocument } {
  if (history.future.length === 0) {
    return { history, document: current };
  }

  const next = history.future[0];
  return {
    document: cloneDocument(next),
    history: {
      past: [...history.past, cloneDocument(current)],
      future: history.future.slice(1),
    },
  };
}

export function addBuilderItem(
  document: BuilderDocument,
  type: BuilderItemType,
  position = { x: 50, y: 50 },
  id = `${type}_${Date.now()}`,
): BuilderDocument {
  const nextItem = createDefaultItem(type, id, position.x, position.y, nextZIndex(document.items));
  return {
    ...cloneDocument(document),
    items: [...document.items.map((item) => sanitizeBuilderItem(item)), nextItem],
  };
}

export function updateBuilderItem(
  document: BuilderDocument,
  id: string,
  updates: Partial<BuilderItem>,
): BuilderDocument {
  return {
    ...cloneDocument(document),
    items: document.items.map((item) =>
      item.id === id
        ? sanitizeBuilderItem({
            ...item,
            ...updates,
            position: { ...item.position, ...(updates.position || {}) },
            size: { ...item.size, ...(updates.size || {}) },
            content: { ...item.content, ...(updates.content || {}) },
            style: { ...item.style, ...(updates.style || {}) },
          })
        : sanitizeBuilderItem(item),
    ),
  };
}

export function removeBuilderItem(document: BuilderDocument, id: string): BuilderDocument {
  return {
    ...cloneDocument(document),
    items: document.items.filter((item) => item.id !== id).map((item) => sanitizeBuilderItem(item)),
  };
}

export function moveBuilderItem(document: BuilderDocument, id: string, x: number, y: number): BuilderDocument {
  return updateBuilderItem(document, id, { position: { x, y } });
}

export function reorderBuilderLayer(
  document: BuilderDocument,
  id: string,
  mode: "front" | "back" | "forward" | "backward",
): BuilderDocument {
  const items = document.items.map((item) => sanitizeBuilderItem(item));
  const target = items.find((item) => item.id === id);

  if (!target) {
    return cloneDocument(document);
  }

  if (mode === "front") {
    return updateBuilderItem(document, id, { style: { zIndex: nextZIndex(items) } });
  }

  if (mode === "forward") {
    return updateBuilderItem(document, id, { style: { zIndex: Number(target.style.zIndex ?? 1) + 1 } });
  }

  if (mode === "backward") {
    return updateBuilderItem(document, id, { style: { zIndex: Math.max(1, Number(target.style.zIndex ?? 1) - 1) } });
  }

  const shifted = items.map((item) => {
    if (item.id === id) {
      return { ...item, style: { ...item.style, zIndex: 1 } };
    }

    return { ...item, style: { ...item.style, zIndex: Number(item.style.zIndex ?? 1) + 1 } };
  });

  return {
    ...cloneDocument(document),
    items: shifted,
  };
}

export function updateCanvasSettings(
  document: BuilderDocument,
  settings: Partial<BuilderCanvasSettings>,
): BuilderDocument {
  return {
    ...cloneDocument(document),
    canvas: {
      ...document.canvas,
      ...settings,
    },
  };
}

export function sanitizeBuilderItem(input: Partial<BuilderItem>, index = 0): BuilderItem {
  const type = isBuilderItemType(input.type) ? input.type : "box";
  return {
    id: typeof input.id === "string" && input.id.length > 0 ? input.id : `imported_${index}`,
    type,
    position: {
      x: typeof input.position?.x === "number" ? input.position.x : 0,
      y: typeof input.position?.y === "number" ? input.position.y : index * 100,
    },
    size: {
      width: normalizeDimension(input.size?.width),
      height: normalizeDimension(input.size?.height),
    },
    content: typeof input.content === "object" && input.content ? { ...input.content } : {},
    style: typeof input.style === "object" && input.style ? { ...input.style } : {},
  };
}

function normalizeDimension(value: unknown): number | "auto" {
  if (value === "auto") {
    return "auto";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return "auto";
}

function isBuilderItemType(value: unknown): value is BuilderItemType {
  return [
    "text",
    "button",
    "image",
    "box",
    "video",
    "plans_widget",
    "service_widget",
  ].includes(String(value));
}

export function importBuilderJson(raw: string): BuilderDocument {
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    return createBuilderDocument({ items: parsed.map((item, index) => sanitizeBuilderItem(item, index)) });
  }

  if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
    return createBuilderDocument({
      version: typeof parsed.version === "string" ? parsed.version : "1",
      items: parsed.items.map((item: Partial<BuilderItem>, index: number) => sanitizeBuilderItem(item, index)),
      canvas: parsed.canvas,
    });
  }

  throw new Error("Builder JSON invalido");
}

export function exportBuilderJson(document: BuilderDocument): string {
  return JSON.stringify(document, null, 2);
}

export function deviceScale(device: BuilderDevice, canvasWidth = 1200): number {
  switch (device) {
    case "mobile":
      return 340 / canvasWidth;
    case "tablet":
      return 768 / canvasWidth;
    default:
      return 1;
  }
}
