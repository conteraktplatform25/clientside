import { getServerSession } from 'next-auth';
//import authOptions from '../../auth/[...nextauth]/authOption';
import { authOptions } from '../../auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CategoryResponseListSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure } from '@/utils/response';
import { ApplicationRoleListSchema } from '@/lib/schemas/business/server/settings.schema';

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

    let connect_status = false;
    let phone_status = false;
    const whatsapp_connection = await prisma.whatsAppAccount.findUnique({
      where: { businessProfileId, status: 'META_AUTHORIZED' },
      select: { id: true, phoneNumberId: true },
    });
    if (whatsapp_connection) {
      connect_status = true;
      if (!whatsapp_connection.phoneNumberId) {
        phone_status = false;
      } else {
        const phone_number_connection = await prisma.whatsAppPhoneNumber.findUnique({
          where: { businessProfileId, phoneNumberId: whatsapp_connection.phoneNumberId },
          select: { id: true },
        });
        if (phone_number_connection) phone_status = true;
      }
    }

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

    const getRoles = await prisma.role.findMany({
      where: { is_admin: false },
      select: {
        id: true,
        name: true,
      },
    });
    const roles = ApplicationRoleListSchema.parse(getRoles);

    const products = await prisma.product.findMany({
      where: { businessProfileId, deleted: false },
      orderBy: { name: 'asc' },
      select: { id: true },
    });

    const quickReplies = await prisma.quickReply.findMany({
      where: { businessProfileId, isActive: true },
      select: { id: true },
    });

    const onboardingStatus = {
      phoneNumber: phone_status,
      businessProfile: connect_status,
      contactInformation: contacts && contacts.length > 0 ? true : false,
      productCatalogue: products && products.length > 0 ? true : false,
      quickReplies: quickReplies && quickReplies.length > 0 ? true : false,
    };
    const dependentField = {
      productCategoryList: categories,
      applicationRoleList: roles,
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
