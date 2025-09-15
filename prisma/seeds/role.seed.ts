import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const RoleSeeder = async () => {
  const roles = [
    {
      name: 'Admin',
      alias: 'administrator',
      is_admin: true,
      is_default: false,
    },
    {
      name: 'Business',
      alias: 'business owner',
      is_admin: false,
      is_default: true,
    },
    {
      name: 'Agent',
      alias: 'agent',
      is_admin: false,
      is_default: true, // You can decide which one is default
    },
    {
      name: 'Support',
      alias: 'support',
      is_admin: false,
      is_default: false,
    },
  ];

  for (const role of roles) {
    try {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {
          alias: role.alias,
          is_admin: role.is_admin,
          is_default: role.is_default,
        },
        create: {
          name: role.name,
          alias: role.alias,
          is_admin: role.is_admin,
          is_default: role.is_default,
        },
      });
      console.log(`Upserted role: ${role.name}`);
    } catch (error) {
      console.error(`Error upserting role ${role.name}:`, error);
    }
  }

  console.log('Roles seeded successfully');
};
