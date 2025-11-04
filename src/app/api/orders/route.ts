import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/helpers/generate-ordernumber.helper';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  CreateOrderSchema,
  OrderListResponseSchema,
  OrderQuerySchema,
} from '@/lib/schemas/business/server/order.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(OrderQuerySchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { page, limit, search, status, payment_status, sortBy, sortOrder } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { businessProfileId };
    if (search) {
      where.OR = [{ order_number: { contains: search, mode: 'insensitive' } }];
    }
    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          order_number: true,
          total_amount: true,
          currency: true,
          status: true,
          payment_status: true,
          notes: true,
          contact: { select: { id: true, name: true, phone_number: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);
    const responseData = {
      pagination: { page, limit, total, totalPages },
      orders,
    };

    const order_response = OrderListResponseSchema.parse(responseData);

    return success(order_response, 'Successful retrieval');
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

    const validation = await validateRequest(CreateOrderSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { ...data } = validation.data;
    const contact = await prisma.contact.findFirst({
      where: {
        id: data.contactId,
        businessProfileId,
      },
      select: { id: true },
    });
    if (!contact) return failure('Invalid contact: not found or not part of your business.', 400);

    const computedTotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderNumber = generateOrderNumber(businessProfileId);

    const order = await prisma.order.create({
      data: {
        businessProfileId,
        contactId: data.contactId,
        order_number: orderNumber,
        total_amount: computedTotal,
        currency: data.currency,
        payment_status: data.payment_status,
        payment_method: data.payment_method,
        delivery_address: data.delivery_address,
        notes: data.notes,
        OrderItem: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { OrderItem: true },
    });
    return success({ order }, 'Client Order created successfully', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
