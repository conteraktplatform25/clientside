/*************************************************
 * ********** /api/inbox/conversations/[id] **********
 **************************************************/
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  DeleteConversationResponseSchema,
  MessageDetailsResponseSchema,
  MessageQuerySchema,
  UpdateConversationResponseSchema,
  UpdateConversationSchema,
} from '@/lib/schemas/business/server/inbox.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const conv = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        lastMessageAt: true,
        channel: true,
        businessProfile: { select: { id: true, company_name: true, business_number: true } },
      },
    });
    if (!conv) return failure('Conversation cannot be found', 404);

    // const isMember = await checkBusinessMembership(user.id, conv.businessProfile.id);
    // if (!isMember) return failure('User is Forbidden to access', 403);

    const { searchParams } = new URL(req.url);
    const parsed = MessageQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return failure(JSON.stringify(parsed.error.flatten()), 400);
    }

    const { limit, cursor } = parsed.data;

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { created_at: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        conversationId: true,
        senderUser: { select: { first_name: true, last_name: true } },
        senderContact: { select: { id: true, name: true, phone_number: true, status: true } },
        businessProfile: { select: { id: true, company_name: true, business_number: true } },
        channel: true,
        direction: true,
        deliveryStatus: true,
        type: true,
        content: true,
        mediaUrl: true,
        mediaType: true,
        rawPayload: true,
        whatsappMessageId: true,
        created_at: true,
      },
    });

    let nextCursor: string | null = null;
    if (messages.length > limit) {
      const next = messages.pop();
      nextCursor = next?.id ?? null;
    }
    const responseData = {
      conversation: conv,
      messages,
      nextCursor,
    };

    const messageProfile = MessageDetailsResponseSchema.parse(responseData);

    return success({ messageProfile }, 'Successfully retrieved message');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /inbox/conversations/[id] error:', err);
    return failure(message, 500);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = UpdateConversationSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const data = parsed.data;

    // 3️⃣ Verify product ownership
    const existingConv = await prisma.conversation.findFirst({
      where: { id, businessProfileId },
      select: { id: true },
    });
    if (!existingConv) return failure('Conversation has been removed.', 404);

    // const canEdit = await userCan(user.id, businessProfileId, 'conversations.manage');
    // if (!canEdit) return failure('Update Denied. Request for access to update', 400);

    const responseData = await prisma.conversation.update({
      where: { id },
      data,
      select: {
        id: true,
        contact: { select: { name: true, phone_number: true } },
        channel: true,
        created_at: true,
      },
    });

    const conversation = UpdateConversationResponseSchema.parse(responseData);
    return success({ conversation }, 'Update Successful', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('PATCH /inbox/conversations/[id] error:', err);
    return failure(message, 500);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // const canEdit = await userCan(user.id, businessProfileId, 'conversations.delete');
    // if (!canEdit) return failure('Update Denied. Request for access to update', 400);

    // Soft-archive
    const archived = await prisma.conversation.update({
      where: { id },
      data: { status: 'ARCHIVED' },
      select: {
        id: true,
        status: true,
        channel: true,
        updated_at: true,
      },
    });
    const archived_conversation = DeleteConversationResponseSchema.parse(archived);
    return success(archived_conversation, 'Successfully deactivated conversation', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('DELETE /inbox/conversations/[id] error:', err);
    return failure(message, 500);
  }
}
