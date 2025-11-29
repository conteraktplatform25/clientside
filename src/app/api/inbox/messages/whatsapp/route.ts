// /api/inbox/conversations/messages/whatsapp

export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import twilio from 'twilio';
import { pusherServer } from '@/lib/pusher';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { failure, success } from '@/utils/response';
import { getErrorMessage } from '@/utils/errors';

async function readRawBody(req: Request): Promise<string> {
  try {
    return await req.text();
  } catch (err) {
    console.error('❌ Failed to read raw body:', err);
    return '';
  }
}
function getTwilioUrl(req: NextRequest) {
  const host = req.headers.get('host');
  const path = req.nextUrl.pathname + req.nextUrl.search;
  return `https://${host}${path}`;
}

function validateTwilioSignature(req: NextRequest, rawBody: string) {
  const signature = req.headers.get('x-twilio-signature') ?? '';

  // MUST use the full URL Twilio called (works with ngrok)
  const url = getTwilioUrl(req);

  const params = Object.fromEntries(new URLSearchParams(rawBody));

  return twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN!, signature, url, params);
}

export async function POST(req: NextRequest) {
  console.log('📥 Incoming Twilio Webhook');

  // 1. Read raw body safely
  const rawBody = await readRawBody(req);
  if (!rawBody) return failure('Empty body', 400);

  // 2. Validate Twilio Signature
  try {
    const isValid = validateTwilioSignature(req, rawBody);
    if (!isValid) {
      console.warn('⚠️ Invalid Twilio signature');
      return failure('Invalid Twilio signature', 401);
    }
  } catch (err) {
    console.error('❌ Signature validation error:', err);
    return failure('Signature validation crash', 500);
  }

  // 3. Parse form-data params
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const from = (params['From'] || '').replace(/^whatsapp:/i, '');
  const to = (params['To'] || '').replace(/^whatsapp:/i, '');

  const body = params['Body'] ?? null;
  const messageSid = params['MessageSid'] ?? null;
  const numMedia = Number(params['NumMedia'] ?? 0);
  const mediaUrl = numMedia > 0 ? params['MediaUrl0'] : null;
  const mediaType = numMedia > 0 ? params['MediaContentType0'] : null;

  console.log('📩 WhatsApp message:', {
    from,
    to,
    body,
    mediaUrl,
    messageSid,
  });

  // 4. Business profile lookup
  let businessProfile;
  try {
    businessProfile = await prisma.businessProfile.findUnique({
      where: { business_number: to },
    });

    if (!businessProfile) {
      console.warn('⚠️ Unknown business number:', to);
      return success(true, 'Unknown business. Acknowledged to Twilio.', 200);
    }
  } catch (err) {
    console.error('❌ Prisma businessProfile error:', err);
    return failure('Database lookup failed', 500);
  }
  const businessProfileId = businessProfile.id;

  let result;
  try {
    result = await prisma.$transaction(async (tx) => {
      let contact = await tx.contact.findFirst({
        where: { businessProfileId, phone_number: from },
        select: {
          id: true,
        },
      });

      if (!contact) {
        contact = await tx.contact.create({
          data: {
            businessProfileId,
            phone_number: from,
            whatsapp_opt_in: true,
          },
          select: {
            id: true,
          },
        });
      }

      // Conversation
      let conversation = await tx.conversation.findFirst({
        where: { businessProfileId, contactId: contact.id, status: 'OPEN' },
        select: {
          id: true,
          status: true,
          businessProfileId: true,
          lastMessageAt: true,
          lastMessagePreview: true,
          channel: true,
        },
      });
      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            businessProfileId,
            contactId: contact.id,
            channel: 'WHATSAPP',
            lastMessageAt: new Date(),
            lastMessagePreview: body ?? mediaUrl,
          },
          select: {
            id: true,
            businessProfileId: true,
            status: true,
            lastMessageAt: true,
            lastMessagePreview: true,
            channel: true,
          },
        });
      } else {
        await tx.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(),
            lastMessagePreview: body ?? mediaUrl,
          },
          select: {
            id: true,
            businessProfileId: true,
            status: true,
            lastMessageAt: true,
            lastMessagePreview: true,
            channel: true,
          },
        });
      }

      // Message
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
          conversationId: true,
          senderContact: { select: { id: true, name: true, phone_number: true, status: true } },
          businessProfile: { select: { id: true, company_name: true, business_number: true } },
          channel: true,
          direction: true,
          type: true,
          content: true,
          mediaUrl: true,
          whatsappMessageId: true,
          created_at: true,
          deliveryStatus: true,
        },
      });
      // Update unread counters
      await tx.conversationUser.updateMany({
        where: { conversationId: conversation.id },
        data: { unreadCount: { increment: 1 } },
      });

      return { contact, conversation, message };
    });
  } catch (err) {
    console.error('❌ DB transaction error:', getErrorMessage(err));
    return failure('Database transaction failed', 500);
  }

  // 6. Pusher trigger — does NOT break webhook if it fails
  try {
    await pusherServer.trigger(`private-business-${result.conversation.businessProfileId}`, 'message.created', {
      conversationId: result.conversation.id,
      message: result.message,
      contact: result.contact,
    });
  } catch (err) {
    console.error('⚠️ Pusher trigger failed (non-fatal):', err);
    // Do NOT return failure — Twilio must get 200
  }

  // 🎉 Always return 200 to Twilio unless there was a real error
  return success(result, 'Inbound WhatsApp processed', 201);
}
