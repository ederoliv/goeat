import axios from "axios";

const TOKEN_KEY = "goeat.auth";

export interface StoredAuth {
  accessToken: string;
  expiresAt: string;
}

export function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const auth = JSON.parse(raw) as StoredAuth;
    return new Date(auth.expiresAt) > new Date() ? auth : null;
  } catch {
    return null;
  }
}

export function storeAuth(auth: StoredAuth | null) {
  if (auth) localStorage.setItem(TOKEN_KEY, JSON.stringify(auth));
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const auth = readStoredAuth();
  if (auth) config.headers.Authorization = `Bearer ${auth.accessToken}`;
  return config;
});

// There is no refresh token: an expired or invalid token means logging in again.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

api.interceptors.response.use(undefined, (error) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && readStoredAuth()) {
    storeAuth(null);
    onUnauthorized?.();
  }
  return Promise.reject(error);
});
