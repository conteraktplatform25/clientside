// src/api/catalogue/products/desktop

import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import prisma from '@/lib/prisma';
import { CreateProductSchema, ProductDesktopResponseListSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import slugify from 'slugify';
import { TUploadedMedia } from '@/lib/hooks/business/catalogue-sharing.hook';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);
    console.log(user);

    if (user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile[0].id;

    // ✅ Fetch data
    const productData = await prisma.product.findMany({
      where: { businessProfileId, deleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!productData) return failure('Business profile not found', 404);
    const products = ProductDesktopResponseListSchema.parse(productData);
    return success(
      {
        products,
      },
      'Successful retrieval'
    );
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/catalogue/products/desktop error:', message);
    return failure(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    if (user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile[0].id;

    const formData = await req.formData();

    const payload = JSON.parse(formData.get('payload') as string);
    const files = formData.getAll('images') as File[];

    //const validation = await validateRequest(CreateProductSchema, req);
    const validation = CreateProductSchema.omit({ media: true }).safeParse(payload);
    if (!validation.success) return failure(getErrorMessage(validation.error.flatten()), 401);

    const { name, price, categoryId, ...data } = validation.data;

    //Verify if product name previously exist
    const productExist = await prisma.product.findFirst({
      where: {
        businessProfileId,
        name,
      },
      select: { id: true },
    });
    if (!!productExist) return failure('Product already exist.', 409);

    // Ensure category exists and belongs to this business
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        businessProfileId,
      },
      select: { id: true },
    });
    if (!category) return failure('Invalid category: not found or not in your business.', 400);

    // 🔼 Upload images to Supabase
    const uploadedMedia: TUploadedMedia[] = [];
    if (files && files.length > 0) {
      const generatedCryptoValue = crypto.randomUUID();
      for (let i = 0; i < files.length; i++) {
        const order = i + 1;
        const file = files[i];
        const ext = file.name.split('.').pop();
        const filePath = `uploads/products/${businessProfileId}/${generatedCryptoValue}_${order}.${ext}`;

        const { error } = await supabase.storage.from('contakt_assets').upload(filePath, file);
        if (error) {
          throw new Error(`Image upload failed: ${error.message}`);
        }

        const { data } = supabase.storage.from('contakt_assets').getPublicUrl(filePath);
        uploadedMedia.push({
          url: data.publicUrl,
          altText: name,
          order,
        });
      }
    }

    await prisma.product.create({
      data: {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        businessProfileId,
        categoryId,
        price: new Prisma.Decimal(price),
        description: data.description ?? null,
        sku: data.sku ?? null,
        stock: data.stock ?? 0,
        currency: data.currency,
        media:
          uploadedMedia.length > 0
            ? {
                create: uploadedMedia.map((m) => ({
                  url: m!.url,
                  altText: m!.altText ?? null,
                  order: m.order ?? 0,
                })),
              }
            : undefined,
      },
    });
    // ProductDetailResponseSchema

    const sortBy = 'created_at';
    const sortOrder = 'desc';

    const productData = await prisma.product.findMany({
      where: { businessProfileId, deleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
    });
    if (!productData) return failure('Business profile not found', 404);
    const products = ProductDesktopResponseListSchema.parse(productData);
    return success({ products }, 'Product created successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/catalogue/products/desktop error:', message);
    return failure(message, 500);
  }
}
