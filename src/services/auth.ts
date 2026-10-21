import { api } from '../config/api';
import type {
  Customer, CustomerAddress, CustomerAddressRequest, CustomerUpdateRequest, LoginRequest, LoginResponse, RegisterRequest,
} from '../types/api';

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

export async function updateMe(body: CustomerUpdateRequest): Promise<Customer> {
  const { data } = await api.put<Customer>('/customers/me', body);
  return data;
}

export async function getAddresses(): Promise<CustomerAddress[]> {
  const { data } = await api.get<CustomerAddress[]>('/customers/me/addresses');
  return data;
}

export async function createAddress(body: CustomerAddressRequest): Promise<CustomerAddress> {
  const { data } = await api.post<CustomerAddress>('/customers/me/addresses', body);
  return data;
}

export async function updateAddress(id: number, body: CustomerAddressRequest): Promise<CustomerAddress> {
  const { data } = await api.put<CustomerAddress>(`/customers/me/addresses/${id}`, body);
  return data;
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/customers/me/addresses/${id}`);
}
