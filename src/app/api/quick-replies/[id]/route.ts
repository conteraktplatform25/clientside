import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  QuickReplyDetailsResponseSchema,
  UpdateQuickReplyRequestSchema,
  UpdateQuickReplyResponseSchema,
} from '@/lib/schemas/business/server/quickReply.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const responseData = await prisma.quickReply.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        shortcut: true,
        content: true,
        category: true,
        isActive: true,
        variables: true,
        createdById: true,
        is_global: true,
        usageCount: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!responseData) return failure('Client Order not found', 404);

    const quick_reply = QuickReplyDetailsResponseSchema.parse(responseData);

    return success({ quick_reply }, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/quick-replies/[id] error:', err);
    return failure(message, 401);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(UpdateQuickReplyRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { title, shortcut, content, category, is_global } = validation.data;

    // 3️⃣ Verify Quick reply profile and its Ownership
    const existingReply = await prisma.quickReply.findFirst({
      where: { id, businessProfileId },
      select: { id: true, title: true, shortcut: true, content: true, category: true, is_global: true },
    });
    if (!existingReply) return failure('Quick Reply profile not found.', 404);

    const responseData = await prisma.quickReply.update({
      where: { id },
      data: {
        title: title ?? existingReply.title,
        shortcut: shortcut ?? existingReply.shortcut,
        content: content ?? existingReply.content,
        category: category ?? existingReply.category,
        is_global: is_global ?? existingReply.is_global,
      },
      select: {
        id: true,
        title: true,
        content: true,
        updated_at: true,
      },
    });

    const quick_replies = UpdateQuickReplyResponseSchema.parse(responseData);
    return success({ quick_replies }, 'Quick reply updated successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('PATCH /api/quick-replies/[id] error:', err);
    return failure(message, 401);
  }
}
