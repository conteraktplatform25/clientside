import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  CreateMessageResponseSchema,
  CreateMessageSchema,
  TCreateMessageResponse,
} from '@/lib/schemas/business/server/inbox.schema';
import { WhatsAppSendResponse, WhatsAppTextMessagePayload } from '@/lib/whatsapp/whatsapp.types';
import { getErrorMessage } from '@/utils/errors';
import { failure, fetchMetaAPI, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const conv = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        businessProfileId: true,
        businessProfile: { select: { company_name: true, business_number: true } },
        contact: { select: { name: true, phone_number: true, whatsapp_opt_in: true } },
        channel: true,
      },
    });
    if (!conv) return failure('Conversation cannot be found', 404);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = CreateMessageSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const { mediaUrl, content } = parsed.data;

    // create message as OUTBOUND
    const responseData = await prisma.message.create({
      data: {
        conversationId: id,
        businessProfileId,
        senderUserId: user.id,
        direction: 'OUTBOUND',
        type: mediaUrl ? 'IMAGE' : 'TEXT',
        content: content,
        mediaUrl: mediaUrl ?? null,
        deliveryStatus: 'PENDING',
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
    const normalizedMessage: TCreateMessageResponse = {
      ...responseData,
      created_at: responseData.created_at.toISOString(),
    };

    // update conversation preview
    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date(), lastMessagePreview: content ?? mediaUrl ?? null },
      select: { id: true },
    });

    if (conv.contact && conv.contact.whatsapp_opt_in && conv.channel === 'WHATSAPP') {
      const ACCESS_TOKEN = process.env.META_AI_WHATSAPP_ACCESS_TOKEN!;
      const PHONE_NUMBER_ID = process.env.META_AI_WHATSAPP_PHONE_NUMBER_ID!;
      const API_VERSION = process.env.META_AI_WHATSAPP_API_VERSION!;
      const BASE_URL = process.env.META_AI_WHATSAPP_BASEURL;

      const WHATSAPP_ENDPOINT = `${BASE_URL}/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
      await processMetaAIOutboundWhatsAppMessage(
        normalizedMessage,
        conv.contact.phone_number,
        ACCESS_TOKEN,
        WHATSAPP_ENDPOINT
      );
    }

    const messageProfile = CreateMessageResponseSchema.parse(normalizedMessage);

    return success({ messageProfile }, 'Message delivered successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /inbox/conversations/[id]/messages error:', err);
    return failure(message, 500);
  }
}

async function processMetaAIOutboundWhatsAppMessage(
  messageData: TCreateMessageResponse,
  contactPhoneNumber: string,
  access_token: string,
  metaAI_message_endpoint: string
) {
  if (!messageData.conversationId || !contactPhoneNumber) throw new Error('Invalid request body.');

  const payload: WhatsAppTextMessagePayload = {
    messaging_product: 'whatsapp',
    to: contactPhoneNumber,
    type: 'text',
    text: { body: messageData.content! },
  };
  try {
    const response = await fetchMetaAPI<WhatsAppSendResponse>(metaAI_message_endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response) throw new Error('Failed to connect to whatsapp service.');
    if (!response.messages || response.messages.length < 1) throw new Error('Failed to retrieve whatsapp Message ID.');

    const whatsappMessageId = response.messages[0].id;

    // update message record with SID and delivered status (SENT)
    await prisma.$transaction([
      prisma.message.update({
        where: { id: messageData.id },
        data: { whatsappMessageId, deliveryStatus: 'SENT', rawPayload: response },
      }),
      prisma.conversation.update({
        where: { id: messageData.conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessagePreview: messageData.content?.slice(0, 120),
        },
      }),
    ]);

    return;
  } catch (err) {
    console.error('Meta AI connection failed', getErrorMessage(err));
    await prisma.message.update({
      where: { id: messageData.id },
      data: { deliveryStatus: 'FAILED', rawPayload: { error: String(err) } },
    });
  }
}

// export function resolveWhatsAppPayload(input: TSendWhatsAppMessageInput) {
//   switch (input.type) {
//     case 'TEXT':
//       return {
//         messaging_product: 'whatsapp',
//         to: input.to,
//         type: 'text',
//         text: {
//           body: input.content,
//         },
//       };

//     case 'IMAGE':
//       return {
//         messaging_product: 'whatsapp',
//         to: input.to,
//         type: 'image',
//         image: {
//           link: input.imageUrl,
//           caption: input.caption,
//         },
//       };

//     case 'VIDEO':
//       return {
//         messaging_product: 'whatsapp',
//         to: input.to,
//         type: 'video',
//         video: {
//           link: input.videoUrl,
//           caption: input.caption,
//         },
//       };

//     case 'DOCUMENT':
//       return {
//         messaging_product: 'whatsapp',
//         to: input.to,
//         type: 'document',
//         document: {
//           link: input.documentUrl,
//           filename: input.filename,
//         },
//       };

//     case 'TEMPLATE':
//       return {
//         messaging_product: 'whatsapp',
//         to: input.to,
//         type: 'template',
//         template: {
//           name: input.templateName,
//           language: {
//             code: input.language ?? 'en_US',
//           },
//         },
//       };

//     default:
//       throw new Error('Unsupported WhatsApp message type');
//   }
// }
