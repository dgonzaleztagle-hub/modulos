export interface FoodCatalogItem {
  id: string;
  name: string;
  price: number;
  active?: boolean;
  categoryId?: string;
  categoryName?: string;
  tags?: string[];
}

export interface FoodCartItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface FoodOrder {
  id: string;
  status: "draft" | "submitted" | "paid" | "ready" | "delivered" | "cancelled";
  items: FoodCartItem[];
  tableId?: string | null;
  deliveryType?: "local" | "pickup" | "table";
  paid?: boolean;
}

export interface CashRegisterState {
  isOpen: boolean;
  registerId?: string | null;
}

export interface StoreSessionState {
  isOpen: boolean;
  sessionId?: string | null;
  mode: "catalog-only" | "ordering-enabled";
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
}

export interface InventoryMovement {
  inventoryId: string;
  type: "entry" | "exit" | "adjustment";
  quantity: number;
}

export interface FoodCatalogSection {
  id: string;
  title: string;
  items: FoodCatalogItem[];
}

export function buildCartItem(item: FoodCatalogItem, quantity = 1, notes?: string): FoodCartItem {
  return {
    itemId: item.id,
    name: item.name,
    quantity,
    unitPrice: item.price,
    notes,
  };
}

export function addCartItem(cart: FoodCartItem[], nextItem: FoodCartItem): FoodCartItem[] {
  const existing = cart.find((item) => item.itemId === nextItem.itemId && item.notes === nextItem.notes);
  if (!existing) return [...cart, nextItem];

  return cart.map((item) =>
    item === existing
      ? { ...item, quantity: item.quantity + nextItem.quantity }
      : item,
  );
}

export function removeCartItem(cart: FoodCartItem[], itemId: string): FoodCartItem[] {
  return cart.filter((item) => item.itemId !== itemId);
}

export function updateCartItemQuantity(cart: FoodCartItem[], itemId: string, nextQuantity: number): FoodCartItem[] {
  if (nextQuantity <= 0) return removeCartItem(cart, itemId);
  return cart.map((item) => (item.itemId === itemId ? { ...item, quantity: nextQuantity } : item));
}

export function calculateCartTotal(cart: FoodCartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function buildCatalogSections(items: FoodCatalogItem[]): FoodCatalogSection[] {
  const grouped = new Map<string, FoodCatalogItem[]>();

  items
    .filter((item) => item.active !== false)
    .forEach((item) => {
      const key = item.categoryId ?? item.categoryName ?? "general";
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    });

  return [...grouped.entries()].map(([id, sectionItems]) => ({
    id,
    title: sectionItems[0]?.categoryName ?? id,
    items: [...sectionItems].sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

export function resolveStoreSessionState(sessionId?: string | null): StoreSessionState {
  const isOpen = Boolean(sessionId);
  return {
    isOpen,
    sessionId: sessionId ?? null,
    mode: isOpen ? "ordering-enabled" : "catalog-only",
  };
}

export function canSubmitFoodOrder(session: StoreSessionState, cart: FoodCartItem[]): boolean {
  return session.isOpen && cart.length > 0;
}

export function buildFoodOrderSummary(order: FoodOrder) {
  const total = calculateCartTotal(order.items);
  return {
    id: order.id,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total,
    deliveryType: order.deliveryType ?? "local",
    status: order.status,
    paid: Boolean(order.paid),
  };
}

export function completeFoodOrder(
  order: FoodOrder,
  paymentData: Record<string, unknown> = {},
): FoodOrder & { paymentData: Record<string, unknown> } {
  return {
    ...order,
    status: "ready",
    paid: true,
    paymentData,
  };
}

export function applyInventoryMovement(item: InventoryItem, movement: InventoryMovement): InventoryItem {
  const current = item.currentStock;
  const nextStock =
    movement.type === "entry"
      ? current + movement.quantity
      : movement.type === "exit"
        ? current - movement.quantity
        : movement.quantity;

  return {
    ...item,
    currentStock: nextStock,
  };
}

export function resolveCashRegisterState(registerId?: string | null): CashRegisterState {
  return {
    isOpen: Boolean(registerId),
    registerId: registerId ?? null,
  };
}
