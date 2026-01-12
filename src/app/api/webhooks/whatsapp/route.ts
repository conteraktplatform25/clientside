// src/app/api/webhooks/whatsapp/route.ts
import prisma from '@/lib/prisma';
import { mapWhatsAppStatus } from '@/lib/whatsapp/whatsapp-status.mapper';
import {
  TWhatsAppMessagePayload,
  TWhatsAppWebhookPayload,
  WhatsAppWebhookSchema,
} from '@/lib/whatsapp/whatsapp.validator';
import { metaTimestampToDate } from '@/utils/defaults.util';
// import { getErrorMessage } from '@/utils/errors';
// import { failure, success } from '@/utils/response';
import { MessageDeliveryStatus, MessageType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

type TInboundMessageParams = {
  phoneNumberId: string;
  from: string;
  whatsappMessageId: string;
  content: string;
  timestamp: string;
  type: MessageType;
};

type TStatusUpdateParams = {
  whatsappMessageId: string;
  status: MessageDeliveryStatus;
};

/* ------------------------------------------------------------------ */
/* Meta Signature Verification                                        */
/* ------------------------------------------------------------------ */
function verifyMetaSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', process.env.META_APP_SECRET!).update(rawBody).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (
    searchParams.get('hub.mode') === 'subscribe' &&
    searchParams.get('hub.verify_token') === process.env.META_AI_WHATSAPP_VERIFY_TOKEN
  ) {
    return new NextResponse(searchParams.get('hub.challenge'), { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

/* ------------------------------------------------------------------ */
/* Webhook Receiver (POST)                                             */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  //const body = await req.json();
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');

  if (!verifyMetaSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  //const parsed = WhatsAppWebhookSchema.safeParse(rawBody);
  const payload = JSON.parse(rawBody);
  const parsed = WhatsAppWebhookSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // ACK immediately (Meta SLA)
  setImmediate(() => processWebhook(parsed.data));
  return NextResponse.json({ received: true }, { status: 200 });
}

/* ------------------------------------------------------------------ */
/* Async Processing Logic                                              */
/* ------------------------------------------------------------------ */
async function processWebhook(payload: TWhatsAppWebhookPayload) {
  const value = payload.entry[0].changes[0].value;

  // 📩 INBOUND MESSAGES
  if (value.messages) {
    const phoneNumberId = value.metadata.phone_number_id;

    for (const msg of value.messages) {
      const type = msg.type === 'text' ? MessageType.TEXT : MessageType.IMAGE;

      const content = extractMessageContent(msg);

      await handleInboundWhatsAppMessage({
        phoneNumberId,
        from: msg.from,
        whatsappMessageId: msg.id,
        content,
        timestamp: msg.timestamp,
        type,
      });
    }
  }

  // 📦 DELIVERY STATUS UPDATES
  if (value.statuses) {
    for (const status of value.statuses) {
      await handleWhatsAppStatusUpdate({
        whatsappMessageId: status.id,
        status: mapWhatsAppStatus(status.status),
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* Message Handlers                                                    */
/* ------------------------------------------------------------------ */
async function handleInboundWhatsAppMessage(params: TInboundMessageParams) {
  /************************************************************
   * 1. Resolve BusinessProfile from WhatsApp phone_number_id
   ***********************************************************/
  const businessProfile = await prisma.businessProfile.findFirst({
    where: {
      phoneNumbers: {
        some: { phoneNumberId: params.phoneNumberId },
      },
    },
  });
  if (!businessProfile) return;
  const businessProfileId = businessProfile.id;
  const eventTime = metaTimestampToDate(params.timestamp);

  await prisma.$transaction(async (tx) => {
    /********************************
     * 2. Resolve or create Contact
     ********************************/
    const contact =
      (await tx.contact.findFirst({
        where: { businessProfileId, phone_number: params.from },
      })) ??
      (await tx.contact.create({
        data: {
          businessProfileId,
          phone_number: params.from,
          whatsapp_opt_in: true,
        },
      }));

    /*************************************
     * 3. Resolve or create Conversation
     *************************************/
    let conversation = await tx.conversation.findFirst({
      where: { businessProfileId, contactId: contact.id, status: 'OPEN' },
    });
    if (!conversation) {
      conversation = await tx.conversation.create({
        data: {
          businessProfileId,
          contactId: contact.id,
          channel: 'WHATSAPP',
          lastMessageAt: eventTime,
          lastMessagePreview: params.content.slice(0, 120),
        },
      });
    } else {
      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: eventTime,
          lastMessagePreview: params.content.slice(0, 120),
        },
      });
    }

    /****************************
     * 4. Create INBOUND Message
     ****************************/
    await tx.message.upsert({
      where: { whatsappMessageId: params.whatsappMessageId },
      create: {
        businessProfileId,
        conversationId: conversation.id,
        senderContactId: contact.id,
        direction: 'INBOUND',
        type: params.type,
        content: params.content,
        whatsappMessageId: params.whatsappMessageId,
        deliveryStatus: 'SENT',
        created_at: eventTime,
      },
      update: {},
    });
  });
}

async function handleWhatsAppStatusUpdate(params: TStatusUpdateParams) {
  await prisma.message.updateMany({
    where: {
      whatsappMessageId: params.whatsappMessageId,
    },
    data: {
      deliveryStatus: params.status,
    },
  });
}

function extractMessageContent(msg: TWhatsAppMessagePayload): string {
  switch (msg.type) {
    case 'text':
      return msg.text.body;

    case 'image':
      return msg.image?.caption ?? '';

    case 'document':
      return msg.document?.filename ?? '';

    default:
      return '';
  }
}
