import type { AddressRequest, RestaurantAddress } from '../types/api';

export interface AddressValues {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export const emptyAddress: AddressValues = {
  street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '',
};

export function toAddressValues(address: RestaurantAddress | null): AddressValues {
  if (!address) return emptyAddress;
  return { ...address, complement: address.complement ?? '' };
}

export function toAddressRequest(values: AddressValues): AddressRequest {
  return {
    street: values.street.trim(),
    number: values.number.trim(),
    complement: values.complement.trim() || null,
    neighborhood: values.neighborhood.trim(),
    city: values.city.trim(),
    state: values.state.trim().toUpperCase(),
    zipCode: values.zipCode.trim(),
  };
}

export function formatAddress(a: RestaurantAddress): string {
  const line = [`${a.street}, ${a.number}`, a.complement, a.neighborhood].filter(Boolean).join(' - ');
  return `${line} - ${a.city}/${a.state} - CEP ${a.zipCode}`;
}

