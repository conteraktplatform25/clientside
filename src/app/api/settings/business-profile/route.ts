import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  BusinessSettingsResponseSchema,
  CreateBusinessSettingsSchema,
  UpdateBusinessSettingsSchema,
} from '@/lib/schemas/business/server/settings.schema';
import { defaultBusinessHours } from '@/utils/defaults.util';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const businessProfile = await prisma.businessProfile.findUnique({
      where: { id: businessProfileId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });
    if (!businessProfile) return failure('Business profile not found', 404);

    const response = BusinessSettingsResponseSchema.parse(businessProfile);

    return success(response, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/settings/business-profile error:', message);
    return failure(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const userId = user.id;
    if (!userId) return failure('User profile not configured.', 400);

    const validation = await validateRequest(CreateBusinessSettingsSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { company_name, phone_country_code, phone_number, business_hour, ...data } = validation.data;
    const countBusinessProfile = await prisma.businessProfile.count({
      where: {
        company_name,
      },
    });
    if (countBusinessProfile > 0) return failure('Business profile already exist.', 409);

    //Verify if phone number was updated also
    const phone_number_combined = phone_country_code ? `(${phone_country_code})${phone_number}` : phone_number;
    if (user.phone !== phone_number_combined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          phone: phone_number_combined,
          updated_at: new Date(),
        },
      });
    }

    const businessProfile = await prisma.businessProfile.create({
      data: {
        userId,
        company_name,
        phone_number: phone_number_combined,
        business_hour: business_hour ?? defaultBusinessHours(),
        ...data,
      },
      include: { user: true },
    });

    const response = BusinessSettingsResponseSchema.parse(businessProfile);
    return success({ response }, 'Business Profile updated successfully', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/settings/business-profile error:', message);
    return failure(message, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const userId = user.id;
    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!userId || !businessProfileId) return failure('User or Business profile not configured.', 400);

    const validation = await validateRequest(UpdateBusinessSettingsSchema, req);
    if (!validation.success) return failure(validation.response, 400);

    const data = validation.data;

    const profile = await prisma.businessProfile.findUnique({
      where: {
        id: businessProfileId,
      },
    });
    if (!profile) {
      return failure('Business does not currently exists. Contact Support for more information.', 409);
    }

    //Verify if phone number was updated also
    const phone_number_combined = data.phone_country_code
      ? `(${data.phone_country_code})${data.phone_number}`
      : data.phone_number;
    if (profile.phone_number !== phone_number_combined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          phone: phone_number_combined,
          updated_at: new Date(),
        },
      });
    }

    // Update business profile
    const updatedBusinessProfile = await prisma.businessProfile.update({
      where: { id: businessProfileId },
      data: {
        company_name: data.company_name || profile.company_name,
        phone_number: phone_number_combined || profile.phone_number,
        company_location: data.company_location || profile.company_location,
        company_website: data.company_website || profile.company_website,
        business_industry: data.business_industry || profile.business_industry,
        business_category: data.business_category || profile.business_category,
        annual_revenue: data.annual_revenue || profile.annual_revenue,
        business_email: data.business_email || profile.business_email,
        business_logo_url: data.business_logo_url || profile.business_logo_url,
        business_bio: data.business_bio || profile.business_bio,
        business_hour: data.business_hour!,
        updated_at: new Date(),
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    const response = BusinessSettingsResponseSchema.parse(updatedBusinessProfile);
    return success({ response }, 'Business Profile updated successfully', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('PATCH /api/settings/business-profile error:', message);
    return failure(message, 500);
  }
}
