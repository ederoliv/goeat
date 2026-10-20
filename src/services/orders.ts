import { api } from '../config/api';
import type { CreateOrderRequest, Order } from '../types/api';

// Public: works with or without a customer token.
export async function createOrder(body: CreateOrderRequest): Promise<Order> {
  const { data } = await api.post<Order>('/orders', body);
  return data;
}

export async function trackOrder(trackingCode: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/track/${trackingCode}`);
  return data;
}

// Customer token required.
export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders');
  return data;
}
