import {
  InvitationUserResponseSchema,
  InviteUserSchema,
  SystemUserPermissionSchema,
} from '@/lib/schemas/admin/system-user.schema';
import z from 'zod';

export type TInviteUserRequest = z.infer<typeof InviteUserSchema>;
export type TInviteUserResponse = z.infer<typeof InvitationUserResponseSchema>;
export type TSystemUserPermission = z.infer<typeof SystemUserPermissionSchema>;
