import prisma from '@/lib/prisma';
import { TApplicationRoleList } from '@/lib/hooks/default.hook';

let cachedApplicationRoles: TApplicationRoleList | null = null;

export async function serviceLoadApplicationRoles() {
  if (!cachedApplicationRoles) {
    cachedApplicationRoles = await prisma.role.findMany({
      where: { is_admin: false },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  return cachedApplicationRoles;
}
