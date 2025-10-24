import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import slugify from 'slugify';
import { UpdateCategorySchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';

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

    return success({ category }, 'Successful retrieval');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    const json = await req.json();

    const parsed = UpdateCategorySchema.safeParse(json);

    if (!parsed.success) return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));

    const { name, description, parentCategoryId } = parsed.data;

    // ✅ Use a typed object, not any
    const data: Partial<{
      name: string;
      slug: string;
      description?: string | null;
      parentCategoryId?: string | null;
    }> = { description, parentCategoryId };
    if (name) {
      data.name = name;
      data.slug = slugify(name);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    return success({ updatedCategory }, 'Successful updated Category');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
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
    return failure(getErrorMessage(err), 500);
  }
}
