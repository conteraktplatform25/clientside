import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import slugify from 'slugify';
import { UpdateProductSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';

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

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = UpdateProductSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const { categoryId, name, price, media, ...data } = parsed.data;

    // 3️⃣ Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: { id, businessProfileId },
      include: { media: true },
    });
    if (!existingProduct) return failure('Product not found.', 404);

    // 4️⃣ Validate category if changed
    if (categoryId && categoryId !== existingProduct.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, businessProfileId },
        select: { id: true },
      });
      if (!category) return failure('Invalid category: not found or not in your business.', 400);
    }

    // 5️⃣ Build update payload
    const updateData: Prisma.ProductUpdateInput = {
      ...data,
    };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (price !== undefined) {
      updateData.price = new Prisma.Decimal(price);
    }

    if (categoryId) {
      updateData.category = { connect: { id: categoryId } };
    }

    // 6️⃣ Handle ProductMedia updates
    if (media) {
      // delete existing and recreate (simpler and safe)
      await prisma.productMedia.deleteMany({ where: { productId: id } });

      if (media.length > 0) {
        updateData.media = {
          create: media.map((m) => ({
            url: m.url,
            altText: m.altText ?? null,
            order: m.order ?? 0,
          })),
        };
      }
    }

    // 7️⃣ Execute update
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { media: true, category: true },
    });

    return success({ updatedProduct }, 'Product updated successfully', 200);
  } catch (err) {
    return failure(getErrorMessage(err), 500);
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
