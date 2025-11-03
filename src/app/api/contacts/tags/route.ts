import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CreateContactTagSchema } from '@/lib/schemas/business/server/contacts.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const body = await req.json();
    const parsed = CreateContactTagSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()));
    }

    const newTag = await prisma.contactTag.create({ data: parsed.data });
    return success({ newTag }, 'Contact Tag created successfully', 201);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
