// Mirrors docs/api-contract.md (Goeat API). Update both together.

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  isOpen: boolean;
  profileImageUrl: string | null;
  address: RestaurantAddress | null;
}

// Shared by restaurant and customer addresses.
export interface RestaurantAddress {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export type AddressRequest = Omit<RestaurantAddress, 'complement'> & { complement?: string | null };

export interface CustomerAddress extends RestaurantAddress {
  id: number;
  label: string;
  isPrimary: boolean;
}

export interface CustomerAddressRequest extends AddressRequest {
  label: string;
  isPrimary?: boolean;
}

export interface CustomerUpdateRequest {
  name: string;
  phone: string;
  profileImageUrl?: string | null;
}

// What a restaurant sees about itself.
export interface RestaurantAccount extends Restaurant {
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export interface RestaurantRegisterRequest {
  name: string;
  cuisine: string;
  email: string;
  phone: string;
  password: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
}

export interface RestaurantUpdateRequest {
  name: string;
  cuisine: string;
  phone: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  isOpen: boolean;
  // omitting it clears the image
  profileImageUrl?: string | null;
}

export interface Product {
  id: number;
  restaurantId: number;
  menuSectionId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface ProductRequest {
  menuSectionId: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable?: boolean;
}

export interface MenuSectionInfo {
  id: number;
  name: string;
  sortOrder: number;
}

export interface MenuSectionRequest {
  name: string;
  sortOrder?: number;
}

export interface MenuSection extends MenuSectionInfo {
  products: Product[];
}

export interface Menu {
  restaurantId: number;
  sections: MenuSection[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImageUrl: string | null;
  createdAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  customer: Customer;
}

export interface RestaurantLoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  restaurant: RestaurantAccount;
}

export type Role = 'customer' | 'restaurant';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
export type FulfillmentType = 'Delivery' | 'Pickup';
export type PaymentMethod = 'Cash' | 'CreditCard' | 'DebitCard' | 'Pix';

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  trackingCode: string;
  customerId: number | null;
  customerName: string;
  customerPhone: string;
  restaurantId: number;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  deliveryAddress: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  // when the status last changed; equals createdAt for a new order
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  restaurantId: number;
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  // guests only
  customerName?: string;
  customerPhone?: string;
  items: { productId: number; quantity: number }[];
}

// RFC 9457 problem details. `errors` (validation) uses PascalCase field paths.
export interface ProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
