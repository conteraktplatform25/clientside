import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher.test';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { content, conversationId, senderId } = await req.json();
  //const message = await prisma.message.create({ data: { content, conversationId, senderId } });
  const message = await prisma.message.create({
    data: {
      conversationId: conversationId,
      content: content,
      direction: 'PENDING',
      senderId: senderId,
    },
  });
  await pusherServer.trigger(`chat-${conversationId}`, 'new-message', message);
  return NextResponse.json(message);
}
