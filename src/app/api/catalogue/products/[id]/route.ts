import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import slugify from 'slugify';
import { UpdateProductSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { media: true, variants: true },
    });

    if (!product) return failure('Category not found', 404);

    return success({ product }, 'Successful retrieval');
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
    const parsed = UpdateProductSchema.safeParse(json);
    if (!parsed.success) return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));

    const { name, ...data } = parsed.data;
    if (name) Object.assign(data, { name, slug: slugify(name) });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    return success({ updatedProduct }, 'Successful updated Category');
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

    await prisma.product.delete({ where: { id } });
    return success(null, 'Product deleted');
  } catch (err) {
    return failure(getErrorMessage(err), 500);
  }
}
