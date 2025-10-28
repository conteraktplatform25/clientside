// ../app/api/catalogue/categories/route.ts
//Handles GET all and POST create.
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { CreateCategorySchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    //console.log('Authorization Testing:', req);
    if (!user) return failure('Unauthorized', 404);

    if (user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile[0].id;

    const categories = await prisma.category.findMany({
      where: { businessProfileId, parentCategoryId: null },
      select: {
        id: true,
        name: true,
      },
    });

    return success({ categories }, 'Successful retrieval');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
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

    const body = await req.json();

    const parsed = CreateCategorySchema.safeParse(body);
    if (!parsed.success) return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));

    const { name, description, parentCategoryId } = parsed.data;

    const slug = slugify(name);

    const category = await prisma.category.create({
      data: {
        businessProfileId,
        name,
        slug,
        description,
        parentCategoryId,
      },
    });
    return success({ category }, 'Successful creation', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
