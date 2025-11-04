import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { CreateOrderItemSchema } from '@/lib/schemas/business/server/order-item.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const orderItem = prisma.orderItem.findMany({
      where: { orderId: id },
      select: {
        id: true,
        orderId: true,
        name: true,
        quantity: true,
        price: true,
        total: true,
      },
    });
    if (!orderItem) return failure('Client Order Items not found', 404);

    return success({ orderItem }, 'Successful retrieval');
  } catch (err) {
    console.error('GET /orders/[orderid]/items error:', err);
    return failure(getErrorMessage(err), 401);
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(CreateOrderItemSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { ...data } = validation.data;

    const order_item = await prisma.orderItem.create({
      data: {
        orderId: id,
        ...data,
        total: data.quantity * data.price,
      },
    });
    return success({ order_item }, 'Client Order Item inserted successfully', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
