import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  CreateTagSchema,
  TagDetailedResponseSchema,
  TagListResponseSchema,
} from '@/lib/schemas/business/server/contacts.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user || !user.businessProfile) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const responseData = await prisma.tag.findMany({
      where: { businessProfileId },
      select: {
        id: true,
        name: true,
        color: true,
        created_at: true,
        updated_at: true,
      },
    });
    const tags = TagListResponseSchema.parse(responseData);

    return success(tags, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/tags error:', message);
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

    const validation = await validateRequest(CreateTagSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { name, color } = validation.data;
    const existing = await prisma.tag.findUnique({
      where: {
        businessProfileId_name: {
          businessProfileId,
          name,
        },
      },
    });
    if (existing) {
      return failure('Tag already exists for this Owner', 409);
    }

    const createdTag = await prisma.tag.create({
      data: {
        businessProfileId,
        name: name.trim(),
        color,
      },
    });
    const tag = TagDetailedResponseSchema.parse(createdTag);
    return success(tag, 'Tag by business owner created successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/tags error:', message);
    return failure(message, 500);
  }
}
