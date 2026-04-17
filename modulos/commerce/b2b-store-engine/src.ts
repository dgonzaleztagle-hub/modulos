export interface B2BVariant {
  id: string;
  label: string;
  priceModifier: number;
}

export interface B2BVariantGroup {
  groupName: string;
  options: B2BVariant[];
}

export interface B2BProduct {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  description?: string;
  specs?: Array<{ label: string; value: string }>;
  variants?: B2BVariantGroup[];
}

export interface B2BCartItem extends B2BProduct {
  cartItemId: string;
  quantity: number;
  selectedVariants: Record<string, B2BVariant>;
  finalUnitPrice: number;
}

export function getDefaultVariantSelection(product: B2BProduct): Record<string, B2BVariant> {
  const selection: Record<string, B2BVariant> = {};
  for (const group of product.variants ?? []) {
    if (group.options[0]) selection[group.groupName] = group.options[0];
  }
  return selection;
}

export function calculateB2BUnitPrice(
  product: Pick<B2BProduct, "basePrice">,
  selectedVariants: Record<string, B2BVariant> = {},
): number {
  const modifiers = Object.values(selectedVariants).reduce((sum, variant) => sum + (variant.priceModifier || 0), 0);
  return product.basePrice + modifiers;
}

export function buildB2BCartItem(
  product: B2BProduct,
  selectedVariants: Record<string, B2BVariant> = getDefaultVariantSelection(product),
  quantity = 1,
): B2BCartItem {
  const variantHash = Object.values(selectedVariants).map((variant) => variant.id).sort().join("-");
  return {
    ...product,
    cartItemId: `${product.id}-${variantHash}`,
    quantity,
    selectedVariants,
    finalUnitPrice: calculateB2BUnitPrice(product, selectedVariants),
  };
}

export function addB2BCartItem(cart: B2BCartItem[], nextItem: B2BCartItem): B2BCartItem[] {
  const existing = cart.find((item) => item.cartItemId === nextItem.cartItemId);
  if (!existing) return [...cart, nextItem];

  return cart.map((item) =>
    item.cartItemId === nextItem.cartItemId
      ? { ...item, quantity: item.quantity + nextItem.quantity }
      : item,
  );
}

export function updateB2BCartQuantity(cart: B2BCartItem[], cartItemId: string, delta: number): B2BCartItem[] {
  return cart
    .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item))
    .filter((item) => item.quantity > 0);
}

export function removeB2BCartItem(cart: B2BCartItem[], cartItemId: string): B2BCartItem[] {
  return cart.filter((item) => item.cartItemId !== cartItemId);
}

export function calculateB2BCartTotals(cart: B2BCartItem[]) {
  return {
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.reduce((sum, item) => sum + item.quantity * item.finalUnitPrice, 0),
    hasUnpricedItems: cart.some((item) => item.finalUnitPrice === 0),
  };
}

export function buildB2BWhatsAppQuote(input: {
  cart: B2BCartItem[];
  companyName?: string;
  title?: string;
  closingNote?: string;
}) {
  const { cart, companyName, title = "NUEVA SOLICITUD DE PEDIDO B2B", closingNote } = input;
  const totals = calculateB2BCartTotals(cart);
  const lines: string[] = [];

  lines.push(`*${title}*`);
  lines.push(`Empresa: *${(companyName || "Sin especificar").trim()}*`);
  lines.push("────────────────────");

  cart.forEach((item, index) => {
    lines.push("");
    lines.push(`*${index + 1}. ${item.name}* (x${item.quantity})`);
    for (const [groupName, variant] of Object.entries(item.selectedVariants)) {
      lines.push(`- ${groupName}: ${variant.label}`);
    }
    lines.push(
      item.finalUnitPrice > 0
        ? `- Unitario: $${item.finalUnitPrice.toLocaleString("es-CL")}`
        : "- Precio: a cotizar",
    );
  });

  lines.push("");
  lines.push("────────────────────");
  lines.push(
    totals.hasUnpricedItems
      ? "*TOTAL: Pendiente de cotización formal.*"
      : `*TOTAL ESTIMADO: $${totals.total.toLocaleString("es-CL")}*`,
  );
  if (closingNote) lines.push(closingNote);

  return lines.join("\n");
}
