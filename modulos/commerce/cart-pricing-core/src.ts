export type DiscountType = 'percent' | 'fixed';

export type PromotionLike = {
  discount_type: DiscountType;
  discount_value: number;
};

export type MenuItemLike = {
  id: string;
  price: number;
};

export type CartItemLike<TMenuItem extends MenuItemLike = MenuItemLike> = {
  menu_item: TMenuItem;
  quantity: number;
  special_instructions?: string;
};

export function addCartItem<TMenuItem extends MenuItemLike>(
  items: CartItemLike<TMenuItem>[],
  item: TMenuItem,
  quantity = 1,
  instructions?: string,
) {
  const existing = items.find(cartItem => cartItem.menu_item.id === item.id);

  if (existing) {
    return items.map(cartItem =>
      cartItem.menu_item.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + quantity }
        : cartItem,
    );
  }

  return [
    ...items,
    {
      menu_item: item,
      quantity,
      special_instructions: instructions,
    },
  ];
}

export function removeCartItem<TMenuItem extends MenuItemLike>(
  items: CartItemLike<TMenuItem>[],
  menuItemId: string,
) {
  return items.filter(cartItem => cartItem.menu_item.id !== menuItemId);
}

export function updateCartItemQuantity<TMenuItem extends MenuItemLike>(
  items: CartItemLike<TMenuItem>[],
  menuItemId: string,
  quantity: number,
) {
  if (quantity <= 0) {
    return removeCartItem(items, menuItemId);
  }

  return items.map(cartItem =>
    cartItem.menu_item.id === menuItemId
      ? { ...cartItem, quantity }
      : cartItem,
  );
}

export function calculateCartSubtotal<TMenuItem extends MenuItemLike>(
  items: CartItemLike<TMenuItem>[],
) {
  return items.reduce(
    (sum, cartItem) => sum + cartItem.menu_item.price * cartItem.quantity,
    0,
  );
}

export function calculatePromotionDiscount(
  subtotal: number,
  promotion: PromotionLike | null | undefined,
) {
  if (!promotion) return 0;

  if (promotion.discount_type === 'percent') {
    return Math.round(subtotal * (promotion.discount_value / 100));
  }

  return Math.min(promotion.discount_value, subtotal);
}

export function calculateCartTotal(
  subtotal: number,
  promotion: PromotionLike | null | undefined,
) {
  return subtotal - calculatePromotionDiscount(subtotal, promotion);
}

export function getCartItemCount<TMenuItem extends MenuItemLike>(
  items: CartItemLike<TMenuItem>[],
) {
  return items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
}
