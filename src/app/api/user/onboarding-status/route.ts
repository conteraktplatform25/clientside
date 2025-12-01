import { getServerSession } from 'next-auth';
//import authOptions from '../../auth/[...nextauth]/authOption';
import { authOptions } from '../../auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CategoryResponseListSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure } from '@/utils/response';

export async function GET() {
  try {
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

    const contacts = await prisma.contact.findMany({
      where: { businessProfileId, status: 'ACTIVE' },
      select: { id: true },
    });

    const getCategories = await prisma.category.findMany({
      where: { businessProfileId, parentCategoryId: null },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    const categories = CategoryResponseListSchema.parse(getCategories);

    const products = await prisma.product.findMany({
      where: { businessProfileId, deleted: false },
      select: { id: true },
    });

    const quickReplies = await prisma.quickReply.findMany({
      where: { businessProfileId, isActive: true },
      select: { id: true },
    });

    const onboardingStatus = {
      phoneNumber: !!user.phone,
      businessProfile: user.businessProfile.length > 0,
      contactInformation: contacts && contacts.length > 0 ? true : false,
      productCatalogue: products && products.length > 0 ? true : false,
      quickReplies: quickReplies && quickReplies.length > 0 ? true : false,
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
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/catalogue/categories error:', message);
    return failure(message, 500);
  }
}
