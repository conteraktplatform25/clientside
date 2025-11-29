export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import twilio from 'twilio';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { failure, success } from '@/utils/response';
import { MessageDeliveryStatus } from '@prisma/client';

async function readRawBody(req: Request): Promise<string> {
  try {
    return await req.text();
  } catch (err) {
    console.error('❌ Failed reading status callback body:', err);
    return '';
  }
}

function validateTwilioSignature(req: NextRequest, rawBody: string) {
  const signature = req.headers.get('x-twilio-signature') ?? '';
  const url = req.nextUrl.href;
  const params = Object.fromEntries(new URLSearchParams(rawBody));

  return twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN!, signature, url, params);
}

export async function POST(req: NextRequest) {
  console.log('📡 Incoming Twilio Status Callback');

  const rawBody = await readRawBody(req);
  if (!rawBody) return failure('Empty body', 400);

  try {
    const valid = validateTwilioSignature(req, rawBody);
    if (!valid) {
      console.warn('⚠️ Invalid Twilio signature on status callback');
      return success(false, 'Invalid signature acknowledged', 200); // ACK anyway
    }
  } catch (err) {
    console.error('❌ Signature validation error:', err);
    return success(false, 'Signature crash acknowledged', 200); // ACK
  }

  // Parse event params
  const params = Object.fromEntries(new URLSearchParams(rawBody));

  const messageSid = params['MessageSid'];
  const messageStatus = params['MessageStatus']; // sent, delivered, read, failed, etc
  const errorCode = params['ErrorCode'] ?? null;
  const errorMessage = params['ErrorMessage'] ?? null;

  console.log('📬 Status update:', {
    messageSid,
    messageStatus,
    errorCode,
    errorMessage,
  });

  if (!messageSid) {
    console.warn('⚠️ Callback missing MessageSid');
    return success(false, 'Missing SID acknowledged', 200);
  }

  // Map to your schema
  const statusMapping: Record<string, string> = {
    queued: 'QUEUED',
    sending: 'SENDING',
    sent: 'SENT',
    delivered: 'DELIVERED',
    undelivered: 'FAILED',
    failed: 'FAILED',
    read: 'READ',
  };

  const mappedStatus = statusMapping[messageStatus?.toLowerCase()] || 'UNKNOWN';

  // Update DB — wrapped in try/catch so no crash
  let updatedMessage = null;
  try {
    updatedMessage = await prisma.message.update({
      where: { whatsappMessageId: messageSid },
      data: { deliveryStatus: mappedStatus as MessageDeliveryStatus },
      select: {
        id: true,
        businessProfileId: true,
        whatsappMessageId: true,
        deliveryStatus: true,
        conversationId: true,
      },
    });
    await pusherServer.trigger(`private-business-${updatedMessage.businessProfileId}`, 'message.status.updated', {
      messageSid,
      messageStatus: mappedStatus,
      raw: params,
    });
  } catch (err) {
    console.error('❌ Error updating message status:', err);
    return success(failure, 'DB error acknowledged', 200); // ACK anyway
  }

  return success(true, 'Status callback processed');
}
