export type TableStatus = 'available' | 'occupied' | 'reserved';

export type TableLike = {
  id: string;
  table_number: string;
  status: TableStatus;
};

export type TableOrderLike = {
  id: string;
  total: number;
};

export function getTableStatusLabel(status: TableStatus) {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'occupied':
      return 'Ocupada';
    case 'reserved':
      return 'Reservada';
    default:
      return status;
  }
}

export function getTableStatusTone(status: TableStatus) {
  switch (status) {
    case 'available':
      return 'success';
    case 'occupied':
      return 'destructive';
    case 'reserved':
      return 'warning';
    default:
      return 'muted';
  }
}

export function calculateTableTotal(
  tableOrders: Record<string, TableOrderLike[]>,
  tableId: string,
) {
  const orders = tableOrders[tableId] || [];
  return orders.reduce((sum, order) => sum + order.total, 0);
}

export function buildMoveOrderPlan(params: {
  orderId: string;
  sourceTableId: string;
  targetTableId: string;
  remainingSourceOrders: number;
}) {
  return {
    orderUpdate: {
      orderId: params.orderId,
      nextTableId: params.targetTableId,
    },
    sourceTableUpdate:
      params.remainingSourceOrders === 0
        ? {
            tableId: params.sourceTableId,
            status: 'available' as const,
          }
        : null,
    targetTableUpdate: {
      tableId: params.targetTableId,
      status: 'occupied' as const,
    },
  };
}
