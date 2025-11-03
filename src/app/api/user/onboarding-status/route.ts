import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      businessProfile: true,
    },
  });

  if (!user) {
    return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });
  }

  const businessProfileId = user.businessProfile[0].id;

  const categories = await prisma.category.findMany({
    where: { businessProfileId, parentCategoryId: null },
    select: {
      id: true,
      name: true,
      description: true,
      parentCategoryId: true,
    },
  });

  const product_count = await prisma.product.count({
    where: { businessProfileId },
  });

  const onboardingStatus = {
    phoneNumber: !!user.phone,
    businessProfile: user.businessProfile.length > 0,
    productCatalogue: product_count > 0,
    // quickReplies: user.quickReplies?.length > 0,
    // contactInformation: user.contactInformation?.length > 0,
    quickReplies: false,
    contactInformation: false,
  };
  const dependentField = {
    productCategoryList: categories,
  };

  const progress =
    (Object.values(onboardingStatus).filter(Boolean).length / Object.keys(onboardingStatus).length) * 100;
  const profile = {
    onboardingStatus,
    progress,
    dependentField,
  };
  return NextResponse.json({ ok: true, message: 'Successful Retrieval', profile }, { status: 200 });
}
