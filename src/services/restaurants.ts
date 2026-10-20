import axios from 'axios';
import { api } from '../config/api';
import type { MenuItem, Restaurant } from '../types/api';

export async function getRestaurants(cuisine?: string): Promise<Restaurant[]> {
  const { data } = await api.get<Restaurant[]>('/restaurants', { params: { cuisine } });
  return data;
}

export async function getRestaurant(id: number): Promise<Restaurant> {
  const { data } = await api.get<Restaurant>(`/restaurants/${id}`);
  return data;
}

// The API answers 404 for an unknown restaurant or when the category filter matches
// nothing; the contract says to treat that as "no items".
export async function getMenu(restaurantId: number, category?: string): Promise<MenuItem[]> {
  try {
    const { data } = await api.get<MenuItem[]>(`/restaurants/${restaurantId}/menu`, { params: { category } });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return [];
    throw error;
  }
}
