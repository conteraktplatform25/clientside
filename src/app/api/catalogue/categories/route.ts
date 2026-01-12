// ../app/api/catalogue/categories/route.ts
//Handles GET all and POST create.
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import {
  CategoryDetailsResponseSchema,
  //CategoryResponseListSchema,
  CreateCategoryRequestSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { validateRequest } from '@/lib/helpers/validation-request.helper';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!user.businessProfile || user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const categories = await prisma.category.findMany({
      where: { businessProfileId, parentCategoryId: null },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    if (!categories) return failure('Business profile not found', 404);

    //const response = CategoryResponseListSchema.parse(categories);

    return success(categories, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/catalogue/categories error:', message);
    return failure(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    if (!user.businessProfile || user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile[0].id;

    const validation = await validateRequest(CreateCategoryRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { name, description } = validation.data;

    const slug = slugify(name, { lower: true, strict: true });

    const countCategory = await prisma.category.count({
      where: {
        businessProfileId,
        name,
      },
    });
    if (countCategory > 0) return failure('Category already exist.', 409);

    const category = await prisma.category.create({
      data: {
        businessProfileId,
        name,
        slug,
        description,
      },
    });

    const response = CategoryDetailsResponseSchema.parse(category);
    return success({ response }, 'Successful creation', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/catalogue/categories error:', message);
    return failure(message, 500);
  }
}
