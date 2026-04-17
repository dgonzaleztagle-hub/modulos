export type TicketOrderType = 'dine_in' | 'takeaway' | 'delivery' | string;
export type PaymentMethodType = 'cash' | 'card' | 'transfer' | 'other' | string | undefined;

export function formatTicketOrderType(
  type: TicketOrderType,
  variant: 'kitchen' | 'customer' = 'customer',
) {
  const kitchenTypes: Record<string, string> = {
    dine_in: 'MESA',
    takeaway: 'PARA LLEVAR',
    delivery: 'DELIVERY',
  };

  const customerTypes: Record<string, string> = {
    dine_in: 'Mesa',
    takeaway: 'Para Llevar',
    delivery: 'Delivery',
  };

  const dictionary = variant === 'kitchen' ? kitchenTypes : customerTypes;
  return dictionary[type] || type;
}

export function formatPaymentMethod(method?: PaymentMethodType) {
  const methods: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    other: 'Otro',
  };

  return method ? methods[method] || method : 'Pendiente';
}

export function getKitchenProductCount(items: Array<{ quantity: number }>) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
