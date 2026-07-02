'use client';

import { useSessionStore } from '@/lib/store/auth/auth-session.store';
import { ICurrentSessionUser } from '@/types/auth/auth-user.type';
import { useEffect } from 'react';

interface ISessionProviderProps {
  children: React.ReactNode;
  sessionUser: ICurrentSessionUser | null;
}

const SessionProvider = ({ children, sessionUser }: ISessionProviderProps) => {
  const hydrateSession = useSessionStore((state) => state.hydrateSession);

  useEffect(() => {
    hydrateSession(sessionUser);
  }, [sessionUser, hydrateSession]);

  return children;
};

export default SessionProvider;
