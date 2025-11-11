import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  CreateProductSchema,
  ProductDetailResponseSchema,
  ProductQuerySchema,
  ProductResponseListSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
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
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          media: true,
        },
        // include: {
        //   category: { select: { name: true } },
        //   media: true,
        //   variants: true,
        // },
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

    const validation = await validateRequest(CreateProductSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { name, price, media, categoryId, ...data } = validation.data;

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

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        businessProfileId,
        categoryId,
        price: new Prisma.Decimal(price),
        media:
          media && media.length > 0
            ? {
                create: media.map((m) => ({
                  url: m.url,
                  altText: m.altText ?? null,
                  order: m.order ?? 0,
                })),
              }
            : undefined,
        ...data,
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
