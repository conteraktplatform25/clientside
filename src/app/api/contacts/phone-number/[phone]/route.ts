import { authenticateRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import { failure } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ phone: string }> }) {
  try {
    const { phone } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const contact = await prisma.contact.findUnique({
      where: {
        businessProfileId_phone_number: {
          businessProfileId,
          phone_number: phone,
        },
      },
      select: { id: true },
    });
    if (!contact) return failure('Contact not found', 404);
  } catch (err) {
    console.error('GET /contacts/[phone] error:', err);
    return failure(getErrorMessage(err), 401);
  }
}
