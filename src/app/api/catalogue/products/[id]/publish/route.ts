// src/app/api/catalogue/products/[id]/publish/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { success, failure } from '@/utils/response';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { ProductStatus } from '@prisma/client';
import { getErrorMessage } from '@/utils/errors';
import { ProductResponseSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { syncProductToWhatsapp } from '@/lib/whatsapp/catalog-sync';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);
    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // 3️⃣ Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: { id, businessProfileId },
    });
    if (!existingProduct) return failure('Product not found or not in your business.', 404);

    // ✅ Optional: prevent re-publish
    if (existingProduct.status === ProductStatus.PUBLISHED) {
      return failure('Product is already published.', 400);
    }

    // ✅ Correct update
    const productData = await prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.PUBLISHED,
        whatsappSyncStatus: 'PENDING',
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        sku: true,
        stock: true,
        currency: true,
        status: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        media: true,
      },
    });
    const product = ProductResponseSchema.parse(productData);

    // 🔥 Trigger WhatsApp sync (async)
    queueWhatsappCatalogSync(product.id);

    return success({ product }, 'Product published successfully');
  } catch (err) {
    const message = getErrorMessage(err);
    console.log(`PATCH api/products/[${id}]/publish - `, message);
    return failure(message, 500);
  }
}

function queueWhatsappCatalogSync(productId: string) {
  // For now, fire and forget
  syncProductToWhatsapp(productId);

  // Later:
  // - BullMQ
  // - Supabase Edge Function
  // - Temporal
}
