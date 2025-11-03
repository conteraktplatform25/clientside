import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UpdateContactTagSchema } from '@/lib/schemas/business/server/contacts.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = UpdateContactTagSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const { ...data } = parsed.data;
    const updateTag = await prisma.contactTag.update({
      where: { id },
      data,
    });

    return success({ updateTag }, 'Contact Profile updated successfully', 200);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
