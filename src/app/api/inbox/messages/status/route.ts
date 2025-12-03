// /app/api/inbox/messages/status/route.ts
import prisma from '@/lib/prisma';
//import { pusherServer } from '@/lib/pusher';
import { MessageDeliveryStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const config = { api: { bodyParser: false } };
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  // validate Twilio
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const sid = params['MessageSid'];
  const status = params['MessageStatus']; // queued, sent, delivered, read, failed

  // map Twilio states to your deliveryStatus enum:
  let mapped: MessageDeliveryStatus = 'PENDING';
  if (status === 'sent') mapped = 'SENT';
  else if (status === 'delivered') mapped = 'DELIVERED';
  else if (status === 'read') mapped = 'READ';
  else if (status === 'failed') mapped = 'FAILED';

  await prisma.message.updateMany({
    where: { whatsappMessageId: sid },
    data: { deliveryStatus: mapped },
  });

  // optionally trigger pusher
  // const msg = await prisma.message.findUnique({ where: { whatsappMessageId: sid } });
  // if (msg) {
  //   await pusherServer.trigger(`private-business-${msg.businessProfileId}`, 'message.updated', {
  //     id: msg.id,
  //     deliveryStatus: mapped,
  //   });
  // }

  return new NextResponse('OK');
}
