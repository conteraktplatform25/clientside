import { getErrorMessage } from '@/utils/errors';
import prisma from '../prisma';
import { sendProductToWhatsappCatalog } from './whatsapp.webhook';
import { ProductResponseSchema } from '../schemas/business/server/catalogue.schema';

export async function syncProductToWhatsapp(productId: string) {
  const productData = await prisma.product.findUnique({
    where: { id: productId },
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
  if (!productData) return;
  const product = ProductResponseSchema.parse(productData);

  try {
    const catalogId = await sendProductToWhatsappCatalog(product);

    await prisma.product.update({
      where: { id: productId },
      data: {
        whatsappCatalogId: catalogId,
        whatsappSyncStatus: 'SYNCED',
        whatsappLastError: null,
      },
    });
  } catch (err) {
    const message = getErrorMessage(err);
    console.log('syncProductToWhatsapp library Function', message);
    await prisma.product.update({
      where: { id: productId },
      data: {
        whatsappSyncStatus: 'FAILED',
        whatsappLastError: getErrorMessage(err),
      },
    });
  }
}
