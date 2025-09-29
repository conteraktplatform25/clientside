import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher.test';

export async function POST(req: NextRequest) {
  const { userIds, isGroup } = await req.json();

  // Validation with zod...
  const conversation = await prisma.conversation.create({
    data: {
      userId: userIds,
      status: 'OPEN',
      isGroup: isGroup,
    },
  });
  await pusherServer.trigger(`conversation-${conversation.id}`, 'new-conversation', conversation);
  return NextResponse.json(conversation);
}
