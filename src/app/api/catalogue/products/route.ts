import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CreateProductSchema, ProductQuerySchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);
    console.log(user);

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
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          media: true,
          variants: true,
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);

    return success(
      {
        pagination: { page, limit, total, totalPages },
        products,
      },
      'Successful retrieval'
    );
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));
    }

    const { name, price, media, categoryId, ...data } = parsed.data;
    // 3️⃣ Ensure category exists and belongs to this business
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
    return success({ product }, 'Product created successfully', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
