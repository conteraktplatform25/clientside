import { PrismaClient } from '@prisma/client';
import { data_permission_access } from '../seedData/access-manager/permission';

const prisma = new PrismaClient();

export const PermissionSeeder = async () => {
  for (const permit of data_permission_access) {
    try {
      const existingPermit = await prisma.permission.findUnique({ where: { name: permit.name } });
      if (existingPermit) {
        console.error(`❌ ${permit.name} already exist in the permission table.`);
        continue;
      }

      await prisma.permission.upsert({
        where: { name: permit.name },
        update: {},
        create: {
          group_name: permit.group_name,
          name: permit.name,
        },
      });
    } catch (err) {
      console.error(`❌ Error upserting Permission Access ${permit.name}:`, err);
    }
  }
};
