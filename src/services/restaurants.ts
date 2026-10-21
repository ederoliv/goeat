import axios from 'axios';
import { api } from '../config/api';
import type {
  Menu, MenuSectionInfo, MenuSectionRequest, Order, OrderStatus, Product, ProductRequest,
  Restaurant, RestaurantAccount, RestaurantLoginResponse, RestaurantRegisterRequest, RestaurantUpdateRequest,
  LoginRequest, AddressRequest, RestaurantAddress,
} from '../types/api';

// ---- public browsing ----

export async function getRestaurants(cuisine?: string): Promise<Restaurant[]> {
  const { data } = await api.get<Restaurant[]>('/restaurants', { params: { cuisine } });
  return data;
}

export async function getRestaurant(id: number): Promise<Restaurant> {
  const { data } = await api.get<Restaurant>(`/restaurants/${id}`);
  return data;
}

// 404 means the restaurant does not exist.
export async function getMenu(restaurantId: number): Promise<Menu | null> {
  try {
    const { data } = await api.get<Menu>(`/restaurants/${restaurantId}/menu`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

// ---- restaurant account ----

export async function registerRestaurant(body: RestaurantRegisterRequest): Promise<RestaurantAccount> {
  const { data } = await api.post<RestaurantAccount>('/auth/restaurants/register', body);
  return data;
}

export async function loginRestaurant(body: LoginRequest): Promise<RestaurantLoginResponse> {
  const { data } = await api.post<RestaurantLoginResponse>('/auth/restaurants/login', body);
  return data;
}

export async function getMyRestaurant(): Promise<RestaurantAccount> {
  const { data } = await api.get<RestaurantAccount>('/restaurants/me');
  return data;
}

export async function updateMyRestaurant(body: RestaurantUpdateRequest): Promise<RestaurantAccount> {
  const { data } = await api.put<RestaurantAccount>('/restaurants/me', body);
  return data;
}

export async function saveMyAddress(body: AddressRequest): Promise<RestaurantAddress> {
  const { data } = await api.put<RestaurantAddress>('/restaurants/me/address', body);
  return data;
}

// ---- menu management (own restaurant only) ----

export async function createSection(restaurantId: number, body: MenuSectionRequest): Promise<MenuSectionInfo> {
  const { data } = await api.post<MenuSectionInfo>(`/restaurants/${restaurantId}/menu/sections`, body);
  return data;
}

export async function updateSection(restaurantId: number, sectionId: number, body: MenuSectionRequest): Promise<MenuSectionInfo> {
  const { data } = await api.put<MenuSectionInfo>(`/restaurants/${restaurantId}/menu/sections/${sectionId}`, body);
  return data;
}

export async function deleteSection(restaurantId: number, sectionId: number): Promise<void> {
  await api.delete(`/restaurants/${restaurantId}/menu/sections/${sectionId}`);
}

export async function createProduct(restaurantId: number, body: ProductRequest): Promise<Product> {
  const { data } = await api.post<Product>(`/restaurants/${restaurantId}/products`, body);
  return data;
}

export async function updateProduct(restaurantId: number, productId: number, body: ProductRequest): Promise<Product> {
  const { data } = await api.put<Product>(`/restaurants/${restaurantId}/products/${productId}`, body);
  return data;
}

export async function deleteProduct(restaurantId: number, productId: number): Promise<void> {
  await api.delete(`/restaurants/${restaurantId}/products/${productId}`);
}

// ---- orders received ----

export async function getReceivedOrders(status?: OrderStatus): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/restaurants/me/orders', { params: { status } });
  return data;
}

// 409 when the change is not allowed from the current status (see lib/orderFlow).
export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/restaurants/me/orders/${id}/status`, { status });
  return data;
}
