import { api } from '../config/api';
import type { Customer, LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export async function register(body: RegisterRequest): Promise<Customer> {
  const { data } = await api.post<Customer>('/auth/register', body);
  return data;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function getMe(): Promise<Customer> {
  const { data } = await api.get<Customer>('/customers/me');
  return data;
}
