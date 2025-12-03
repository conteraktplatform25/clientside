export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import twilio from 'twilio';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
//import { supabase } from "@/lib/supabase";
//import { supabase } from '@/lib/supabaseClient';
import { failure, success } from '@/utils/response';
import { MessageDeliveryStatus } from '@prisma/client';
import { getErrorMessage } from '@/utils/errors';

async function readRawBody(req: Request): Promise<string> {
  try {
    return await req.text();
  } catch {
    return '';
  }
}
function getTwilioUrl(req: NextRequest) {
  const host = req.headers.get('host');
  return `https://${host}${req.nextUrl.pathname}${req.nextUrl.search}`;
}

function validateTwilioSignature(req: NextRequest, raw: string): boolean {
  const signature = req.headers.get('x-twilio-signature') ?? '';
  const url = getTwilioUrl(req);
  const params = Object.fromEntries(new URLSearchParams(raw));
  return twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN!, signature, url, params);
}

export async function POST(req: NextRequest) {
  const raw = await readRawBody(req);
  if (!raw) return failure('Empty body', 400);

  const valid = validateTwilioSignature(req, raw);
  if (!valid) {
    console.warn('Invalid Twilio signature');
    return success(true, 'Ack invalid', 200);
  }

  const params = Object.fromEntries(new URLSearchParams(raw));
  const messageSid = params['MessageSid'];
  const messageStatus = params['MessageStatus']?.toLowerCase();

  if (!messageSid) return success(true, 'Missing SID', 200);

  const map: Record<string, MessageDeliveryStatus> = {
    queued: 'QUEUED',
    sending: 'SENDING',
    sent: 'SENT',
    delivered: 'DELIVERED',
    read: 'READ',
    failed: 'FAILED',
    undelivered: 'FAILED',
  };

  const mapped: MessageDeliveryStatus = (map[messageStatus] ?? 'UNKNOWN') as MessageDeliveryStatus;

  let updated;
  try {
    updated = await prisma.message.update({
      where: { whatsappMessageId: messageSid },
      data: { deliveryStatus: mapped },
      select: {
        id: true,
        businessProfileId: true,
        conversationId: true,
        deliveryStatus: true,
        whatsappMessageId: true,
      },
    });
    return success(updated, 'Status updated');
  } catch (err) {
    console.error('DB update error', err);
    return success(true, 'Ack DB error', 200);
  }
}
