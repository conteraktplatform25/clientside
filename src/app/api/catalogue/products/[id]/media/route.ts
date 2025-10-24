import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CreateMediaSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const media = await prisma.productMedia.findMany({
      where: { productId: id },
      orderBy: { order: 'asc' },
    });

    return success({ media }, 'Successful retrieval');
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
    const parsed = CreateMediaSchema.safeParse(body);
    if (!parsed.success) return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));

    const variant = await prisma.productMedia.create({
      data: { ...parsed.data, productId: id },
    });
    return success({ variant }, 'Successful creation', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
