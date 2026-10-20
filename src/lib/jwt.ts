import type { Role } from '../types/api';

// Reads the `role` claim from the token payload (no signature check: the API validates tokens).
export function getTokenRole(token: string): Role | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const role = (JSON.parse(atob(payload)) as { role?: string }).role;
    return role === 'customer' || role === 'restaurant' ? role : null;
  } catch {
    return null;
  }
}
