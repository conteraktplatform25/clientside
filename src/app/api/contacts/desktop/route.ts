import { authenticateRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ContactDesktopListResponseSchema, ContactQuerySchema } from '@/lib/schemas/business/server/contacts.schema';
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

    const { searchParams } = new URL(req.url);
    const parsed = ContactQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return failure(JSON.stringify(parsed.error.flatten()), 400);
    }

    const { page, limit, search, sortBy, sortOrder } = parsed.data;
    const skip = (page - 1) * limit;

    // ✅ Build dynamic filters
    const where: Prisma.ContactWhereInput = {
      businessProfileId,
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone_number: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        select: {
          id: true,
          name: true,
          phone_number: true,
          email: true,
          created_at: true,
          tags: {
            select: { id: true, name: true, color: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
          },
          Order: {
            select: { order_number: true, total_amount: true, created_at: true },
            orderBy: { created_at: 'desc' },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.contact.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const formattedContacts = contacts.map((contact) => {
      const totalAmountSpent =
        contact.Order.length > 0 ? contact.Order.reduce((sum, o) => sum + Number(o.total_amount), 0) : 0;
      const lastOrderNumber = contact.Order[0]?.order_number || null;
      const totalTags = contact.tags.length;
      const lastTag = contact.tags[0]?.name || null;
      const tagColor = contact.tags[0]?.color || null;
      const dateCreated = contact.created_at || new Date();

      return {
        id: contact.id,
        name: contact.name,
        phone_number: contact.phone_number,
        email: contact.email,
        dateCreated,
        totalAmountSpent,
        lastOrderNumber,
        totalTags,
        lastTag,
        tagColor,
      };
    });

    const responseData = {
      pagination: { page, limit, total, totalPages },
      contacts: formattedContacts,
    };
    const response = ContactDesktopListResponseSchema.parse(responseData);

    return success(response, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/contacts error:', message);
    return failure(message, 500);
  }
}
