export type PendingOrder = {
  id: string;
  order_number: string;
  order_type: string;
  customer_name: string | null;
  total: number;
  created_at: string;
};

export type StockProduct = {
  id: string;
  name: string;
  stock_quantity: number | null;
  price: number;
  min_stock: number | null;
};

export function getLowStockProducts(products: StockProduct[]) {
  return products.filter(product => {
    const minStock = product.min_stock || 10;
    return product.stock_quantity != null && product.stock_quantity <= minStock;
  });
}

export function getUnviewedLowStockCount(
  products: StockProduct[],
  viewedIds: Set<string>,
) {
  return getLowStockProducts(products).filter(product => !viewedIds.has(product.id)).length;
}

export function getFoodOpsNotificationCount(
  pendingOrders: PendingOrder[],
  products: StockProduct[],
  viewedIds: Set<string>,
) {
  return pendingOrders.length + getUnviewedLowStockCount(products, viewedIds);
}

export function formatOrderType(type: string) {
  const types: Record<string, string> = {
    dine_in: 'Mesa',
    takeaway: 'Para Llevar',
    delivery: 'Delivery',
  };

  return types[type] || type;
}

export function formatRelativeTime(timestamp: string, now = new Date()) {
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  return date.toLocaleDateString();
}
