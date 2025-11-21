import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { failure, success } from '@/utils/response';
import { getErrorMessage } from '@/utils/errors';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import {
  UpdateOrderStatusRequestSchema,
  UpdateOrderStatusResponseSchema,
} from '@/lib/schemas/business/server/order.schema';
import { ORDER_STATUS_FLOW } from '@/lib/hooks/business/order-product.hook';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(UpdateOrderStatusRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const data = validation.data;

    // 3️⃣ Verify Order profile and its Ownership
    const existingOrder = await prisma.order.findFirst({
      where: { id, businessProfileId },
      select: { id: true, status: true },
      //include: { contact: true, OrderItem: true },
    });
    if (!existingOrder) return failure('Contact profile not found.', 404);

    const validNextStatuses = ORDER_STATUS_FLOW[existingOrder.status];

    // Validate transition
    if (!validNextStatuses.includes(data.status)) {
      return failure(`Invalid status transition: ${existingOrder.status} → ${data.status}`, 400);
    }

    const responseData = await prisma.order.update({
      where: { id },
      data: { status: data.status },
      select: { id: true, order_number: true, status: true, updated_at: true },
    });
    if (!responseData) return failure('Failed to update status profile', 403);

    const updated_status = UpdateOrderStatusResponseSchema.parse(responseData);

    return success(updated_status, 'Client Order status updated successfully', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('PATCH /api/orders/[id]/status error:', err);
    return failure(message, 401);
  }
}
