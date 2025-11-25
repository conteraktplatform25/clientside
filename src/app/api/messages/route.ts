// import prisma from '@/lib/prisma';
// import { pusherServer } from '@/lib/pusher.test';
import { success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { content, conversationId, senderId } = await req.json();
  //const { content } = await req.json();
  console.log(conversationId, senderId);
  //const message = await prisma.message.create({ data: { content, conversationId, senderId } });
  // const message = await prisma.message.create({
  //   data: {
  //     conversationId: conversationId,
  //     content: content,
  //     direction: "INBOUND",
  //   },
  // });
  // await pusherServer.trigger(`chat-${conversationId}`, 'new-message', message);
  return success(content, 'Success', 200);
}
