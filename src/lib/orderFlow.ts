import type { Order, OrderStatus } from '../types/api';

// Mirrors "Order status flow" in docs/api-contract.md. The API is the authority (409 on a bad change).

// Next step the restaurant can take; Pickup skips OutForDelivery.
export function nextStatus(order: Pick<Order, 'status' | 'fulfillmentType'>): OrderStatus | null {
  const delivery = order.fulfillmentType === 'Delivery';
  switch (order.status) {
    case 'Pending': return 'Confirmed';
    case 'Confirmed': return 'Preparing';
    case 'Preparing': return delivery ? 'OutForDelivery' : 'Delivered';
    case 'OutForDelivery': return 'Delivered';
    default: return null;
  }
}

export const restaurantCanCancel = (order: Pick<Order, 'status'>) =>
  order.status === 'Pending' || order.status === 'Confirmed' || order.status === 'Preparing';

export const customerCanCancel = (order: Pick<Order, 'status'>) => order.status === 'Pending';

export const isFinalStatus = (status: OrderStatus) => status === 'Delivered' || status === 'Cancelled';

// Label of the button that moves an order to `status`.
export const advanceLabels: Record<OrderStatus, string> = {
  Pending: '',
  Confirmed: 'Confirmar pedido',
  Preparing: 'Iniciar preparo',
  OutForDelivery: 'Saiu para entrega',
  Delivered: 'Marcar como entregue',
  Cancelled: 'Cancelar pedido',
};
