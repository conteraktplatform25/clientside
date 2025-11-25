import { NextRequest } from 'next/server';
// import prisma from '@/lib/prisma';
// import { pusherServer } from '@/lib/pusher.test';
import { success } from '@/utils/response';

export async function POST(req: NextRequest) {
  //   const { contactId, isGroup } = await req.json();

  //   // Validation with zod...
  //   const conversation = await prisma.conversation.create({
  //     data: {
  //       contactId,
  //       status: 'OPEN',
  //       //isGroup: isGroup,
  //     },
  //   });
  //   await pusherServer.trigger(`conversation-${conversation.id}`, 'new-conversation', conversation);
  return success(JSON.stringify(req), 'Nothing to retrieve', 200);
}
