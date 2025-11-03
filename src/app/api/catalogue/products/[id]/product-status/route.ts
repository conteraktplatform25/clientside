import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { UpdateProductStatusSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = UpdateProductStatusSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const { status, deleted, ...data } = parsed.data;

    // 3️⃣ Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: { id, businessProfileId },
      select: { id: true, deleted: true },
    });
    if (!existingProduct) return failure('Product not found or not in your business.', 404);

    // 4️⃣ Build update payload
    const updateData: Prisma.ProductUpdateInput = {
      ...data,
    };
    if (status) updateData.status = status;
    if (deleted !== undefined) {
      updateData.deleted = deleted;
      updateData.deletedAt = deleted ? new Date() : null;
    }
    if (Object.keys(updateData).length === 0) return failure('No valid update fields provided.', 400);

    // 5️⃣ Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        status: true,
        deleted: true,
        deletedAt: true,
      },
    });
    return success({ product: updatedProduct }, 'Product updated successfully', 200);
  } catch (err) {
    return failure(getErrorMessage(err), 500);
  }
}
