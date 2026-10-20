import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { readStoredAuth, setUnauthorizedHandler, storeAuth } from '../config/api';
import { getTokenRole } from '../lib/jwt';
import * as authService from '../services/auth';
import * as restaurantService from '../services/restaurants';
import type {
  Customer, LoginRequest, RegisterRequest, RestaurantAccount, RestaurantRegisterRequest, Role,
} from '../types/api';

interface AuthContextData {
  role: Role | null;
  customer: Customer | null;
  restaurant: RestaurantAccount | null;
  // true while a stored token is being checked against the API
  loading: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  loginRestaurant: (body: LoginRequest) => Promise<void>;
  registerRestaurant: (body: RestaurantRegisterRequest) => Promise<void>;
  setRestaurant: (restaurant: RestaurantAccount) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantAccount | null>(null);
  const [loading, setLoading] = useState(() => readStoredAuth() !== null);

  const clearSession = () => {
    setCustomer(null);
    setRestaurant(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    const stored = readStoredAuth();
    if (stored) {
      const role = getTokenRole(stored.accessToken);
      const restore = role === 'restaurant'
        ? restaurantService.getMyRestaurant().then(setRestaurant)
        : authService.getMe().then(setCustomer);
      restore.catch(() => storeAuth(null)).finally(() => setLoading(false));
    }
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (body: LoginRequest) => {
    const { accessToken, expiresAt, customer } = await authService.login(body);
    storeAuth({ accessToken, expiresAt });
    clearSession();
    setCustomer(customer);
  };

  const register = async (body: RegisterRequest) => {
    await authService.register(body);
    await login({ email: body.email, password: body.password });
  };

  const loginRestaurant = async (body: LoginRequest) => {
    const { accessToken, expiresAt, restaurant } = await restaurantService.loginRestaurant(body);
    storeAuth({ accessToken, expiresAt });
    clearSession();
    setRestaurant(restaurant);
  };

  const registerRestaurant = async (body: RestaurantRegisterRequest) => {
    await restaurantService.registerRestaurant(body);
    await loginRestaurant({ email: body.email, password: body.password });
  };

  const logout = () => {
    storeAuth(null);
    clearSession();
  };

  const role: Role | null = restaurant ? 'restaurant' : customer ? 'customer' : null;

  return (
    <AuthContext.Provider
      value={{ role, customer, restaurant, loading, login, register, loginRestaurant, registerRestaurant, setRestaurant, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
