export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import twilio from 'twilio';
import { pusherServer } from '@/lib/pusher';
import { NextRequest } from 'next/server';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import prisma from '@/lib/prisma';

// --------------------------------------------
//  UTIL: Read raw request body
// --------------------------------------------
async function readRawBody(req: Request): Promise<string> {
  return await req.text();
}

// --------------------------------------------
//  UTIL: Validate Twilio signature
// --------------------------------------------
function validateTwilioSignature(req: NextRequest, rawBody: string) {
  const signature = req.headers.get('x-twilio-signature') ?? '';
  const url = req.nextUrl.href;

  const params = Object.fromEntries(new URLSearchParams(rawBody));

  return twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN!, signature, url, params);
}

export async function POST(req: NextRequest) {
  const rawBody = await readRawBody(req); // Twilio sends application/x-www-form-urlencoded

  if (!validateTwilioSignature(req, rawBody)) return failure('Invalid Twilio signature', 401);

  const params = Object.fromEntries(new URLSearchParams(rawBody));

  const from = (params['From'] || '').replace(/^whatsapp:/i, '');
  const to = (params['To'] || '').replace(/^whatsapp:/i, '');
  const body = params['Body'] ?? null;
  const messageSid = params['MessageSid'] ?? null;
  const numMedia = Number(params['NumMedia'] ?? 0);
  const mediaUrl = numMedia > 0 ? params['MediaUrl0'] : null;
  const mediaType = numMedia > 0 ? params['MediaContentType0'] : null;

  console.log('📩 Incoming WhatsApp Message', {
    from,
    to,
    body,
    mediaUrl,
    messageSid,
  });

  // Lookup business by business_number
  const businessProfile = await prisma.businessProfile.findUnique({ where: { business_number: to } });
  if (!businessProfile) {
    // respond 200 to avoid Twilio retries but log
    console.error('Incoming message for unknown business number:', to, params);
    return success(true);
  }
  const businessProfileId = businessProfile.id;

  // Use transaction to ensure consistent state
  try {
    const result = await prisma.$transaction(async (tx) => {
      // find or create contact
      let contact = await tx.contact.findFirst({
        where: { businessProfileId, phone_number: from },
        select: { id: true, name: true, phone_number: true },
      });
      if (!contact) {
        contact = await tx.contact.create({
          data: { businessProfileId, phone_number: from, whatsapp_opt_in: true },
          select: { id: true, name: true, phone_number: true },
        });
      }

      // find open conversation or create
      let conversation = await tx.conversation.findFirst({
        where: { businessProfileId, contactId: contact.id, status: 'OPEN' },
        select: { id: true, businessProfileId: true },
      });
      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            businessProfileId,
            contactId: contact.id,
            channel: 'WHATSAPP',
            lastMessageAt: new Date(),
            lastMessagePreview: body ?? mediaUrl ?? null,
          },
        });
      } else {
        // update last message preview/time (denormalized)
        await tx.conversation.update({
          where: { id: conversation.id },
          data: { lastMessageAt: new Date(), lastMessagePreview: body ?? mediaUrl ?? null },
          select: { id: true },
        });
      }

      // create message, idempotent on whatsappMessageId:
      const message = await tx.message.create({
        data: {
          businessProfileId,
          conversationId: conversation.id,
          senderContactId: contact.id,
          direction: 'INBOUND',
          type: mediaUrl ? 'IMAGE' : 'TEXT',
          content: body,
          mediaUrl,
          mediaType,
          rawPayload: params,
          whatsappMessageId: messageSid,
          deliveryStatus: 'SENT',
        },
        select: {
          id: true,
          senderContact: { select: { name: true, phone_number: true } },
          content: true,
          mediaUrl: true,
          direction: true,
          deliveryStatus: true,
          created_at: true,
        },
      });
      // update unread counts for conversation participants
      const participants = await tx.conversationUser.findMany({
        where: { conversationId: conversation.id },
        select: { id: true },
      });
      for (const p of participants) {
        await tx.conversationUser.update({
          where: { id: p.id },
          data: { unreadCount: { increment: 1 } },
        });
      }

      return { contact, conversation, message };
    });

    // trigger pusher update outside transaction (nonblocking)
    await pusherServer.trigger(`private-business-${result.conversation.businessProfileId}`, 'message.created', {
      conversationId: result.conversation.id,
      message: {
        id: result.message.id,
        content: result.message.content,
        mediaUrl: result.message.mediaUrl,
        created_at: result.message.created_at,
        direction: result.message.direction,
        deliveryStatus: result.message.deliveryStatus,
      },
      contact: {
        id: result.contact.id,
      },
    });

    return success(result, 'INBOUND Data successfully registered', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /inbox/conversations/[id]/messages error:', err);
    return failure(message, 500);
  }
}
