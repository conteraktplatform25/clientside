import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { ContactTagListResponseSchema, CreateContactTagSchema } from '@/lib/schemas/business/server/contacts.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const responseData = await prisma.contactTag.findMany({
      where: { contactId: id },
      // include: { tag: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        contact: {
          select: {
            id: true,
            name: true,
            phone_number: true,
            email: true,
            created_at: true,
          },
        },
        tag: {
          select: {
            id: true,
            name: true,
            color: true,
            created_at: true,
          },
        },
      },
    });

    const contactTag = ContactTagListResponseSchema.parse(responseData);
    return success(contactTag, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /contacts/[id]/tags error:', err);
    return failure(message, 401);
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(CreateContactTagSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { tagIds } = validation.data;

    //verify if contact profile exist
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) return failure('Contact not found', 400);

    // Remove tags not included & add new ones in a transaction
    const existing = await prisma.contactTag.findMany({ where: { contactId: id } });
    const existingTagIds = new Set(existing.map((e) => e.tagId));
    const newTagIds = new Set(tagIds);

    const toRemove = existing.filter((e) => !newTagIds.has(e.tagId)).map((e) => e.id);
    const toAdd = Array.from(newTagIds).filter((tId) => !existingTagIds.has(tId));

    const ops = [];

    if (toRemove.length > 0) {
      ops.push(prisma.contactTag.deleteMany({ where: { id: { in: toRemove } } }));
    }
    if (toAdd.length > 0) {
      ops.push(
        prisma.contactTag.createMany({
          data: toAdd.map((tagId) => ({ contactId: id, tagId })),
          skipDuplicates: true,
        })
      );
    }

    await prisma.$transaction(ops);

    const updatedContactTag = await prisma.contactTag.findMany({
      where: { contactId: id },
      select: {
        id: true,
        contact: {
          select: {
            id: true,
            name: true,
            phone_number: true,
            email: true,
            created_at: true,
          },
        },
        tag: {
          select: {
            id: true,
            name: true,
            color: true,
            created_at: true,
          },
        },
      },
    });
    const createdContactTag = ContactTagListResponseSchema.parse(updatedContactTag);
    return success(createdContactTag, 'Successful created.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /contacts/[id]/tags error:', err);
    return failure(message, 401);
  }
}
