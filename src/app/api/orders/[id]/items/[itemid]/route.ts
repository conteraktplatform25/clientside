import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { UpdateOrderItemSchema } from '@/lib/schemas/business/server/order-item.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string; itemid: string }> }) {
  try {
    const { id, itemid } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemid },
      include: { order: true, product: true },
    });
    if (!orderItem) return failure('Client Order Item not found', 404);

    if (orderItem.orderId !== id) {
      return failure('Item does not belong to the specified order', 400);
    }

    return success({ orderItem }, 'Successful retrieval');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string; itemid: string }> }) {
  try {
    const { id, itemid } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(UpdateOrderItemSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { ...data } = validation.data;

    // 3️⃣ Verify Order profile and its Ownership
    const existingOrderItem = await prisma.orderItem.findFirst({
      where: { id: itemid },
    });
    if (!existingOrderItem) return failure('Client Order Item not found.', 404);

    if (existingOrderItem.orderId !== id) {
      return failure('Item does not belong to the specified order', 400);
    }

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: itemid },
      data: {
        ...data,
        total: (data.price ?? existingOrderItem.price) * (data.quantity ?? existingOrderItem.quantity),
      },
    });

    return success({ updatedOrderItem }, 'Client Order updated successfully', 200);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string; itemid: string }> }) {
  try {
    const { id, itemid } = await context.params;
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    await prisma.orderItem.delete({ where: { id: itemid, orderId: id } });
    return success(null, 'Client Order Item deleted');
  } catch (err) {
    return failure(getErrorMessage(err), 500);
  }
}
