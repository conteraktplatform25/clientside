import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CreateVariantSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
    });

    return success({ variants }, 'Successful retrieval');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);
    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    const body = await req.json();
    const parsed = CreateVariantSchema.safeParse(body);
    if (!parsed.success) return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));

    const variant = await prisma.productVariant.create({
      data: { ...parsed.data, productId: id },
    });
    return success({ variant }, 'Successful creation', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
