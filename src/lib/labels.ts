import type { FulfillmentType, OrderStatus, PaymentMethod } from '../types/api';

export const orderStatusLabels: Record<OrderStatus, string> = {
  Pending: 'Aguardando confirmação',
  Confirmed: 'Confirmado',
  Preparing: 'Em preparo',
  OutForDelivery: 'Saiu para entrega',
  Delivered: 'Entregue',
  Cancelled: 'Cancelado',
};

export const fulfillmentLabels: Record<FulfillmentType, string> = {
  Delivery: 'Entrega',
  Pickup: 'Retirada no local',
};

export const paymentLabels: Record<PaymentMethod, string> = {
  Cash: 'Dinheiro',
  CreditCard: 'Cartão de crédito',
  DebitCard: 'Cartão de débito',
  Pix: 'Pix',
};
