import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import slugify from 'slugify';
import {
  CategoryDetailsResponseSchema,
  CategoryResponseSchema,
  UpdateCategoryRequestSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { validateRequest } from '@/lib/helpers/validation-request.helper';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const category = await prisma.category.findUnique({
      where: { id },
      include: { subCategories: true },
    });
    if (!category) return failure('Category not found', 404);

    const response = CategoryDetailsResponseSchema.parse(category);
    return success({ response }, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/catalogue/categories/{id} error:', message);
    return failure(message, 500);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    if (user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    // const json = await req.json();

    // const parsed = UpdateCategorySchema.safeParse(json);
    const validation = await validateRequest(UpdateCategoryRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const data = validation.data;
    const profile = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    if (!profile) {
      return failure('Category does not currently exists. Contact Support for more information.', 409);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name || profile.name,
        description: data.description || profile.description,
        slug: data.name ? slugify(data.name) : profile.slug,
        updated_at: new Date(),
      },
    });

    const response = CategoryResponseSchema.parse(updatedCategory);
    return success({ response }, 'Successful updated Category');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('PATCH /api/catalogue/categories/{id} error:', message);
    return failure(message, 500);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    await prisma.category.delete({ where: { id } });
    return success(null, 'Category deleted');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('DELETE /api/catalogue/categories/{id} error:', message);
    return failure(message, 500);
  }
}
