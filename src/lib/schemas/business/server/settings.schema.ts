import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { PaginationResponSchema } from '../pagination.schema';

extendZodWithOpenApi(z);

export const UpdateUserSettingsSchema = z
  .object({
    first_name: z.string().nullable().openapi({ example: 'abcdef' }),
    last_name: z.string().nullable().openapi({ example: 'abcdef' }),
    image: z.string().nullable(),
    phone_country_code: z.string().min(1, 'Country code is required'),
    phone_number: z.string().min(6, 'Phone number is required'),
  })
  .openapi('UpdateUserSettings');

export const RoleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_admin: z.boolean().optional().nullable(),
});
export const ApplicationRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ApplicationRoleListSchema = z.array(ApplicationRoleSchema);

export const UserSettingsResponseSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    image: z.string().nullable(),
    phone: z.string().nullable(),
    email_verified_date: z.date().nullable(),
    is_activated: z.boolean(),
    is_deleted: z.boolean(),
    role: RoleResponseSchema,
  })
  .openapi('UserSettingsResponse');

export const BusinessHoursSchema = z.object({
  monday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  tuesday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  wednesday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  thursday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  friday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  saturday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  sunday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
});

export const CreateBusinessSettingsSchema = z
  .object({
    company_name: z.string(),
    phone_number: z.string().min(6, 'Phone number is required'),
    company_location: z.string().nullable().optional(),
    company_website: z.string().nullable().optional(),
    business_industry: z.string().nullable().optional(),
    business_category: z.string().nullable().optional(),
    annual_revenue: z.string().nullable().optional(),
    business_email: z.string().nullable().optional(),
    business_logo_url: z.string().nullable().optional(),
    business_bio: z.string().nullable().optional(),
    business_hour: BusinessHoursSchema.nullable().optional(),
  })
  .openapi('CreateBusinessSettings');

//export const UpdateBusinessSettingsSchema = CreateBusinessSettingsSchema.partial().openapi('UpdateBusinessSettings');
export const UpdateBusinessSettingsSchema = z
  .object({
    phone_number: z.string().min(6, 'Phone number is required'),
    company_location: z.string().nullable().optional(),
    company_website: z.string().nullable().optional(),
    business_industry: z.string().nullable().optional(),
    business_category: z.string().nullable().optional(),
    annual_revenue: z.string().nullable().optional(),
    business_email: z.string().nullable().optional(),
    business_logo_url: z.string().nullable().optional(),
    business_bio: z.string().nullable().optional(),
    business_hour: BusinessHoursSchema.nullable().optional(),
  })
  .openapi('UpdateBusinessSettings');

const UserBusinessSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  role: RoleResponseSchema,
});

export const BusinessSettingsResponseSchema = z
  .object({
    id: z.string(),
    company_name: z.string(),
    phone_number: z.string(),
    business_number: z.string().nullable(),
    company_location: z.string().nullable(),
    company_website: z.string().nullable(),
    business_industry: z.string().nullable(),
    business_category: z.string().nullable(),
    annual_revenue: z.string().nullable(),
    business_email: z.string().nullable(),
    business_logo_url: z.string().nullable(),
    business_bio: z.string().nullable(),
    business_hour: BusinessHoursSchema.optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    user: UserBusinessSchema,
  })
  .openapi('BusinessSettingsResponse');

/** User Team Settings here *********************************/
export const BusinessTeamQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(5).max(100).default(20),
  search: z.string().trim().optional(),
});

const User_TeamSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  image: z.string(),
  phone: z.string(),
  is_activated: z.boolean(),
});
const User_Team2Schema = z.object({
  id: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string(),
});

export const BusinessTeamSettingResponseSchema = z.object({
  id: z.string(),
  joined_at: z.coerce.date(),
  user: User_TeamSchema,
  role: RoleResponseSchema,
});

export const BusinessTeamListResponseSchema = z
  .object({
    pagination: PaginationResponSchema,
    businessTeam: z.array(BusinessTeamSettingResponseSchema),
  })
  .openapi('BusinessTeamListResponse');

export const InviteTeamMemberRequestSchema = z
  .object({
    email: z.email(),
    roleId: z.number(),
  })
  .openapi('InviteTeamMemberRequest');

export const InviteTeamMemberResponseSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    expiresAt: z.string().datetime(),
    createdAt: z.string().datetime(),
    role: z.object({
      name: z.string(),
    }),
    business: z.object({
      company_name: z.string(),
    }),
  })
  .openapi('InviteTeamMemberResponse');

export const MemberRegistrationFormSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.email({ message: 'Invalid email' }),
    phone_number: z.string().min(5, 'Invalid Phone Number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
    roleId: z.number(),
    invitedby: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })
  .openapi('MemberRegistrationForm');

export const MemberRegistrationResponseSchema = z
  .object({
    id: z.string(),
    status: z.string(),
    invited_by: z.string().nullable(),
    businessProfileId: z.string(),
    role: z.object({
      id: z.number(),
      name: z.string(),
    }),
    user: User_Team2Schema,
  })
  .openapi('MemberRegistrationResponse');

export const InvitedTeamMemberResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: ApplicationRoleSchema,
  invitedBy: User_Team2Schema,
  accepted: z.boolean(),
  createdAt: z.string().datetime(),
  business: z.object({ id: z.string(), company_name: z.string() }),
});

export const InvitedTeamMemberListResponseSchema = z
  .object({
    pagination: PaginationResponSchema,
    invitedTeam: z.array(InvitedTeamMemberResponseSchema),
  })
  .openapi('InvitedTeamMemberListResponse');
