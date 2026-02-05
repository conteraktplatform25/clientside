import { ApplicationRoleSchema } from '@/lib/schemas/business/server/settings.schema';
import z from 'zod';

// }
export type TRPROle = z.infer<typeof ApplicationRoleSchema>;

export interface RPPermission {
  id: number;
  name: string;
  group_name: string | null;
}

export type TRPGroupedPermissions = Record<string, RPPermission[]>;
