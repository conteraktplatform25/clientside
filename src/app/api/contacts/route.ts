import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  ContactListResponseSchema,
  ContactQuerySchema,
  CreateContactSchema,
} from '@/lib/schemas/business/server/contacts.schema';
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

    const { page, limit, search, source, status, sortBy, sortOrder, tag } = parsed.data;
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
    if (status) where.status = status;
    if (source) where.source = source;
    if (tag) {
      where.tags = {
        some: {
          name: { contains: tag, mode: 'insensitive' },
        },
      };
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          phone_number: true,
          email: true,
          status: true,
          tags: { select: { id: true, name: true, color: true } },
        },
      }),
      prisma.contact.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);

    const responseData = {
      pagination: { page, limit, total, totalPages },
      contacts,
    };

    const contact_profile = ContactListResponseSchema.parse(responseData);

    return success(contact_profile, 'Successful retrieval');
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

    const body = await req.json();
    const parsed = CreateContactSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));
    }

    const { name, email, ...data } = parsed.data;

    const existing = await prisma.contact.findUnique({
      where: { phone_number: data.phone_number },
    });
    if (existing) {
      return failure('Contact already exists', 409);
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone_number: data.phone_number,
        email,
        source: data.source,
        businessProfileId, // ensure this is provided by your frontend
      },
    });
    return success({ contact }, 'Product created successfully', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
