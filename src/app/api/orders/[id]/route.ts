import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { UpdateOrderSchema } from '@/lib/schemas/business/server/order.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { contact: true, OrderItem: true },
    });
    if (!order) return failure('Client Order not found', 404);

    return success({ order }, 'Successful retrieval');
  } catch (err) {
    console.error('GET /orders/[id] error:', err);
    return failure(getErrorMessage(err), 401);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(UpdateOrderSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { ...data } = validation.data;

    // 3️⃣ Verify Order profile and its Ownership
    const existingOrder = await prisma.order.findFirst({
      where: { id, businessProfileId },
      include: { contact: true, OrderItem: true },
    });
    if (!existingOrder) return failure('Contact profile not found.', 404);

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        payment_status: data.payment_status,
        notes: data.notes,
        delivery_address: data.delivery_address,
      },
    });

    return success({ updatedOrder }, 'Client Order updated successfully', 200);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business', 'Admin'])) return failure('Forbidden: Insufficient permissions', 403);

    await prisma.order.delete({ where: { id } });
    return success(null, 'Client Order deleted');
  } catch (err) {
    return failure(getErrorMessage(err), 500);
  }
}
