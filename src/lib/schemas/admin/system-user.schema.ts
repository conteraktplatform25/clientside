import { AdminOnboardingStatusEnum } from '@/lib/enums/admin/admin-onboarding-status.enum';
import { SystemAdminRoleEnum } from '@/lib/enums/admin/system-admin-role.enum';
import z from 'zod';

export const InviteUserSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  phone_number: z.string(),
  email: z.email(),
  role: z.string(),
});

export const SystemUserPermissionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const InvitationUserResponseSchema = z.object({
  id: z.uuid(),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  phone_number: z.string(),
  email: z.email(),
  role: z.enum(Object.values(SystemAdminRoleEnum)),
  status: z.enum(Object.values(AdminOnboardingStatusEnum)),
  last_login: z.string().optional().nullable(),
  created_at: z.coerce.date(),
  permission: z.array(SystemUserPermissionSchema).optional().nullable(),
});
