export const SystemAdminRoleEnum = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
} as const;

export type SystemAdminRole = (typeof SystemAdminRoleEnum)[keyof typeof SystemAdminRoleEnum];
