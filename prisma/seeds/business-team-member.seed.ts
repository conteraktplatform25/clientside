import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const BusinessTeamMemberSeeder = async () => {
  try {
    // Get Business Owner details
    const business_profile = await prisma.businessProfile.findFirst({
      where: { userId: '414419ab-26e6-4429-8fdc-b823ef7da689' },
      include: {
        user: {
          include: { role: true },
        },
      },
    });
    if (!business_profile) {
      console.error(`❌ Business Owner current does not exist.`);
      return null;
    }
    await prisma.businessTeamProfile.upsert({
      where: {
        businessProfileId_userId: {
          businessProfileId: business_profile.id,
          userId: '414419ab-26e6-4429-8fdc-b823ef7da689',
        },
      },
      update: {},
      create: {
        businessProfileId: business_profile.id,
        userId: '414419ab-26e6-4429-8fdc-b823ef7da689',
        roleId: business_profile.user.role.id,
        status: 'ACTIVE',
        joined_at: business_profile.created_at,
        created_at: business_profile.created_at,
        updated_at: business_profile.updated_at,
        is_admin: true,
      },
    });
  } catch (err) {
    console.error(`❌ Failed to Push Role-Permission`, err);
  }
};
