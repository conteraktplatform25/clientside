import { PrismaClient } from '@prisma/client';
import { super_admin_users } from '../seedData/user/admin-user.data';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const AdminUserSeeder = async () => {
  for (const user of super_admin_users) {
    const fullName = `${user.first_name} ${user.last_name}`;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (existingUser) {
        console.error(`❌ ${user.email} already exist in storage.`);
        continue;
      }

      const superAdminRole = await prisma.role.findFirst({ where: { name: 'Super_Admin' } });
      if (!superAdminRole) {
        console.error(`❌ Super Admin Role does not exist.`);
        continue;
      }

      const hashedPassword = user.password ? await bcrypt.hash(user.password, 12) : null;
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          password: hashedPassword,
        },
        create: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          password: hashedPassword,
          email_verified_date: new Date(),
          is_activated: true,
          roleId: superAdminRole.id,
        },
      });
    } catch (err) {
      console.error(`❌ Error upserting Super Admin ${fullName}:`, err);
    }
  }
};
