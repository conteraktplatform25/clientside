import { PrismaClient } from '@prisma/client';
import { ProductCategorySeeder } from './seeds/product-category.seed';
// import { RoleSeeder } from './seeds/role.seed';
// import { NotificationTypeSeeder } from './seeds/notification-type.seed';
// import { NotificationTemplateSeeder } from './seeds/notification-template.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // await RoleSeeder();
  // await NotificationTypeSeeder();
  // await NotificationTemplateSeeder();
  await ProductCategorySeeder();

  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
