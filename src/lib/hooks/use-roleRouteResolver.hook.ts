import { resolveUserHomeRoute } from '@/middleware';
import { useSession } from 'next-auth/react';

export const useRoleRouteResolver = () => {
  const { data: session } = useSession();

  const roles = session?.user?.role as string | undefined;
  const homeRoute = resolveUserHomeRoute(roles);
  return homeRoute;
};
