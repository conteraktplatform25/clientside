import { ISelectOption } from '@/type/client/default.type';
import { ApplicationRoleListSchema } from '../schemas/business/server/settings.schema';
import z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/utils/response';

export function isSelectOption(opt: string | ISelectOption): opt is ISelectOption {
  return typeof opt === 'object' && 'value' in opt && 'label' in opt;
}
export type TAppRole = 'Business' | 'Managers' | 'Agent';
export type TApplicationRoleList = z.infer<typeof ApplicationRoleListSchema>;

/* ===========================================================================
   ===================== 🟠 Role Selections =====================
============================================================================== */

/* -----------------------------
   🟠 Get application roles
----------------------------- */
export const useGetSelectAppRoles = (options?: TApplicationRoleList) =>
  useQuery<TApplicationRoleList>({
    queryKey: ['select_roles'],
    queryFn: async () => {
      return fetchJSON<TApplicationRoleList>('/api/auth/role/application');
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options, // 👈 allow override
  });
