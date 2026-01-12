// src/lib/mock/system-adminuser.mock.ts

import { PermissionEnum } from '../enums/admin/permission.enum';
import { TInviteUserResponse, TSystemUserPermission } from '../hooks/admin/system-user.hook';
import { faker } from '@faker-js/faker';
import { SystemAdminRoleEnum } from '../enums/admin/system-admin-role.enum';
import { AdminOnboardingStatusEnum } from '../enums/admin/admin-onboarding-status.enum';

// export const permissionFactory = (): TSystemUserPermission => ({
//   id: faker.string.uuid(),
//   name: faker.helpers.enumValue(PermissionEnum),
// });

export const permissionFactory = (): TSystemUserPermission => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(Object.values(PermissionEnum)),
});

export const inviteUserFactory = (overrides?: Partial<TInviteUserResponse>): TInviteUserResponse => {
  const hasPermissions = faker.datatype.boolean();

  return {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(Object.values(SystemAdminRoleEnum)),
    status: faker.helpers.arrayElement(Object.values(AdminOnboardingStatusEnum)),
    last_login: faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.7 }),
    created_at: faker.date.past(),
    ...(hasPermissions && {
      permission: faker.helpers.multiple(permissionFactory, {
        count: { min: 1, max: 4 },
      }),
    }),
    permission: hasPermissions
      ? faker.helpers.multiple(permissionFactory, {
          count: { min: 1, max: 4 },
        })
      : faker.helpers.arrayElement([null, undefined]),
    ...overrides,
  };
};

export const inviteUserListFactory = (count = 10): TInviteUserResponse[] =>
  Array.from({ length: count }, () => inviteUserFactory());
