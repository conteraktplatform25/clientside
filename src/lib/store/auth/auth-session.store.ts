import { create } from 'zustand';
import { ICurrentSessionUser } from '@/types/auth/auth-user.type';

interface SessionState {
  session: ICurrentSessionUser | null;
  authenticated: boolean;
  loading: boolean;
  hydrateSession: (session: ICurrentSessionUser | null) => void;
  clearSession: () => void;
}
export const ROLE_HOME_ROUTES: Record<string, string> = {
  Super_Admin: '/admin',
  Admin: '/admin',
  Business: '/apps',
};

export function resolveUserHomeRoute(role?: string | null): string | null {
  if (!role) return null;

  return ROLE_HOME_ROUTES[role];
}

export const useSessionStore = create<SessionState>((set) => ({
  loading: false,
  session: null,
  authenticated: false,
  /**
   * Hydrate session
   */
  hydrateSession: (session) =>
    set({
      session,
      authenticated: !!session,
      loading: false,
    }),
  clearSession: () =>
    set({
      session: null,
      authenticated: false,
      loading: false,
    }),
}));
