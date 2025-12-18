// src/app/api/webhooks/whatsapp/route.ts
import prisma from '@/lib/prisma';
import { mapWhatsAppStatus } from '@/lib/whatsapp/whatsapp-status.mapper';
import { WhatsAppWebhookSchema } from '@/lib/whatsapp/whatsapp.validator';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { MessageDeliveryStatus, MessageType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type TInboundMessageParams = {
  phoneNumberId: string;
  from: string;
  whatsappMessageId: string;
  content: string;
};

type TStatusUpdateParams = {
  whatsappMessageId: string;
  status: MessageDeliveryStatus;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);

  if (
    searchParams.get('hub.mode') === 'subscribe' &&
    searchParams.get('hub.verify_token') === process.env.META_AI_WHATSAPP_VERIFY_TOKEN
  ) {
    return new NextResponse(searchParams.get('hub.challenge'), { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = WhatsAppWebhookSchema.safeParse(body);
  console.log('Meta AI INBOUND Webhook Request:', parsed);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const value = body.entry[0].changes[0].value;
  console.log('INBOUND WHATSAPP MESSAGE', value);

  // 📩 INBOUND MESSAGES
  if (value.messages) {
    const phoneNumberId = value.metadata.phone_number_id;

    for (const msg of value.messages) {
      await handleInboundWhatsAppMessage({
        phoneNumberId,
        from: msg.from,
        whatsappMessageId: msg.id,
        content: msg.text?.body ?? '',
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

  // ✅ ALWAYS ACK
  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleInboundWhatsAppMessage(params: TInboundMessageParams) {
  /************************************************************
   * 1. Resolve BusinessProfile from WhatsApp phone_number_id
   ***********************************************************/
  const businessProfile = await prisma.businessProfile.findUnique({
    where: {
      business_number: params.phoneNumberId,
    },
    select: { id: true },
  });
  if (!businessProfile) {
    console.warn('⚠️ Unknown business number:', params.phoneNumberId);
    return success(true, 'Unknown business. Acknowledged to Twilio.', 200);
  }
  const businessProfileId = businessProfile.id;

  try {
    await prisma.$transaction(async (tx) => {
      /********************************
       * 2. Resolve or create Contact
       ********************************/
      let contact = await tx.contact.findFirst({
        where: { businessProfileId, phone_number: params.from },
        select: {
          id: true,
        },
      });
      if (!contact) {
        contact = await tx.contact.create({
          data: {
            businessProfileId,
            phone_number: params.from,
            whatsapp_opt_in: true,
          },
          select: {
            id: true,
          },
        });
      }

      /*************************************
       * 3. Resolve or create Conversation
       *************************************/
      let conversation = await tx.conversation.findFirst({
        where: { businessProfileId, contactId: contact.id, status: 'OPEN' },
        select: {
          id: true,
        },
      });
      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            businessProfileId,
            contactId: contact.id,
            channel: 'WHATSAPP',
            lastMessageAt: new Date(),
            lastMessagePreview: params.content.slice(0, 120),
          },
          select: {
            id: true,
          },
        });
      } else {
        await tx.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(),
            lastMessagePreview: params.content.slice(0, 120),
          },
          select: {
            id: true,
          },
        });
      }

      /****************************
       * 4. Create INBOUND Message
       ****************************/
      const message = await tx.message.create({
        data: {
          businessProfileId,
          conversationId: conversation.id,
          senderContactId: contact.id,
          direction: 'INBOUND',
          type: MessageType.TEXT,
          content: params.content,
          whatsappMessageId: params.whatsappMessageId,
          deliveryStatus: 'SENT',
        },
        select: {
          id: true,
        },
      });
      return { contact, conversation, message };
    });
  } catch (err) {
    console.error('❌ DB transaction error:', getErrorMessage(err));
    return failure('Database transaction failed', 500);
  }
}

async function handleWhatsAppStatusUpdate(params: TStatusUpdateParams) {
  await prisma.message.update({
    where: {
      whatsappMessageId: params.whatsappMessageId,
    },
    data: {
      deliveryStatus: params.status,
    },
  });
}
