'use client';

import { TAppRole } from '@/lib/hooks/default.hook';
import { useAuthStore } from '@/lib/store/auth/auth.store';
import { ReactNode } from 'react';
//import { useAuthStore } from '@/lib/store/auth/useAuthStore';

interface RequirePermissionProps {
  allowedRoles: Array<'Business' | 'Managers' | 'Agent'>;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequirePermission({ allowedRoles, children, fallback = null }: RequirePermissionProps) {
  const role = useAuthStore((s) => s.role);
  if (!role) return null;

  if (!allowedRoles.includes(role as TAppRole)) {
    return fallback;
  }

  return <>{children}</>;
}
