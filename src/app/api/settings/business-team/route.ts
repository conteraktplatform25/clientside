import { authenticateRequest } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BusinessTeamQuerySchema, BusinessTeamListResponseSchema } from '@/lib/schemas/business/server/settings.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(BusinessTeamQuerySchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { page, limit, search } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.BusinessTeamProfileWhereInput = { businessProfileId };
    if (search) {
      where.OR = [
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { first_name: { contains: search, mode: 'insensitive' } } },
        { user: { last_name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    const [teamPaginated, total] = await Promise.all([
      prisma.businessTeamProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { joined_at: 'desc' },
        select: {
          id: true,
          joined_at: true,
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              image: true,
              phone: true,
            },
          },
          role: {
            select: {
              id: true,
              name: true,
              alias: true,
              is_admin: true,
            },
          },
        },
      }),
      prisma.businessTeamProfile.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const responseData = {
      pagination: { page, limit, total, totalPages },
      businessTeam: teamPaginated,
    };
    const business_team = BusinessTeamListResponseSchema.parse(responseData);

    return success(business_team, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/settings/business-team error:', message);
    return failure(message, 500);
  }
}
