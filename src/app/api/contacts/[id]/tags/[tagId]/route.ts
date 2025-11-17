import { authenticateRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ContactTagResponseScheme } from '@/lib/schemas/business/server/contacts.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string; tagId: string }> }) {
  try {
    const { id, tagId } = await context.params;
    if (!id || !tagId) return failure('Missing Parameters', 400);

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const responseData = await prisma.contactTag.findUnique({
      where: {
        contactId_tagId: {
          contactId: id,
          tagId,
        },
      },
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
    const contactTag = ContactTagResponseScheme.parse(responseData);
    return success(contactTag, 'Successful retrieved.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /contacts/[id]/tags/[tagId] error:', err);
    return failure(message, 401);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string; tagId: string }> }) {
  try {
    const { id, tagId } = await context.params;
    if (!id || !tagId) return failure('Missing Parameters', 400);

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    await prisma.contactTag.deleteMany({ where: { contactId: id, tagId } });
    return success(true, 'Successful retrieved.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('DELETE /contacts/[id]/tags/[tagId] error:', err);
    return failure(message, 401);
  }
}
