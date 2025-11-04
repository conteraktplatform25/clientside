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

    const validation = await validateRequest(ContactQuerySchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { page, limit, search, source, status, sortBy, sortOrder } = validation.data;
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
    return failure(getErrorMessage(err), 401);
  }
}
