import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const NotificationTypeSeeder = async () => {
  const notificationType = [
    {
      name: 'SIGNUP_VERIFICATION',
    },
    {
      name: 'RESET_PASSWORD',
    },
  ];

  for (const type of notificationType) {
    try {
      await prisma.notificationType.upsert({
        where: { name: type.name },
        update: {},
        create: {
          name: type.name,
        },
      });
      console.log(`Upserted role: ${type.name}`);
    } catch (error) {
      console.error(`Error upserting role ${type.name}:`, error);
    }
  }

  console.log('Notification Type seeded successfully');
};
