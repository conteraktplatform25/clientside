import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { TUploadedMedia } from '@/lib/hooks/business/catalogue-sharing.hook';
import prisma from '@/lib/prisma';
import {
  CreateProductSchema,
  ProductDetailResponseSchema,
  ProductQuerySchema,
  ProductResponseListSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { supabase } from '@/lib/supabaseClient';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile[0].id;

    const { searchParams } = new URL(req.url);
    const parsed = ProductQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return failure(JSON.stringify(parsed.error.flatten()), 400);
    }

    const { page, limit, search, categoryId, minPrice, maxPrice, sortBy, sortOrder } = parsed.data;
    const skip = (page - 1) * limit;

    // ✅ Build dynamic filters
    const where: Prisma.ProductWhereInput = {
      businessProfileId,
      deleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // ✅ Fetch data
    const [productData, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);
    const products = ProductResponseListSchema.parse(productData);

    return success(
      {
        pagination: { page, limit, total, totalPages },
        products,
      },
      'Successful retrieval'
    );
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/catalogue/products error:', message);
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

    const product = await prisma.product.create({
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
      include: {
        media: true,
        category: { select: { id: true, name: true } },
      },
    });
    // ProductDetailResponseSchema
    const response = ProductDetailResponseSchema.parse(product);
    return success({ response }, 'Product created successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/catalogue/products error:', message);
    return failure(message, 500);
  }
}
