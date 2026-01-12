import { PrismaClient } from '@prisma/client';
import { categories } from '../seedData/product/categories';
import slugify from 'slugify';

const prisma = new PrismaClient();

export const ProductCategorySeeder = async () => {
  const businessProfileId = 'f71b3ce2-ba52-4cbe-b32d-651bfbdbe076';
  for (const category of categories) {
    const parentSlug = slugify(category.name, { lower: true, strict: true });
    try {
      // Create or update parent category
      const parent = await prisma.category.upsert({
        where: {
          businessProfileId_slug: {
            businessProfileId,
            slug: parentSlug,
          },
        },
        update: {
          description: category.description,
        },
        create: {
          businessProfileId,
          name: category.name,
          slug: parentSlug,
          description: category.description,
        },
      });

      console.log(`✅ Upserted parent category: ${category.name}`);

      // Handle subcategories
      if (category.subCategories && category.subCategories.length > 0) {
        for (const sub of category.subCategories) {
          const subSlug = slugify(`${category.name} ${sub.name}`, {
            lower: true,
            strict: true,
          });
          await prisma.category.upsert({
            where: {
              businessProfileId_slug: {
                businessProfileId,
                slug: subSlug,
              },
            },
            update: {
              description: sub.description,
              parentCategoryId: parent.id,
            },
            create: {
              businessProfileId,
              name: sub.name,
              slug: subSlug,
              description: sub.description,
              parentCategoryId: parent.id,
            },
          });
          console.log(`   ↳ Upserted subcategory: ${sub.name}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error upserting category ${category.name}:`, error);
    }
  }
};
