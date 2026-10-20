// Mirrors docs/api-contract.md (Goeat API). Update both together.

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  isOpen: boolean;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
}
