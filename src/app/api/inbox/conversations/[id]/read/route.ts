/*************************************************
 * ********** /api/inbox/conversations/[id]/read **********
 **************************************************/
import { authenticateRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { getErrorMessage } from '@/utils/errors';
import { failure } from '@/utils/response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const userId = user.id;

    // ensure user is participant; if not, create ConversationUser with joinedAt
    await prisma.conversationUser.upsert({
      where: { conversationId_userId: { conversationId: id, userId } },
      update: { lastReadAt: new Date(), unreadCount: 0 },
      create: { conversationId: id, userId, lastReadAt: new Date(), unreadCount: 0 },
    });

    // optionally return unread counts and conversation state
    const convo = await prisma.conversation.findUnique({
      where: { id },
      select: { id: true, businessProfileId: true },
    });
    await pusherServer.trigger(`private-business-${convo?.businessProfileId}`, 'conversation.read', {
      id,
      userId,
    });

    return new NextResponse(JSON.stringify({ ok: true }));
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /inbox/conversations/[id]/read error:', err);
    return failure(message, 500);
  }
}
