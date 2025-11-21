import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { OrderDetailsResponseSchema, UpdateOrderSchema } from '@/lib/schemas/business/server/order.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const responseData = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        order_number: true,
        status: true,
        total_amount: true,
        currency: true,
        payment_status: true,
        payment_method: true,
        delivery_address: true,
        notes: true,
        created_at: true,
        updated_at: true,
        contact: {
          select: {
            name: true,
            phone_number: true,
            email: true,
          },
        },
        OrderItem: {
          select: {
            name: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
      },
    });
    if (!responseData) return failure('Client Order not found', 404);

    const order_details = OrderDetailsResponseSchema.parse(responseData);

    return success({ order_details }, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/orders/[id] error:', err);
    return failure(message, 401);
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
      select: { id: true },
      //include: { contact: true, OrderItem: true },
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
    const message = getErrorMessage(err);
    console.error('PATCH /api/orders/[id] error:', err);
    return failure(message, 401);
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
    //return failure(getErrorMessage(err), 500);
    const message = getErrorMessage(err);
    console.error('DELETE /api/orders/[id] error:', err);
    return failure(message, 401);
  }
}
