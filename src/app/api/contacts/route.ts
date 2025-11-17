import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
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
    // if (status) where.status = status;
    // if (source) where.source = source;

    const [contactPaginated, total] = await Promise.all([
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
          source: true,
          contactTag: { select: { id: true, tag: { select: { name: true, color: true } } } },
        },
      }),
      prisma.contact.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const validSources = ['MANUAL', 'IMPORT', 'API', 'WHATSAPP', 'CHATBOT'];
    const sanitizedContacts = contactPaginated.map((c) => ({
      ...c,
      source: validSources.includes(c.source) ? c.source : 'MANUAL',
    }));

    const responseData = {
      pagination: { page, limit, total, totalPages },
      contacts: sanitizedContacts,
    };

    const contacts = ContactListResponseSchema.parse(responseData);

    return success(contacts, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/contacts error:', message);
    return failure(message, 500);
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

    const validation = await validateRequest(CreateContactSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { name, email, ...data } = validation.data;

    const existing = await prisma.contact.findUnique({
      where: {
        businessProfileId_phone_number: {
          businessProfileId,
          phone_number: data.phone_number,
        },
      },
    });
    if (existing) {
      return failure('Contact already exists for this Owner', 409);
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone_number: data.phone_number,
        email,
        whatsapp_opt_in: data.whatsapp_opt_in,
        custom_fields: data.custom_fields,
        businessProfileId, // ensure this is provided by your frontend
      },
    });
    return success({ contact }, 'Product created successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/contacts error:', message);
    return failure(message, 500);
  }
}
