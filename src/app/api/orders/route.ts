import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/helpers/generate-ordernumber.helper';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  CreateOrderRequestSchema,
  CreateOrderResponseSchema,
  OrderListResponseSchema,
  OrderQuerySchema,
} from '@/lib/schemas/business/server/order.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(OrderQuerySchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { page, limit, search, status, sortBy, sortOrder, startDate, endDate } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { businessProfileId };
    if (search) {
      // where.OR = [{ order_number: { contains: search, mode: 'insensitive' } }, ];
      where.OR = [
        { order_number: { contains: search, mode: 'insensitive' } },
        { contact: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) where.status = status;
    if (startDate || endDate) {
      where.created_at = {};

      if (startDate) {
        where.created_at.gte = new Date(startDate);
      }
      if (endDate) {
        where.created_at.lte = new Date(endDate);
      }
    }

    const [orders, total, summary] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          order_number: true,
          total_amount: true,
          status: true,
          payment_status: true,
          created_at: true,
          contact: { select: { id: true, name: true, phone_number: true } },
        },
      }),
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where: { businessProfileId },
        _count: { id: true },
        _sum: { total_amount: true },
      }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const responseData = {
      pagination: { page, limit, total, totalPages },
      orders: orders.map((o) => ({
        id: o.id,
        contactId: o.contact.id,
        contact_name: o.contact.name,
        contact_phone_number: o.contact.phone_number,
        order_number: o.order_number,
        total_amount: Number(o.total_amount),
        status: o.status as OrderStatus,
        payment_status: o.payment_status as PaymentStatus,
        created_at: o.created_at,
      })),
      summary: {
        totalOrders: summary._count.id || 0,
        totalRevenue: Number(summary._sum.total_amount || 0),
      },
    };

    const order_response = OrderListResponseSchema.parse(responseData);

    return success(order_response, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/orders error:', err);
    return failure(message, 401);
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

    const validation = await validateRequest(CreateOrderRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);
    const data = validation.data;

    let contactName = '';
    let contactPhone = '';
    let contactId = data.contactId;

    const result = await prisma.$transaction(async (tx) => {
      if (!contactId) {
        if (!data.contact) {
          throw new Error('Either contactId or contact object must be provided.');
        }

        // Check existing contact by phone
        const existingPhone = await tx.contact.findFirst({
          where: { phone_number: data.contact.phone_number, businessProfileId },
          select: { id: true },
        });
        if (existingPhone) contactId = existingPhone.id;
        else {
          const createdContact = await tx.contact.create({
            data: {
              businessProfileId,
              name: data.contact.name,
              phone_number: data.contact.phone_number,
              email: data.contact.email || undefined,
            },
            select: { id: true, name: true, phone_number: true },
          });
          contactId = createdContact.id;
          contactName = createdContact.name ?? '';
          contactPhone = createdContact.phone_number;
        }
      } else {
        const contactProfile = await tx.contact.findUnique({
          where: { id: contactId, businessProfileId },
          select: { id: true, name: true, phone_number: true },
        });
        if (!contactProfile) {
          throw new Error('Could not find contact information.');
        }
        contactName = contactProfile.name ?? '';
        contactPhone = contactProfile.phone_number;
      }

      // 2) Create Order skeleton
      const order_number = generateOrderNumber(businessProfileId);
      const computedTotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const order = await tx.order.create({
        data: {
          businessProfileId,
          contactId,
          order_number,
          total_amount: computedTotal,
          status: 'PENDING',
          payment_status: 'PENDING',
          payment_method: data.payment_method || undefined,
          currency: data.currency || 'NAIRA',
          delivery_address: data.delivery_address ?? undefined,
          notes: data.notes ?? undefined,
          OrderItem: {
            create: data.items.map((item) => ({
              name: item.name,
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
            })),
          },
        },
        select: { id: true, order_number: true, total_amount: true },
      });

      await tx.userActivity.create({
        data: {
          businessProfileId,
          type: 'ORDER_CREATED',
          description: `Order ${order_number} created with ${data.items.length} item(s)`,
          contactId,
          orderId: order.id,
        },
      });

      return {
        order: {
          ...order,
          total_amount: Number(order.total_amount),
        },
        contactName: contactName,
        contactPhone: contactPhone,
      };
    });

    const parsed = CreateOrderResponseSchema.parse(result);

    return success(parsed, 'Client Order created successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/orders error:', err);
    return failure(message, 401);
  }
}
