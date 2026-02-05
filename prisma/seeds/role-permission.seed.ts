import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const RolePermissionSeeder = async () => {
  try {
    // Get Business Owner details
    const owner_profile = await prisma.role.findFirst({ where: { is_default: true } });
    if (!owner_profile) {
      console.error(`❌ Business Owner current does not exist.`);
      return null;
    }
    const allPermissions = await prisma.permission.findMany();

    await prisma.$transaction(
      allPermissions.map((permit) =>
        prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: owner_profile.id,
              permissionId: permit.id,
            },
          },
          update: {},
          create: {
            roleId: owner_profile.id,
            permissionId: permit.id,
          },
        }),
      ),
    );
  } catch (err) {
    console.error(`❌ Failed to Push Role-Permission`, err);
  }
};
